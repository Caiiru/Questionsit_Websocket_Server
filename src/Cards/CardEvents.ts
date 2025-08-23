export enum CardEvents{
    SendRandomCard = "ON_RECEIVE_RANDOM_CARD", 
    PlayerUsedCard = "ON_PLAYER_USED_CARD",
}


export interface CardUsedByPlayerPayload{
    roomCode:string,
    cardID:string,
    playerID:string;
    targetID?:string;

}