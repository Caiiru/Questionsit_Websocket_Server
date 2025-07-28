import { Player } from "../models/interfaces";
import { Quiz } from "../Quiz/Quiz";

export class Room { 
    hostID: string = 'null';
    roomID: string = 'null';
    roomCode: string = 'null';
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
    }
    public AddPlayer(newPlayer:Player){
        this.players.push(newPlayer);
    }

    
}