import { Player } from "../../Player/model/Client";
import { Question } from "./Question";


export interface QuizState {
    currentQuestion: Question | null;
    players: Player[];
    quizActive: boolean;
    roomCode: string,
    // ...
}