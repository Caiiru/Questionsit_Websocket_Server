import { Client } from "socket.io/dist/client";
import { io } from "../app";
import { ConnectionEvents } from "../events/connectionEvents";
import { Player, QuizClient } from "../Player/model/Client";
import { StartQuizRequest } from "../Quiz/controller/requests/StartQuizRequest";
import { QuestionResponse } from "../Quiz/controller/responses/QuestionResponse";
import { Question, SendQuestion } from "../Quiz/models/Question";
import { logError } from "../utils/logger";
import { QuizLoader } from "../utils/QuizLoader";
import { CreateRoomRequest } from "./requests/CreateRoomRequest";
import { Room, RoomState } from "./Room";
import { PlayerAnswerRequest } from "../Quiz/controller/requests/PlayerAnswerRequest";
import { QuestionState } from "../Quiz/models/QuizState";

export class RoomService {
    // Rooms: Array<Room> = [];
    Rooms: Map<string, Room> = new Map<string, Room>();

    SENDER_NAME: string = "RoomService";

    public CreateRoom(request: CreateRoomRequest): Room | null {
        //VALIDATE HOST ID

        if (request.hostID == 'null' || !request.hostID) {
            console.error("Failure on create room: Host not identified");
            return null;
        }

        const newRoom: Room = new Room();
        newRoom.hostID = request.hostID;
        newRoom.maxPlayers = request.maxPlayers;
        newRoom.roomID = String(Math.random() * 1223);

        newRoom.roomCode = request.roomCode ? request.roomCode : this.GenerateRoomCode();

        //GET ROOM FROM SERVER RESTFUL
        const _quiz = new QuizLoader().StartQuizLoader();
        if (_quiz != null) {
            newRoom.quiz = _quiz;
        }

        this.Rooms.set(newRoom.roomCode, newRoom);
        // this.Rooms.push(newRoom);
        return newRoom;
    }

    public GetRoomByCode(roomCode: string): Room | null {
        // const room = this.Rooms.find(r => r.roomCode == roomCode);
        const room = this.Rooms.get(roomCode);

        if (!room || room == undefined) return null;
        return room;

    }

    public AddPlayer(roomCode: string, newPlayer: Player) {
        var room = this.GetRoomByCode(roomCode);

        room?.AddPlayer(newPlayer);
        // this.players.push(newPlayer);
    }
    public AddClient(roomCode: string, newClient: QuizClient) {
        var room = this.GetRoomByCode(roomCode);
        room?.AddClient(newClient);
    }

    StartQuiz(quizRequest: StartQuizRequest): QuestionResponse | null {
        //First Validate Room
        const _room: Room | null = this.GetRoomByCode(quizRequest.roomCode);

        if (!_room) return null;

        //Validate Host
        if (quizRequest.hostID != _room.hostID) {
            logError(this.SENDER_NAME, `Host id invalid: required=${_room.hostID}, received: ${quizRequest.hostID}`);
            return null
        };

        if (!this.ChangeRoomState(_room, RoomState.Question)) return null;

        const _questionResponse: QuestionResponse | null = this.GetCurrentRoomQuestion(_room);

        if (!_questionResponse || _questionResponse == null) return null;


        return _questionResponse;
    }

    public ChangeRoomState(room: Room, newState: RoomState): boolean {

        room.currentState = newState;

        return true;
    }
    public GetCurrentRoomQuestionByRoomCode(roomCode: string): QuestionResponse | null {
        var room = this.GetRoomByCode(roomCode);
        if (!room) return null;

        return this.GetCurrentRoomQuestion(room);

    }
    private GetCurrentRoomQuestion(room: Room): QuestionResponse | null {

        const _question: Question | null = this.GetQuestionByNumber(room, room.currentQuestion);
        if (_question == null) return null;

        const _sendQuestion:SendQuestion = new SendQuestion(_question);
        
        const questionResponse: QuestionResponse = {
            question: _sendQuestion,
            serverStartTime: Date.now(),
        }


        return questionResponse;
    }

