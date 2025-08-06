
// src/controllers/index.ts (para agrupar e registrar todos os handlers)
import { Server as SocketIOServer, Socket } from 'socket.io';
import { handlePlayerJoin, handlePlayerDisconnect } from '../Player/controller/playerController'; 
import { logInfo, logDebug, logError } from '../utils/logger';
import { ConnectionEvents } from '../utils/connectionEvents';

const SENDER_NAME = "IndexController"

export const registerSocketHandlers = (io: SocketIOServer) => {
    io.on('connect', (socket: Socket) => {
        logInfo(SENDER_NAME, `Socket conectado: ${socket.id}. Transport ${socket.handshake}; IP: ${socket.handshake.address}`);

        // logInfo(SENDER_NAME, `Handshake Query: ${JSON.stringify(socket.handshake.query)}`);
        // logInfo(SENDER_NAME, `Handshake Headers: ${JSON.stringify(socket.handshake.headers)}`);

        // Registra todos os handlers para este socket
        handlePlayerJoin(socket);
        handlePlayerDisconnect(socket);
        // handleSubmitAnswer(socket);
        // handleQuizStart(socket); // Somente para admins ou um evento de início de quiz
        
        socket.emit(ConnectionEvents.Connecting, {message:"Connection Stablished"});

        socket.on('disconnect', (reason: string) => {
            logInfo(SENDER_NAME, `DESCONEXÃO. ID do Socket: ${socket.id}. Razão: ${reason}`);
        });
    });
};