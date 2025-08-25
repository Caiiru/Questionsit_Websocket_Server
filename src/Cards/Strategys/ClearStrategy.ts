import { Player } from "../../Player/model/Client";
import { Room } from "../../Room/Room";
import { RoomService } from "../../Room/RoomService";
import { InstantCardData } from "../Card";
import { CardEffectStrategy, CardInstantEffectStrategy } from "../CardEffectStrategy";
import { CardService } from "../CardService";

export class ClearStrategy implements CardInstantEffectStrategy {

    public roomService: RoomService | undefined = undefined;
    public cardService: CardService | undefined = undefined; 
    public playerID: string = '';
    public cardID: number = 0;
    public targetID?: string | undefined;
    public room: Room | undefined;

    constructor(){
        this.cardID=2;
    }

    save(playerID: string, room: Room, targetID?: string, cardService?: CardService, roomService?: RoomService): boolean {
        this.playerID = playerID;
        this.room = room;
        if (targetID) {
            this.targetID = targetID;
        }
        this.cardService = cardService;
        this.roomService = roomService;
        
        console.log(`Clear Save: player ID: ${this.playerID}`);
        console.log(`Clear Save: card ID: ${this.cardID}`); 

        return true;
    }
    execute(){}

    instantExecute(): InstantCardData | null {
    if (!this.roomService) {
        console.error("room service not loaded in clear strategy");
        return null;
    }
    
    // Certifique-se de que `this.room` e `GetCorrectQuestAnswer` estão definidos.
    const correctAnswer = this.room?.GetCorrectQuestAnswer();

    // Se não houver uma resposta correta, retorne null.
    if (correctAnswer === undefined || correctAnswer === null) {
        console.error("No correct answer found for the current question.");
        return null;
    }

    let wrongAnswer: number;
    do {
        // Gera um número inteiro aleatório entre 1 e 4.
        // Math.random() * (max - min) + min
        wrongAnswer = Math.floor(Math.random() * 4);
    } while (wrongAnswer === correctAnswer); // Continua o loop enquanto a resposta for igual à correta.

    const data: InstantCardData = {
        cardID: Number(this.cardID),
        args: {
            wrongAnswer: wrongAnswer
        }
    };

    return data;
}

}