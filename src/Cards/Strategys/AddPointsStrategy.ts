import { Player } from "../../Player/model/Client";
import { Room } from "../../Room/Room";
import { RoomService } from "../../Room/RoomService";
import { InstantCardData } from "../Card";
import { CardEffectStrategy } from "../CardEffectStrategy";
import { CardService } from "../CardService";

export class AddPointsStrategy implements CardEffectStrategy {

    public cardService: CardService | undefined;
    public roomService: RoomService | undefined;
    public playerID: string = '';
    public cardID: number = 0;
    public targetID?: string | undefined;
    public room: Room | undefined;

    pointsToAdd: number = 0;

    constructor(amount: number) {
        this.pointsToAdd = amount;
    }

    save(playerID: string, room: Room, targetID?: string): boolean {
        this.playerID = playerID;
        this.room = room;
        if (targetID) {
            this.targetID = targetID;
        }


        return true;
    }
    execute(): void {
        // O `this.room` e `this.playerID` já devem ter sido definidos pelo `save` ou construtor
        const player = this.room?.GetPlayerByID(this.playerID);

        // Se o jogador não for encontrado, lança um erro diretamente
        if (!player) {
            throw new Error(`Player with ID ${this.playerID} not found.`);
        }
        player.pointsEarned += this.pointsToAdd;
    }

}