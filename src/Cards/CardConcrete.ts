import { Room } from "../Room/Room";

export abstract class CardConcrete{

    public cardID:string = '';
    public playerID:string = '';
    public targetID?:string = undefined;
    public room:Room | undefined = undefined;


}