import { QuizClient, Host, Player } from "../Player/model/Client";
import { Quiz } from "../Quiz/Grasp";
import { Question } from "../Quiz/models/Question";
import { QuestionState } from "../Quiz/models/QuizState";
import { logInfo } from "../utils/logger";

const SENDER_NAME = "Room";

export class Room {
    hostID: string = 'null';
    roomID: string = 'null';
    roomCode: string = 'null';
    clients: Array<QuizClient> = [];
    players: Array<Player> = [];
    maxPlayers: number = 1;
    quiz: Quiz = new Quiz();
    currentState: RoomState = RoomState.Lobby;
    currentQuestion: number = 0;
    PlayersAnswers: Map<string, string> = new Map<string, string>();
    questionsStates:Array<QuestionState> = [];



    public Room(hostID: string, roomID: string, roomCode: string, quiz: Quiz, maxPlayers: number) {
        this.hostID = hostID;
        this.roomID = roomID;
        this.roomCode = roomCode;
        this.quiz = quiz;
        this.maxPlayers = maxPlayers;
        this.players = new Array<Player>();
        this.clients = new Array<QuizClient>();
        this.currentState = RoomState.Lobby;
        this.currentQuestion = 0;
    }
    public AddClient(newClient: QuizClient) {
        this.clients.push(newClient);
    }
    public AddPlayer(newPlayer: Player) {
        this.players.push(newPlayer);
        this.AddClient(newPlayer);
    }
    public GetPlayerByID(playerID: string): Player {
        return this.players.filter(p => p.id === playerID)[0];
    }

    public GetClientByID(clientID: string): QuizClient {
        let quizClient = this.clients.filter(p => p.id === clientID)[0];
        logInfo(SENDER_NAME, `${String(quizClient)}`);
        return quizClient;
    }
    public SetPlayerAnswer(playerID: string, answer: string, questionIndex: number, answerTime:number) {
        if (this.quiz.questions[questionIndex] == null) return false;

        this.questionsStates[questionIndex].playersTime.set(playerID,answerTime);

        const currentQuestion = this.quiz.questions[questionIndex];
        
        
        
        //First Question
        if (this.PlayersAnswers.get(playerID) == null) { 
            
            this.PlayersAnswers.set(playerID, answer)  
            console.log(this.PlayersAnswers.entries()); 
            return;
        };
        console.log("+ Option");
        const _answer = this.GetPlayerAnswer(playerID);

        this.PlayersAnswers.set(playerID, _answer + answer);
    }
    public GetPlayerAnswer(playerID: string): string | null {
        return this.PlayersAnswers.get(playerID) || null;
    }
    public GetHost():Host{
        return this.GetClientByID(this.hostID) as Host;
    }

    public GetCorrectQuestAnswer():number{
        let loopIndex:number = 0;
        const answers = this.quiz.questions[this.currentQuestion].answers;  

        let correctAnswer = 0;

        answers.forEach(answer => {
            if(answer.correct==1){
                correctAnswer= loopIndex;
                
            }
            loopIndex++;
        });
        return correctAnswer;
    }

}

export enum RoomState {
    Lobby = "Lobby",
    Question = "ShowingQuestion",
    Answers = "ShowingAnswers",
    Rank = "ShowingRank",
    Cards = "CardsChoice",

}