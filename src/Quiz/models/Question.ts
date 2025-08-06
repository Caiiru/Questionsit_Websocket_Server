export interface Question {
    id: string;
    type:number;
    time:number;
    headerText: string;
    answers:Answer[];
    // ...
}
export interface Answer{
    text:string;
    correct:boolean;
    points:number;
}