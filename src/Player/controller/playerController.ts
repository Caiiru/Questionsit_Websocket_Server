
import { Socket } from 'socket.io';
import { io } from '../../app';
import { ConnectionEvents } from '../../events/connectionEvents';
import { RoomService } from '../../Room/RoomService';
import { HostRequest } from './requests/HostRequest'
import { logDebug, logError, logInfo } from '../../utils/logger';
import { CreateRoomRequest } from '../../Room/requests/CreateRoomRequest';
import { HostResponse } from './responses/HostResponse';
import { ConnectionResponse } from './responses/ConnectionResponse';
import { Host, Player } from '../model/Client';
import { playerEvents } from '../../events/playerEvents';
import { PlayerAnswerRequest } from '../../Quiz/controller/requests/PlayerAnswerRequest';
import { quizService } from '../../Quiz/QuizService';

const SENDER_NAME = "PlayerController";

export class PlayerController {


    constructor(private roomService: RoomService) {

    }
    public setHandlers(socket:Socket){
        this.handlePlayerAnswer(socket);
        this.handlePlayerJoin(socket);
        this.handlePlayerHostGame(socket);
        this.handlePlayerDisconnect(socket);
    }
    public handlePlayerHostGame = (socket: Socket) => {
        socket.on(ConnectionEvents.HostGame, (data: HostRequest,) => {

            let room = this.roomService.CreateRoom(data as CreateRoomRequest);
            if (!room) {
                socket.emit(ConnectionEvents.RoomCreationFailure);
                return;
            }
            let hostPlayer: Host = {
                id: data.hostID,
                name: data.hostName,
                socketId: socket.id

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
    }

    public handlePlayerJoin = (socket: Socket) => {
        socket.on(ConnectionEvents.JoinGame, (data: { roomCode: string, username: string, playerID: string, },) => {


            let room = this.roomService.GetRoomByCode(data.roomCode);

            if (!room) {
                socket.emit(ConnectionEvents.RoomJoinFailure, { message: "Room not found" });
                logError(SENDER_NAME, `Connection Failure: ${data.playerID}: ${data.username} - room: ${data.roomCode}`, `Room not found`);
                return;
            }

            const newPlayer: Player = {
                id: data.playerID,
                name: data.username,
                score: 0,
                socketId: socket.id,
                cards: '0,0'
            };
            room.AddPlayer(newPlayer);
            socket.join(data.roomCode);

            (socket as any).playerName = data.username; // Atribuição para uso em disconnect

            const playersList = room?.players;
            const connectionResponse: ConnectionResponse = {
                hostName: room.GetClientByID(room.hostID).name,
                hostID: room.hostID,
                roomCode: room.roomCode,
                roomID: room.roomID

            }

            io.to(data.roomCode).emit(`${ConnectionEvents.PlayerJoined}`, newPlayer); // Envia lista atual de jogadores
            socket.emit(`${ConnectionEvents.RoomJoinSuccess}`, connectionResponse as ConnectionResponse);
            socket.emit(ConnectionEvents.UpdatePlayers, playersList);

            logDebug(SENDER_NAME, `${newPlayer.name} joined room: ${room.roomCode}`);
        });


    };

    public handlePlayerAnswer = (socket:Socket) => {
        socket.on(playerEvents.SUBMIT_ANSWER, (data:PlayerAnswerRequest)=> { 
            this.roomService.SetPlayerAnswer(data);
            

        });
    }

    public handlePlayerDisconnect = (socket: Socket) => {
        socket.on('disconnect', () => {
            console.log(`Um usuário desconectado: ${socket.id}`);
            
            // quizService.removePlayerBySockedID(socket.id);
            if(this.roomService.removePlayerBySocketID(socket.id)){

            }

            // if ((socket as any).playerName) {
            //     io.emit(`${ConnectionEvents.PlayerLeft}`, { playerName: (socket as any).playerName, playerId: socket.id });
            // }
            // io.emit(`${ConnectionEvents.UpdatePlayers}`, quizService.getCurrentQuizState().players);
        });
    };


}


