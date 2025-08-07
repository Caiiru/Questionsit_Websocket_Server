import { Player, QuizClient } from "../Player/model/Client";
import { QuizLoader } from "../utils/QuizLoader";
import { CreateRoomRequest } from "./requests/CreateRoomRequest";
import { Room } from "./Room";

export class RoomService {
    Rooms: Array<Room> = [];

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
        if(_quiz!=null){
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