import { QuizClient, Host, Player } from "../models/interfaces";
import { Quiz } from "../Quiz/Quiz";
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
    
    public Room(hostID:string,roomID:string, roomCode:string, quiz:Quiz, maxPlayers:number){
        this.hostID = hostID;
        this.roomID = roomID;
        this.roomCode = roomCode;
        this.quiz= quiz;
        this.maxPlayers = maxPlayers;
        this.players = new Array<Player>();
        this.clients = new Array<QuizClient>();
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