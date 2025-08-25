import { Room } from "../Room/Room";
import { RoomService } from "../Room/RoomService";
import { CardService } from "./CardService";

export abstract class CardConcrete {

    public cardID: number = -1;
    public playerID: string = '';
    public targetID?: string = undefined;
    public room: Room | undefined = undefined;
    public cardService: CardService |undefined = undefined;
    public roomService: RoomService |undefined = undefined;


}