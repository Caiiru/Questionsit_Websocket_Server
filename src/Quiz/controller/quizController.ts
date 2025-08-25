
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
import { resolve } from 'path';
import { CardType, InstantCardData } from '../../Cards/Card';
import { CardInstantEffectStrategy } from '../../Cards/CardEffectStrategy';

const SENDER_NAME = "QuizController";
export class QuizController {
    roomService: RoomService = new RoomService();
    cardService: CardService | undefined;

    roomTimers = new Map();

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

        if (!this.cardService)
            return;

        socket.on(GameEvents.StartQuiz, (quizRequest: StartQuizRequest) => {


            const _questionResponse: QuestionResponse | null = this.roomService.StartQuiz(quizRequest)

            if (!_questionResponse || _questionResponse == null) {
                throw new Error("Not Implemented");
            }
            const response: AddCardToRoomResponse | null = this.cardService!.AddCardsFromQuizStart(quizRequest.roomCode);


            const handleRoundEnd = async () => {

                const room = this.roomService.GetRoomOrNullByCode(quizRequest.roomCode);
                if (!room) return;

                await this.emitScores(room).catch(() => {
                    console.log("Error on handle round end ");
                });

            };

            io.to(quizRequest.roomCode).emit(GameEvents.NextQuestion, _questionResponse as QuestionResponse);
            const timeoutID = setTimeout(async () => {
                io.to(quizRequest.roomCode).emit(GameEvents.TimeEnded);

                const room = this.roomService.GetRoomOrNullByCode(quizRequest.roomCode);
                if (room == null) return;

                await handleRoundEnd();


            }, _questionResponse.question.time * 1000);

            this.roomTimers.set(quizRequest.roomCode, timeoutID);
            if (response == null) {
            }
            else {
                io.to(quizRequest.roomCode).emit(CardEvents.SendRandomCard, response as AddCardToRoomResponse);
            }

        });

        socket.on(GameEvents.NextQuestion, (roomCode: string) => {
            const room: Room | null = this.roomService.GetRoomOrNullByCode(roomCode);
            if (!room) {
                return;
            }
            const hasNextQuestion = room.quiz.questions.length > room.currentQuestion + 1;

            if (!hasNextQuestion) {
                io.to(room.roomCode).emit(GameEvents.EndQuiz);
                return;
            }

            const _nextQuestion: QuestionResponse | null = this.roomService.GetNextRoomQuestion(room.roomCode);
            const response: AddCardToRoomResponse | null = this.cardService!.AddCardsFromQuizStart(roomCode);
            io.to(room.roomCode).emit(GameEvents.NextQuestion, _nextQuestion as QuestionResponse);
            if (response) {
                io.to(roomCode).emit(CardEvents.SendRandomCard, response as AddCardToRoomResponse);
            }
        })

    }

    handlePlayerAnswer(socket: Socket) {
        socket.on(playerEvents.SUBMIT_ANSWER, async (answer: PlayerAnswerRequest) => {

            const room = this.roomService.GetRoomOrNullByCode(answer.roomCode);

            if (!room) {
                return;
            }

            const canFinish = this.roomService.SetPlayerAnswer(answer, room);
            if (canFinish) {
                io.to(answer.roomCode).emit(GameEvents.AllPlayerAnswered);

                await this.emitScores(room).catch(() => {
                    console.log("Error on handle Player Answer ")
                });
            }
        });
    }
    handleUsedCards(socket: Socket) {
        socket.on(CardEvents.PlayerUsedCard, async (data: CardUsedByPlayerPayload) => {

            const cardUsedSuccessfully = this.cardService?.useCard(data);
            if (!cardUsedSuccessfully){
                return;
            }

            const card = this.cardService?.getCardByID(Number(data.cardID));

            if(card?.cardType===CardType.Instant){
                const _instantCard = card.effect as CardInstantEffectStrategy
                const _instantEffectData = _instantCard.instantExecute();
                if(!_instantEffectData)
                {
                    console.error("QuizController found null on instantExecute")
                    return;
                }
                console.log(`Instant card used: ${JSON.stringify(_instantEffectData)}`);
                socket.emit(CardEvents.SendCardInstantInfo, _instantEffectData as InstantCardData);
            }
        })
    }

    async emitScores(room: Room) {
        return new Promise<void>((resolve) => {
            const scoreResponse = this.roomService.handlePoints(room);

            console.log(`[EmitScores] ${JSON.stringify(scoreResponse)}`);


            io.to(room.roomCode).emit(GameEvents.SendScores, scoreResponse);
            const timerID = this.roomTimers.get(room.roomCode);
            if (timerID) {
                clearTimeout(timerID);
                this.roomTimers.delete(room.roomCode);
            }
            resolve();
        });
    }
} 
