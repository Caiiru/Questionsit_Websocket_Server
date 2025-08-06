
export interface QuizClient {
    id: string;
    name: string;
    socketId: string;

}
export interface Host extends QuizClient {

}
export interface Player extends QuizClient {
    score: number; 
    cards:string;
}

