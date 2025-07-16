// src/controllers/playerController.ts
import { Socket } from 'socket.io';
import { quizService } from '../services/quizService';
import { io } from '../app'; // Para emitir eventos para todos os clientes
import { Player } from '../models/interfaces';

export const handlePlayerJoin = (socket: Socket) => {
    socket.on('joinGame', (data: { playerName: string }) => {
        const newPlayer: Player = {
            id: socket.id,
            name: data.playerName,
            score: 0,
            socketId: socket.id
        };
        quizService.addPlayer(newPlayer);
        (socket as any).playerName = data.playerName; // Atribuição para uso em disconnect

        console.log(`Jogador ${newPlayer.name} (${socket.id}) entrou no jogo.`);
        socket.emit('welcome', { message: `Bem-vindo ao quiz, ${newPlayer.name}!` });
        io.emit('playerJoined', newPlayer); // Notifica todos
        io.emit('currentPlayers', quizService.getCurrentQuizState().players); // Envia lista atual de jogadores
    });
};

export const handlePlayerDisconnect = (socket: Socket) => {
    socket.on('disconnect', () => {
        console.log(`Um usuário desconectado: ${socket.id}`);
        quizService.removePlayer(socket.id);
        if ((socket as any).playerName) {
            io.emit('playerLeft', { playerName: (socket as any).playerName, playerId: socket.id });
        }
        io.emit('currentPlayers', quizService.getCurrentQuizState().players);
    });
};
