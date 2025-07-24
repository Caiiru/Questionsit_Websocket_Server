import { Player } from "../models/interfaces";
import { Room } from "./Room";

export class RoomService {
    Rooms: Array<Room> = [];

    public CreateRoom(hostID: string, roomCode: string): Room | null {
        //VALIDATE HOST ID

        if (hostID == 'null' || !hostID) {
            console.error("Failure on create room: Host not identified");
            return null;
        }
        console.log(`[RoomService]: Creating Room.. hostID:${hostID}`);
        const newRoom: Room = new Room();
        newRoom.hostID = hostID;
        newRoom.roomCode = roomCode;
        newRoom.roomID = String(Math.random()*1223);

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
        if (!room) {
            room = this.CreateRoom(newPlayer.id, roomCode);
            console.log(room?.hostID);
        }

        room?.AddPlayer(newPlayer);
        // this.players.push(newPlayer);
    }

}