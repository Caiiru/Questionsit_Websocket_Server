import { Room } from "../Room/Room";
import { RoomService } from "../Room/RoomService";
import { InstantCardData } from "./Card";
import { CardConcrete } from "./CardConcrete";
import { CardService } from "./CardService";

export interface CardEffectStrategy extends CardConcrete{  
    execute():void; 
    save(playerID:string,room:Room,targetID?:string, cardService?:CardService|undefined, roomService?:RoomService|undefined):void;
}

export interface CardInstantEffectStrategy extends CardEffectStrategy{
    instantExecute():InstantCardData|null;
}