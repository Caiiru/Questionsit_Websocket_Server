export enum DevEvents{
    AddRandomCard = "ADD_RANDOM_CARD",
    
}


export interface AddCardToRoomRequest{
    roomCode:string,

}

export interface AddCardToRoomResponse{
    playerIDtoCardID:{[key:string]:string};

}