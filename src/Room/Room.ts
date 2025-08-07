import { QuizClient, Host, Player } from "../Player/model/Client";
import { Quiz } from "../Quiz/Grasp";
import { logInfo } from "../utils/logger";

const SENDER_NAME = "Room";

export class Room { 
    hostID: string = 'null';
    roomID: string = 'null';
    roomCode: string = 'null'; 
    clients:Array<QuizClient> = [];
    players: Array<Player> = [];
    maxPlayers:number = 1;
    quiz: Quiz = new Quiz();
    currentState:RoomState = RoomState.Lobby;
    currentQuestion:number = 0;

    
    public Room(hostID:string,roomID:string, roomCode:string, quiz:Quiz, maxPlayers:number){
        this.hostID = hostID;
        this.roomID = roomID;
        this.roomCode = roomCode;
        this.quiz= quiz;
        this.maxPlayers = maxPlayers;
        this.players = new Array<Player>();
        this.clients = new Array<QuizClient>();
        this.currentState = RoomState.Lobby;
        this.currentQuestion = 0;
    }
    public AddClient(newClient:QuizClient){
        this.clients.push(newClient);
    }
    public AddPlayer(newPlayer:Player){
        this.players.push(newPlayer);
        this.AddClient(newPlayer);
    }
    public GetPlayerByID(playerID:string):Player{
        return this.players.filter(p => p.id === playerID)[0];
    }

    public GetClientByID(clientID:string):QuizClient{
        let quizClient = this.clients.filter(p => p.id === clientID)[0];
        logInfo(SENDER_NAME,`${quizClient}`);
        return quizClient;
    }

    
}

export enum RoomState{
    Lobby="Lobby",
    Question="ShowingQuestion",
    Answers="ShowingAnswers",
    Rank="ShowingRank",
    Cards="CardsChoice",

}