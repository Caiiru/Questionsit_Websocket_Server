import { error } from "console";
import { Player } from "../Player/model/Client";
import { QuestionState } from "../Quiz/models/QuizState";
import { Room } from "../Room/Room";
import { RoomService } from "../Room/RoomService";
import { CardEffectStrategy } from "./CardEffectStrategy";
import { CardUsedByPlayerPayload } from "./CardEvents";
import { DoublePointStrategy } from "./Strategys/PointStrategy";

export class CardService {
    private roomService = new RoomService();

    constructor(roomService: RoomService) {
        this.roomService = roomService;
    }

    private cardEffects: { [key: string]: CardEffectStrategy } = {
        '1': new DoublePointStrategy(),

    };

    async useCard(payload: CardUsedByPlayerPayload): Promise<boolean> {
        const { cardID, playerID, targetID, roomCode } = payload;

        const _room = this.roomService.GetRoomOrNullByCode(roomCode);
        if (!_room) {
            Promise.reject("Room Not Find");
            throw new Error("Room Not Find");

        }
        const player: Player = _room.GetPlayerByID(playerID);
        if (!player) {
            Promise.reject("Player Not Find");
            throw new Error("Invalid Player");
        }

        //Get Effect
        const effectStrategy = await (this.GetCardStrategyByID(Number(cardID)));
        if (targetID != null)
            effectStrategy.targetID = targetID;


        this.AddCardToPlayerHistory(_room, playerID, cardID).then(() => {
            return this.AddCardToStack(_room, effectStrategy);
        });

        return Promise.resolve(true);
    }


    async GetCardStrategyByID(cardID: number): Promise<CardEffectStrategy> {
        const effect = this.cardEffects[cardID];
        return Promise.resolve(effect);
    }

    AddCardToPlayerHistory(room: Room, playerID: string, cardID: string): Promise<boolean> {

        if (!room)
            Promise.reject(false);

        const currentQuestion = room.currentQuestion;

        const currentState: QuestionState = room.questionsStates[currentQuestion];
        const cardsPlayerUsed = currentState.cardsUsedByPlayer.get(playerID);

        if (!cardsPlayerUsed) {//se ele não usou nada até agora, apenas adiciona e retorna
            currentState.cardsUsedByPlayer.set(playerID, cardID);
            return Promise.resolve(true);
        }

        currentState.cardsUsedByPlayer.set(playerID, `${cardsPlayerUsed},${cardID}`);//se ele usou uma carta nesse round, adiciona ao id com uma virgula ao lado
        return Promise.resolve(true);
    }

    AddCardToStack(room: Room, cardeffect: CardEffectStrategy): Promise<boolean> {

        if (!room)
            Promise.reject(false);

        const currentQuestion = room.currentQuestion;

        room.questionsStates[currentQuestion].cardsStack.push(cardeffect);


        return Promise.resolve(true);
    }
}