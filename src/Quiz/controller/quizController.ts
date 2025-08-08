
// src/controllers/quizController.ts
import { Socket } from 'socket.io';
import { io } from '../../app';
import { hostEvents } from '../../events/hostEvents';
import { StartQuizRequest } from './requests/StartQuizRequest';
import { RoomService } from '../../Room/RoomService';
import { RoomState } from '../../Room/Room';
import { QuestionResponse } from './responses/QuestionResponse';
import { logDebug } from '../../utils/logger';

const SENDER_NAME = "QuizController";
export class QuizController {
    roomService: RoomService = new RoomService();

    
    constructor(roomService: RoomService) {
        this.roomService = roomService;
    }

    handleStartQuiz(socket: Socket) {
        socket.on(hostEvents.Start_Quiz, (quizRequest: StartQuizRequest) => { 

            console.log("QuizController", `Quiz Start Received From: ${quizRequest.roomCode} by ${quizRequest.hostID}`);

            const _questionResponse:QuestionResponse|null = this.roomService.StartQuiz(quizRequest)
 
            if(!_questionResponse||_questionResponse == null){
                throw new Error("Not Implemented");
            }
            
            // console.log(SENDER_NAME, `Starting Quiz... ${JSON.stringify(_questionResponse.question)}`);
            io.to(quizRequest.roomCode).emit(hostEvents.Start_Quiz, _questionResponse as QuestionResponse);
 
        });
    } 
} 
