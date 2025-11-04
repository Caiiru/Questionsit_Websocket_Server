import { json } from "stream/consumers";
import { Quiz } from "../Quiz/Grasp";
import { Answer, Question } from "../Quiz/models/Question";


export class QuizLoader {


    GetQuizByID(index: number):Quiz|null {

        const jsonToLoad = require('../utils/questions.json');
        const allGrasps = jsonToLoad.Grasps;
         
        if(index < 0 || index >= allGrasps.length){
            console.error("Indice de Quiz indefinido");
            return null;
        }

        const graspData = allGrasps[index];
 
        const _quiz = this.GetQuizFromJson(graspData);
        if(_quiz == undefined)
            return null;

        console.log(_quiz);

        return _quiz; 
        


    }

    quizLoaded: Quiz = new Quiz();

  

    GetQuizFromJson(quizData: any): Quiz | undefined {

        let newQuiz: Quiz = new Quiz();
        // newGrasp.graspID = quizData.;
        newQuiz.graspName = quizData.name; 

        for (let i: number = 0; i < quizData.questions.length; i++) {
            let answers: Answer[] = [];
            for (let j: number = 0; j < quizData.questions[i].answers.length; j++) {
                const answer = this.GetAnswer(quizData.questions[i].answers[j]);
                if (answer == undefined)
                    return undefined;

                answers.push(answer);
            }

            const question: Question = {
                id: String(i),
                type: quizData.questions[i].type,
                time: quizData.questions[i].time,
                headerText: quizData.questions[i].question,
                answers: answers

            }
            newQuiz.questions.push(question);
        }

        return newQuiz;
    }
    GetAnswer(data: any): Answer | undefined {
        if (data) {
            const a: Answer = {
                text: data.answer,
                correct: data.correct,
                points: data.points,
            }
            return a;
        }

        return undefined;
    }

    GetStringFromQuiz(quiz: Quiz): string {
        let quizString = `
        Grasp:`;
        for (let i = 0; i < quiz.questions.length; i++) {
            quizString += `
            {
            question:${quiz.questions[i].headerText}
            type:${quiz.questions[i].type}
            time:${quiz.questions[i].time}
            answers:[ `

            for (let j = 0; j < quiz.questions[i].answers.length; j++) {
                quizString += `
                
                    answer:${quiz.questions[i].answers[j].text}
                    correct:${quiz.questions[i].answers[j].correct}
                    points:${quiz.questions[i].answers[j].points}
                    },`;
            }
            quizString += `
                ]\n         },`

        }
        return quizString
    }

    public GetAllQuizTitles():string[]{

        const jsonToLoad = require('../utils/questions.json');
        const allGrasps = jsonToLoad.Grasps;

        const quizTitles: string[] = allGrasps.map((grasp: { name: any; }) => grasp.name);

        return quizTitles;
    }
}