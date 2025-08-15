export interface PlayersScoreResponse{
    scores:PlayerScore[], //ID & score

}

export interface PlayerScore{
    playerID:string,
    isAnswerCorrect:boolean,
    scoreBeforeUpdated:number,
    pointsEarned:number
}