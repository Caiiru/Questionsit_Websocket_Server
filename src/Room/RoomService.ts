import { Player, QuizClient } from "../Player/model/Client";
import { StartQuizRequest } from "../Quiz/controller/requests/StartQuizRequest";
import { QuestionResponse } from "../Quiz/controller/responses/QuestionResponse";
import { Question } from "../Quiz/models/Question";
import { logError } from "../utils/logger";
import { QuizLoader } from "../utils/QuizLoader";
import { CreateRoomRequest } from "./requests/CreateRoomRequest";
import { Room, RoomState } from "./Room";

export class RoomService {
    Rooms: Array<Room> = [];

    SENDER_NAME:string = "RoomService";

    public CreateRoom(request: CreateRoomRequest): Room | null {
        //VALIDATE HOST ID

        if (request.hostID == 'null' || !request.hostID) {
            console.error("Failure on create room: Host not identified");
            return null;
        }
        const newRoom: Room = new Room();
        newRoom.hostID = request.hostID;
        newRoom.roomCode = this.GenerateRoomCode();
        newRoom.maxPlayers = request.maxPlayers;
        newRoom.roomID = String(Math.random() * 1223);

        //GET ROOM FROM SERVER RESTFUL
        const _quiz = new QuizLoader().StartQuizLoader();
        if (_quiz != null) {
            newRoom.quiz = _quiz;
        }

        console.log(`[RoomService]: Creating Room.. hostID: ${request.hostID} / Max Players: ${newRoom.maxPlayers}, RoomCode ${newRoom.roomCode}`);
        console.log(`[RoomService]: Grasp: ${newRoom.quiz.graspName}`);
        this.Rooms.push(newRoom);
        return newRoom;
    }

    public GetRoomByCode(roomCode: string): Room | null {
        const room = this.Rooms.find(r => r.roomCode == roomCode);

        if (!room || room == undefined) return null;
        console.log(`FIND ROOM WITH CODE: ${roomCode}`);
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

        const _questionResponse: QuestionResponse | null = this.GetCurrentRoomQuestionByRoomCode(quizRequest.roomCode);

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

        const questionResponse: QuestionResponse = {
            question: _question,
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

        return room.quiz.questions[n];

    }

    IncreaseQuestionCounter(room: Room) {
        room.currentQuestion++;
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

}