
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
import { AddCardToRoomResponse, DevEvents } from '../../utils/devEvents';
import { CardEvents, CardUsedByPlayerPayload } from '../../Cards/CardEvents';
import { CardService } from '../../Cards/CardService';

const SENDER_NAME = "QuizController";
export class QuizController {
    roomService: RoomService = new RoomService();
    cardService:CardService | undefined;


    constructor(roomService: RoomService) {
        this.roomService = roomService;
        this.roomService.InitializeRoomService();

        this.cardService = new CardService(roomService);
    }
    setHandlers(socket: Socket) {
        this.handleQuizEvents(socket);
        this.handlePlayerAnswer(socket);
        this.handleUsedCards(socket);
    }
    handleQuizEvents(socket: Socket) {
        socket.on(GameEvents.StartQuiz, (quizRequest: StartQuizRequest) => {


            const _questionResponse: QuestionResponse | null = this.roomService.StartQuiz(quizRequest)

            if (!_questionResponse || _questionResponse == null) {
                throw new Error("Not Implemented");
            }
            const response: AddCardToRoomResponse | null = this.roomService.AddCardsFromQuizStart(quizRequest.roomCode);

            // console.log(response?.playerIDtoCardID);


            io.to(quizRequest.roomCode).emit(GameEvents.NextQuestion, _questionResponse as QuestionResponse);
            setTimeout(() => {
                io.to(quizRequest.roomCode).emit(GameEvents.TimeEnded);

                const room = this.roomService.GetRoomOrNullByCode(quizRequest.roomCode);
                if(room==null) return;

                const scoreResponse:PlayersScoreResponse = this.roomService.handlePoints(room);
                io.to(room.roomCode).emit(GameEvents.SendScores, scoreResponse);
                

            }, _questionResponse.question.time * 1000);

            if (response == null) {
                // console.error("Response incorrect");
            }
            else {
                io.to(quizRequest.roomCode).emit(CardEvents.SendRandomCard, response as AddCardToRoomResponse);
            }

        });

        socket.on(GameEvents.NextQuestion, (roomCode: string) => {
            const room: Room | null = this.roomService.GetRoomOrNullByCode(roomCode);
            if (!room) {
                console.error("Room doesnt exist");
                return;
            }
            const hasNextQuestion = room.quiz.questions.length > room.currentQuestion + 1;

            if (!hasNextQuestion) {
                io.to(room.roomCode).emit(GameEvents.EndQuiz);
                return;
            }

            const _nextQuestion: QuestionResponse | null = this.roomService.GetNextRoomQuestion(room.roomCode);
            io.to(room.roomCode).emit(GameEvents.NextQuestion, _nextQuestion as QuestionResponse);

        })

    }
    handlePlayerAnswer(socket: Socket) {
        socket.on(playerEvents.SUBMIT_ANSWER, (answer: PlayerAnswerRequest) => {

            const room = this.roomService.GetRoomOrNullByCode(answer.roomCode);

            if (!room) {
                return;
            }
            // console.log("Received Answer: " + answer.playerID);

            const canFinish = this.roomService.SetPlayerAnswer(answer, room);
            if (canFinish) {
                io.to(answer.roomCode).emit(GameEvents.AllPlayerAnswered);

                const scoreResponse: PlayersScoreResponse = this.roomService.handlePoints(room);

                io.to(room.roomCode).emit(GameEvents.SendScores, scoreResponse);
                // console.log(scoreResponse);

                // setTimeout(() => {

                //     const hasNextQuestion = room.quiz.questions.length > room.currentQuestion + 1;

                //     if (!hasNextQuestion) {
                //         return;
                //     }

                //     const _nextQuestion: QuestionResponse | null = this.roomService.GetNextRoomQuestion(room.roomCode);
                //     io.to(room.roomCode).emit(GameEvents.NextQuestion, _nextQuestion as QuestionResponse);
                // }, 10000);
            }
        });
    }
    handleUsedCards(socket: Socket) 
    {
        socket.on(CardEvents.PlayerUsedCard, async (data:CardUsedByPlayerPayload)=>{ 

            this.cardService?.useCard(data).then(()=>{
                console.log(`[HANDLECARDS] Player ${data.playerID} used ${data.cardID} on room ${data.roomCode}`);
            })
        })
    }
} 
