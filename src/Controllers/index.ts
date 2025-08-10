
// src/controllers/index.ts (para agrupar e registrar todos os handlers)
import { Server as SocketIOServer, Socket } from 'socket.io';
import { logInfo, logDebug, logError } from '../utils/logger';
import { ConnectionEvents } from '../events/connectionEvents';
import { PlayerController } from '../Player/controller/PlayerController'
import { RoomService } from '../Room/RoomService';
import { QuizController } from '../Quiz/controller/QuizController';

const SENDER_NAME = "IndexController"

export class IndexController {
    private roomService: RoomService = new RoomService();

    private playerController: PlayerController = new PlayerController(this.roomService);
    private quizController:QuizController = new QuizController(this.roomService);
    constructor() {
        this.roomService = new RoomService();
        this.playerController = new PlayerController(this.roomService);
        this.quizController = new QuizController(this.roomService);
    }

    registerSocketHandlers = (io: SocketIOServer) => {
        io.on('connect', (socket: Socket) => {
            logInfo(SENDER_NAME, `Socket conectado: ${socket.id}. Transport ${socket.handshake}; IP: ${socket.handshake.address}`);

            // logInfo(SENDER_NAME, `Handshake Query: ${JSON.stringify(socket.handshake.query)}`);
            // logInfo(SENDER_NAME, `Handshake Headers: ${JSON.stringify(socket.handshake.headers)}`);

            // Registra todos os handlers para este socket
            // handlePlayerJoin(socket);
            // handlePlayerDisconnect(socket);
            // handleSubmitAnswer(socket);
            // handleQuizStart(socket); // Somente para admins ou um evento de início de quiz
 
            this.playerController.setHandlers(socket);
            this.quizController.handleStartQuiz(socket);


            socket.emit(ConnectionEvents.Connecting, { message: "Connection Stablished" });

            socket.on('disconnect', (reason: string) => {
                logInfo(SENDER_NAME, `DESCONEXÃO. ID do Socket: ${socket.id}. Razão: ${reason}`);
            });
        });
    };
}

