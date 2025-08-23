import { CardEffectStrategy } from "../../Cards/CardEffectStrategy";
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
    playersTime:Map<string,number>, // Player ID & Time in UTC
    correctAnswer:number,
    playersAnswered:number
    cardsUsedByPlayer:Map<string, string> // playerID & string with cardsID -> separate by ','
    cardsStack:Array<CardEffectStrategy>
}