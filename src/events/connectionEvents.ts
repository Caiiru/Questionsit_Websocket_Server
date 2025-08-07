export const enum ConnectionEvents{
    JoinGame = "JOIN_GAME", // Me as a player trying to join the room
    PlayerJoined = "PLAYER_JOINED",//new player joined 
    PlayerLeft = "PLAYER_LEFT", // player left
    Connecting = "CONNECTING",//Connecting to server
    RoomJoinFailure = "ROOM_JOIN_FAILURE",
    RoomJoinSuccess = "ROOM_JOIN_SUCCESS",
    Disconnected = "Disconnected",
    Error = "Error",
    UpdatePlayers = "UPDATE_PLAYERS_LIST",
        
    //HOST OPTIONS
    HostGame = "HOST_GAME",
    RoomCreationSuccess = "ROOM_CREATION_SUCCESS", //Host - Create Room
    RoomCreationFailure = "ROOM_CREATION_FAILURE",
} 