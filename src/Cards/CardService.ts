// Importações reorganizadas e limpas para melhor legibilidade
import { Player } from "../Player/model/Client";
import { QuestionState } from "../Quiz/models/QuizState";
import { Room } from "../Room/Room";
import { RoomService } from "../Room/RoomService";
import { CardEffectStrategy } from "./CardEffectStrategy";
import { CardUsedByPlayerPayload } from "./CardEvents";
import { CardsLoader } from "../utils/CardsLoader";
import { Card, CardType } from "./Card";
import { AddCardToRoomResponse } from "../utils/devEvents";

export class CardService {
    // Declaração de propriedades de maneira clara
    private roomService: RoomService;
    private cardMap: Map<number, Card>;

    // Construtor aprimorado
    constructor(roomService: RoomService) {
        // Atribuição de dependência (RoomService)
        this.roomService = roomService;

        // Inicialização do mapa de cartas de forma coesa
        const cardLoader = new CardsLoader();
        this.cardMap = cardLoader.createCards(); 
    }


    // --- Métodos Principais ---

    /**
     * Lida com o uso de uma carta por um jogador.
     * @param payload Dados da carta usada.
     * @returns Retorna true se o processo for bem-sucedido.
     */
    public useCard(payload: CardUsedByPlayerPayload): boolean {
        const { cardID, playerID, targetID, roomCode } = payload;

        // Validação centralizada e simplificada
        const room = this.validateRoomAndPlayer(roomCode, playerID);

        const card = this.getCardByID(Number(cardID));
        if (!card || !card.effect) {
            console.warn(`Card or effect not found for ID: ${cardID}`);
            return false;
        }

        // Aplica o alvo, se houver
        if (targetID !== null && card.effect) {
            card.effect.targetID = targetID;
        }

        card.effect.save(playerID, room, targetID, this, this.roomService);
        if (this.addCardToPlayerHistory(room, playerID, cardID.toString())) {
            if (card.cardType == CardType.Delayed)
                this.addCardToStack(room, card.effect);
            return true;
        }
        return false;
    }

    private validateRoomAndPlayer(roomCode: string, playerID: string): Room {
        const room = this.roomService.GetRoomOrNullByCode(roomCode);
        if (!room) {
            throw new Error(`Room with code ${roomCode} not found.`);
        }
        const player = room.GetPlayerByID(playerID);
        if (!player) {
            throw new Error(`Player with ID ${playerID} not found in room ${roomCode}.`);
        }
        return room;
    }

    public getCardByID(cardID: number): Card | undefined {
        return this.cardMap.get(cardID);
    }
    private addCardToPlayerHistory(room: Room, playerID: string, cardID: string): boolean {
        const currentState = room.questionsStates[room.currentQuestion];
        if (!currentState) {
            return false;
        }

        const cardsUsed = currentState.cardsUsedByPlayer.get(playerID) || "";
        const updatedCards = cardsUsed ? `${cardsUsed},${cardID}` : cardID;
        currentState.cardsUsedByPlayer.set(playerID, updatedCards);

        return true;
    }

    private addCardToStack(room: Room, cardEffect: CardEffectStrategy): boolean {
        const currentState = room.questionsStates[room.currentQuestion];
        if (!currentState) {
            return false;
        }

        currentState.cardsStack.push(cardEffect);
        return true;
    }

    public AddCardsFromQuizStart(roomCode: string): AddCardToRoomResponse | null {
        const _room = this.roomService.GetRoomOrNullByCode(roomCode);
        if (_room == null) return null;

        const send: { [key: string]: string } = {};

        const players = _room.players;

        players.forEach(player => {
            // const randomIndex = Math.floor(Math.random() * this.Cards.length); 

            send[player.id] = this.GetRandomCard().cardID.toString();
        });

        const response: AddCardToRoomResponse = {
            playerIDtoCardID: send,
        }

        return response;
    }


    private GetRandomCard(): Card {
        // Validação inicial: se o mapa estiver vazio, lance um erro
        if (this.cardMap.size === 0) {
            throw new Error("Cannot get a random card from an empty map.");
        }

        // Obtém todas as chaves (IDs) do mapa em um array
        const cardIDs = Array.from(this.cardMap.keys());

        // Gera um índice aleatório para o array de chaves
        const randomIndex = Math.floor(Math.random() * cardIDs.length);

        // Usa o índice para obter uma chave aleatória
        const randomCardID = cardIDs[randomIndex];

        // Usa a chave aleatória para pegar a carta do mapa
        const card = this.cardMap.get(randomCardID);

        // Validação final para garantir que a carta não é nula
        if (!card) {
            throw new Error(`Failed to retrieve card with ID ${randomCardID}.`);
        }

        return card;
    }

    public AddRandomCardToRoomCode(roomCode: string) {
        const _room = this.roomService.GetRoomOrNullByCode(roomCode);
        if (_room == null) {
            return;
        }

        this.AddRandomCardToRoom(_room);
    }

    public AddRandomCardToRoom(room: Room) {
        const Players: Player[] = room.players

    }


}