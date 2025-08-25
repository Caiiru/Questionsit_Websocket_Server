// src/app.ts
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { IndexController } from './Controllers';
import { logInfo, logError } from './utils/logger';

export const app = express();
export const httpServer = createServer(app);
export const io = new SocketIOServer(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.get('/', (req, res) => {
    res.send('<h1>Servidor de Quiz WebSocket está rodando!</h1>');
});

const indexController = new IndexController();
indexController.registerSocketHandlers(io); 

export const startServer = (port: number) => {
    httpServer.listen(port, () => {
        // Passando 'ServerCore' como sender
        logInfo('ServerCore', `Servidor HTTP e WebSocket escutando na porta ${port}`);
    }).on('error', (err: Error) => {
        // Passando 'ServerCore' como sender
        logError('ServerCore', 'Erro ao iniciar o servidor HTTP:', err);
        process.exit(1);
    });
};