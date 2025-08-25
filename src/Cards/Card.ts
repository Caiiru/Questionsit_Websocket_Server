import { CardEffectStrategy } from "./CardEffectStrategy"

export interface Card{
    cardID:number,
    cardName:string,
    cardPW:number, // Powerup - 1/2/3
    cardType:CardType //0 - instant, 1 - delayed
    cardChance:CardChance // 0-low, 1 - medium, 2- high chance
    effect:CardEffectStrategy | undefined
}



export enum CardType{
    Instant = 0,
    Delayed = 1,
}

export enum CardChance{
    Low = 0,
    Medium = 1,
    High = 2,
}


export interface InstantCardData{
    cardID:number,
    args:any
}