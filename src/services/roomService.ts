import { IRoom } from "../models/room";
 

class RoomService{
    roomsActive:Array<IRoom> = [];

    AddRoom(newRoom:IRoom){
        this.roomsActive.push(newRoom);
    }
    RemoveRoomByID(roomCode:string){
        this.roomsActive = this.roomsActive.filter(r => r.roomCode !== roomCode)
    }

    GetRoom(roomCode:string){
        const room = this.roomsActive.find(r => r.roomCode === roomCode);
        if(!room)
            return room;

    }
}
 