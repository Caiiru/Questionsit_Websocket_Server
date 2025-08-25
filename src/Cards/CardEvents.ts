export enum CardEvents{
    SendRandomCard = "ON_RECEIVE_RANDOM_CARD", 
    PlayerUsedCard = "ON_PLAYER_USED_CARD",
    SendCardInstantInfo = "ON_CARD_INSTANT_USED",
}


export interface CardUsedByPlayerPayload{
    roomCode:string,
    cardID:string,
    playerID:string;
    targetID?:string;

}