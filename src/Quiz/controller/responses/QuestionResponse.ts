import { Answer, Question, SendQuestion } from "../../models/Question";

export interface QuestionResponse{
    question:SendQuestion
    serverStartTime: number
}