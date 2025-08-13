
// src/controllers/quizController.ts
import { Socket } from 'socket.io';
import { io } from '../../app';
import { hostEvents } from '../../events/hostEvents';
import { StartQuizRequest } from './requests/StartQuizRequest';
import { RoomService } from '../../Room/RoomService';
import { RoomState } from '../../Room/Room';
import { QuestionResponse } from './responses/QuestionResponse';
import { logDebug } from '../../utils/logger';
import { playerEvents } from '../../events/playerEvents';
import { PlayerAnswerRequest } from './requests/PlayerAnswerRequest';
import { quizService } from '../QuizService';
import { GameEvents } from '../../events/GameEvents';
import { PlayersScoreResponse } from './responses/PlayersScoreResponse';

const SENDER_NAME = "QuizController";
export class QuizController {
    roomService: RoomService = new RoomService();

    
    constructor(roomService: RoomService) {
        this.roomService = roomService;
    }
    setHandlers(socket:Socket){
        this.handleStartQuiz(socket);
        this.handlePlayerAnswer(socket);
    }
    handleStartQuiz(socket: Socket) {
        socket.on(GameEvents.StartQuiz, (quizRequest: StartQuizRequest) => { 

            console.log("QuizController", `Quiz Start Received From: ${quizRequest.roomCode} by ${quizRequest.hostID}`);

            const _questionResponse:QuestionResponse|null = this.roomService.StartQuiz(quizRequest)
 
            if(!_questionResponse||_questionResponse == null){
                throw new Error("Not Implemented");
            }
            
            // console.log(SENDER_NAME, `Starting Quiz... ${JSON.stringify(_questionResponse.question)}`);
            io.to(quizRequest.roomCode).emit(GameEvents.NextQuestion, _questionResponse as QuestionResponse); 
            setTimeout(()=>{
                io.to(quizRequest.roomCode).emit(GameEvents.TimeEnded);
                
            },_questionResponse.question.time*1000)
            
 
        });
    } 
    handlePlayerAnswer(socket:Socket){
        socket.on(playerEvents.SUBMIT_ANSWER, async (answer:PlayerAnswerRequest) => {
            console.log(`Answer from: ${answer.playerID} in ${answer.roomCode}: ${answer.answer}`);
            const canFinish = this.roomService.SetPlayerAnswer(answer);
            if(canFinish){
                io.to(answer.roomCode).emit(GameEvents.AllPlayerAnswered); 
                // const getPlayersPoints:PlayersScoreResponse = { 
                // }
                //LEMBRAR DEPOIS DE FINALIZAR ISSO 
            }
        });
    }
} 
