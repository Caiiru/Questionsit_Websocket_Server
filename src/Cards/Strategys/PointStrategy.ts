import { Room } from "../../Room/Room";
import { RoomService } from "../../Room/RoomService";
import { CardEffectStrategy } from "../CardEffectStrategy";

export class DoublePointStrategy implements CardEffectStrategy{ 
    execute(playerID: string, room:Room, targetID?: string): Promise<boolean> {
        
        


        return Promise.resolve(true);
    }

}