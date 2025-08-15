import { Player } from "../../Player/model/Client";
import { Question } from "./Question";


export interface QuizState {
    currentQuestion: Question | null;
    players: Player[];
    quizActive: boolean;
    roomCode: string,
    // ...
}

export interface QuestionState{ 
    questionStartTime:number,
    playersTime:Map<string,number>,
    correctAnswer:number,
    playersAnswered:number
}