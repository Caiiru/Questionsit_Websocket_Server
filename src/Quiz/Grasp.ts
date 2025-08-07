import { Question } from "./models/Question";

export class Quiz {
    public graspID:string = "null";
    public graspName:string = 'graspName';
    public questions:Question[] = [];
    public hostID:string = 'hostID';

    public Quiz(graspID:string, graspName:string, questions:Question[]){
        this.graspID = graspID;
        this.graspName = graspName;
        this.questions = questions;
    }
}