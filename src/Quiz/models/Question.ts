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
    correct:number;
    points:number;
}

export class SendQuestion{
    time:number = 99;
    headerText:string = '';
    answers:SendAnswer[] = new Array;

    constructor(question:Question){
        this.headerText = question.headerText;
        this.time=question.time;
        this.answers = new Array<SendAnswer>();
        question.answers.forEach(_answer => {
            const _sendAnswer:SendAnswer = new SendAnswer(_answer);
            this.answers.push(_sendAnswer); 
        });

    }
}

export class SendAnswer{
    text:string = '';

    constructor(answer:Answer){
        this.text = answer.text;
    }
}