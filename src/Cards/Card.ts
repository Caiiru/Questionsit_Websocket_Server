export interface Card{
    cardID:number,
    cardName:string,
    cardPW:number, // Powerup - 1/2/3
    cardType:CardType //0 - instant, 1 - delayed
    cardChance:number // 0-low, 1 - medium, 2- high chance
}



export enum CardType{
    INSTANT = 0,
    DELAYED = 1,
}