    public GetNextRoomQuestion(roomCode: string): QuestionResponse | null {
        var room = this.GetRoomByCode(roomCode);
        if (!room) return null;

        this.IncreaseQuestionCounter(room);

        return this.GetCurrentRoomQuestion(room);

    }

    GetQuestionByNumber(room: Room, n: number): Question | null {
        const quizQuestions = room.quiz.questions;

        if (quizQuestions.length < n) return null;

        const questionState: QuestionState = {
            questionStartTime: Date.now(),
            playersTime: new Map<string, number>(),
            correctAnswer: room.GetCorrectQuestAnswer()
        }
        room.questionsStates[n] = questionState;

        return room.quiz.questions[n];

    }

    IncreaseQuestionCounter(room: Room) {
        room.currentQuestion++;
    }
    public removePlayerBySocketID(socketID: string): boolean {
        this.Rooms.forEach(room => {
            if (room.GetHost().socketId === socketID) {
                this.ClearRoom(room);
                console.log(`Host with ID ${socketID} disconnected, clearing room.`);
                return false;
            }
            const p: QuizClient | undefined = room.players.find(p => p.socketId === socketID);

            if (!p) return false;

            io.to(room.roomCode).emit(ConnectionEvents.PlayerLeft, p as QuizClient);


            console.log(`${p} disconnected, removing from room.`);
            // Remove player and client from the room
            room.clients = room.clients.filter(client => client.socketId !== socketID);
            room.players = room.players.filter(player => player.socketId !== socketID);

            return true;
            //break for each to stop after finding the first room with the 
            // io.to(room.roomCode).emit(ConnectionEvents.UpdatePlayers, room.players); // Envia lista atualizada de jogadores


        });
        return false;
    }
    public ClearRoom(room: Room): void {
        io.to(room.roomCode).emit(ConnectionEvents.Disconnected, { message: "Host disconnected, room will be cleared." });
        this.Rooms.delete(room.roomCode);
    }

    public SetPlayerAnswer(data: PlayerAnswerRequest):boolean {
        const room = this.GetRoomByCode(data.roomCode);
        if (!room) return false;
        room.SetPlayerAnswer(data.playerID, String(data.answer), room.currentQuestion, data.answerTime);

        const currentAnswers = room.PlayersAnswers.size;
        // console.log(`Current Answers: ${currentAnswers}`); 
        const canFinish = currentAnswers == room.players.length;


        return canFinish;

    }

    public async handlePoints(room: Room) {
        const currentQuestionState = room.questionsStates[room.currentQuestion];
        const currentAnswer: number = currentQuestionState.correctAnswer;
        const questionStartTime: number = currentQuestionState.questionStartTime;

        const difficultyPoints = 100;
        const timeBonus = 2;

        room.players.forEach(player => {
            let addPlayerPoints = 0;

            const playerAnswer = room.PlayersAnswers.get(player.id)?.charAt(room.currentQuestion);
            //Check if answer is correct
            const isCorrect = playerAnswer == String(currentAnswer) ? true : false;

            addPlayerPoints += isCorrect ? difficultyPoints : difficultyPoints * 0.2;

            //Check player time
            let playerTime = currentQuestionState.playersTime.get(player.id);
            if (playerTime == undefined) {
                //Set player time to max possible
                // O usuário, quando o bonus de tempo estiver ativo, vai ganhar, pelo menos, 
                // 1s de bonus pelo tempo, pois terá respondido no último segundo. Só ganha se resposta for correta.

                playerTime = currentQuestionState.questionStartTime + ((room.quiz.questions[room.currentQuestion].time - 1) * 1000);
            }

            const playerAnswerTime = ((playerTime - questionStartTime) / 1000) * timeBonus;
            if (isCorrect)
                addPlayerPoints += playerAnswerTime;

            player.score += addPlayerPoints;


        }) 
    }

    public GenerateRoomCode(): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < 5; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        if (this.GetRoomByCode(result) != null) {
            result = this.GenerateRoomCode();
        }

        return result;
    }

    GetPlayerAnswer() {

    }

}