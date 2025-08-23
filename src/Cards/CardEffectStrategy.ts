import { Room } from "../Room/Room";

export interface CardEffectStrategy{  
    targetID?:string,
    execute(playerID:string, room:Room, targetID?:string):Promise<any>;
    
}