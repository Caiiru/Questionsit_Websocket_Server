
// src/controllers/quizController.ts
import { Socket } from 'socket.io';
import { io } from '../../app';
import { hostEvents } from '../../events/hostEvents';
import { StartQuizRequest } from './requests/StartQuizRequest';
import { RoomService } from '../../Room/RoomService';
import { Room, RoomState } from '../../Room/Room';
import { QuestionResponse } from './responses/QuestionResponse';
import { logDebug } from '../../utils/logger';
import { playerEvents } from '../../events/playerEvents';
import { PlayerAnswerRequest } from './requests/PlayerAnswerRequest';
import { quizService } from '../QuizService';
import { GameEvents } from '../../events/GameEvents';
import { PlayersScoreResponse } from './responses/PlayersScoreResponse';
import { json } from 'stream/consumers';

const SENDER_NAME = "QuizController";
export class QuizController {
    roomService: RoomService = new RoomService();


    constructor(roomService: RoomService) {
        this.roomService = roomService;
    }
    setHandlers(socket: Socket) {
        this.handleQuizEvents(socket);
        this.handlePlayerAnswer(socket);
    }
    handleQuizEvents(socket: Socket) {
        socket.on(GameEvents.StartQuiz, (quizRequest: StartQuizRequest) => {
 

            const _questionResponse: QuestionResponse | null = this.roomService.StartQuiz(quizRequest)

            if (!_questionResponse || _questionResponse == null) {
                throw new Error("Not Implemented");
            }
 
            io.to(quizRequest.roomCode).emit(GameEvents.NextQuestion, _questionResponse as QuestionResponse);
            setTimeout(() => {
                io.to(quizRequest.roomCode).emit(GameEvents.TimeEnded);

            }, _questionResponse.question.time * 1000)


        });

    }
    handlePlayerAnswer(socket: Socket) {
        socket.on(playerEvents.SUBMIT_ANSWER, (answer: PlayerAnswerRequest) => { 

            const room = this.roomService.GetRoomByCode(answer.roomCode);

            if(!room){ 
                return;
            }   
            console.log("Received Answer: " + answer.playerID);

            const canFinish = this.roomService.SetPlayerAnswer(answer, room);
            if (canFinish) {
                io.to(answer.roomCode).emit(GameEvents.AllPlayerAnswered);

                const scoreResponse: PlayersScoreResponse = this.roomService.handlePoints(room);  

                io.to(room.roomCode).emit(GameEvents.SendScores, scoreResponse);
                console.log(scoreResponse);
                
                setTimeout(() => { 

                    const hasNextQuestion = room.quiz.questions.length > room.currentQuestion+1;

                    if(!hasNextQuestion){
                        console.log("QUIZ END MOTHERFUCKER");
                        return;
                    }

                    const _nextQuestion:QuestionResponse | null = this.roomService.GetNextRoomQuestion(room.roomCode); 
                    io.to(room.roomCode).emit(GameEvents.NextQuestion, _nextQuestion as QuestionResponse);
                }, 10000);
            }
        });
    }
} 
