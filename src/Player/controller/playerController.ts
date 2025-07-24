// src/controllers/playerController.ts
import { Socket } from 'socket.io';
import { quizService } from '../../services/quizService';
import { io } from '../../app'; // Para emitir eventos para todos os clientes
import { Player } from '../../models/interfaces';
import { ConnectionEvents } from '../../utils/connectionEvents';
import { RoomService } from '../../Room/RoomService';
import { Room } from '../../Room/Room';

const SENDER_NAME = "PlayerController";

export const handlePlayerJoin = (socket: Socket) => {

    var roomService: RoomService = new RoomService();

    io.on(ConnectionEvents.HostGame, (data: { roomCode: string, playerID: string },) => {
        if(roomService.GetRoomByCode(data.roomCode)){
            //Already Exist
            socket.emit(ConnectionEvents.RoomCreationFailure);
        }
        roomService.CreateRoom(data.playerID,data.roomCode);

        socket.rooms.add(data.roomCode);
        socket.join(data.roomCode);

        socket.emit(ConnectionEvents.RoomCreationSuccess)
    });

    io.on(ConnectionEvents.JoinGame, (data: { roomCode: string, username: string, playerID: string, },) => {

        //Check if room exist
        /*
        if(quizService.getRoom(roomCode)){

        }
        */
        // console.log(`[${SENDER_NAME}] Received Room Join Sucess ` );


        console.log(data);
        const newPlayer: Player = {
            id: data.playerID,
            name: data.username,
            score: 0,
            socketId: socket.id
        };
        socket.rooms.add(data.roomCode);
        socket.join(data.roomCode);

        // socket.to(data.roomCode).emit(ConnectionEvents.RoomJoinSucess);
        // quizService.getRoom(data.roomCode);
        // quizService.addPlayer(newPlayer);

        roomService.AddPlayer(data.roomCode, newPlayer);

        (socket as any).playerName = data.username; // Atribuição para uso em disconnect

        // console.log(`[${SENDER_NAME}] Jogador ${data.username}-${newPlayer.id} - (${socket.id}):  entrou no jogo.`);
        // socket.emit('welcome', { message: `Bem-vindo ao quiz, ${newPlayer.name}!` });
        // io.emit(`${ConnectionEvents.PlayerJoined}`, newPlayer); // Notifica todos
        const playersList = roomService.GetRoomByCode(data.roomCode)?.players;
        console.log(`Players List: ${playersList}`);
        socket.emit(`${ConnectionEvents.RoomJoinSuccess}`);
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
