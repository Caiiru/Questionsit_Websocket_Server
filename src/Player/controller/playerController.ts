// src/controllers/playerController.ts
import { Socket } from 'socket.io';
import { quizService } from '../../services/quizService';
import { io } from '../../app'; // Para emitir eventos para todos os clientes
import { Host, Player } from '../../models/interfaces';
import { ConnectionEvents } from '../../utils/connectionEvents';
import { RoomService } from '../../Room/RoomService';
import { HostRequest } from './requests/HostRequest'
import { logError, logInfo } from '../../utils/logger';
import { CreateRoomRequest } from '../../Room/requests/CreateRoomRequest';
import { HostResponse } from './responses/HostResponse';
import { ConnectionResponse } from './responses/ConnectionResponse';

const SENDER_NAME = "PlayerController";

var roomService: RoomService = new RoomService();

export const handlePlayerJoin = (socket: Socket) => {


    socket.on(ConnectionEvents.HostGame, (data: HostRequest,) => {
        // if(roomService.GetRoomByCode(data)){
        //     //Already Exist
        //     socket.emit(ConnectionEvents.RoomCreationFailure);
        // }

        // console.log(data);


        let room = roomService.CreateRoom(data as CreateRoomRequest);
        if (!room) {
            socket.emit(ConnectionEvents.RoomCreationFailure);
            return;
        }
        let hostPlayer:Host = {
            id: data.hostID,
            name:data.hostName,
            socketId:socket.id

        } 
        room.AddClient(hostPlayer);
        socket.rooms.add(room?.roomCode);
        socket.join(room.roomCode);
 
        const hostResponse: HostResponse = {
            roomCode: room.roomCode,
            roomID: room.roomID
        }

        socket.emit(ConnectionEvents.RoomCreationSuccess, hostResponse as HostResponse);
    });


    socket.on(ConnectionEvents.JoinGame, (data: { roomCode: string, username: string, playerID: string, },) => {
 

        let room = roomService.GetRoomByCode(data.roomCode);

        if (!room) {
            socket.emit(ConnectionEvents.RoomJoinFailure);
            logError(SENDER_NAME, `Connection Failure: ${data.playerID}: ${data.username} - room: ${data.roomCode}`);
            return;
        }
 

        const newPlayer: Player = {
            id: data.playerID,
            name: data.username,
            score: 0,
            socketId: socket.id
        }; 

        room.AddPlayer(newPlayer);


        socket.join(data.roomCode); 


        (socket as any).playerName = data.username; // Atribuição para uso em disconnect
 
        const playersList = room?.players; 

        const connectionResponse: ConnectionResponse = {
            hostName: room.GetClientByID(room.hostID).name,
            hostID:room.hostID,
            roomCode: room.roomCode,
            roomID: room.roomID
            
        }

        socket.emit(`${ConnectionEvents.RoomJoinSuccess}`,connectionResponse as ConnectionResponse);

        io.to(data.roomCode).emit(`${ConnectionEvents.UpdatePlayers}`, playersList); // Envia lista atual de jogadores

    });

};

export const handlePlayerDisconnect = (socket: Socket) => {
    socket.on('disconnect', () => {
        console.log(`Um usuário desconectado: ${socket.id}`);
        // const player = quizService.

        quizService.removePlayerBySockedID(socket.id);

        if ((socket as any).playerName) {
            io.emit(`${ConnectionEvents.PlayerLeft}`, { playerName: (socket as any).playerName, playerId: socket.id });
        }
        io.emit(`${ConnectionEvents.UpdatePlayers}`, quizService.getCurrentQuizState().players);
    });
};
