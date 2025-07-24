import { Player } from "../models/interfaces";
import { Quiz } from "../Quiz/Quiz";

export class Room {

    
    hostID: string = 'null';
    roomID: string = 'null';
    roomCode: string = 'null';
    players: Array<Player> = [];
    quiz: Quiz = new Quiz();
    
    public Room(hostID:string,roomID:string, roomCode:string, quiz:Quiz){
        this.hostID = hostID;
        this.roomID = roomID;
        this.roomCode = roomCode;
        this.quiz= quiz;
        this.players = new Array<Player>();
    }
    public AddPlayer(newPlayer:Player){
        this.players.push(newPlayer);
    }

    
}