import { Room } from "../Room/Room";
import { CardConcrete } from "./CardConcrete";

export interface CardEffectStrategy extends CardConcrete{  
    execute():void;
    save(playerID:string,room:Room,targetID?:string):void;
}