import { Answer, Question } from "../../models/Question";

export interface QuestionResponse{
    question:Question
    serverStartTime: number
}