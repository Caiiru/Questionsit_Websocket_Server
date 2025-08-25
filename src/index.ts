import { startServer } from './app';
import { devConfig } from './config/environment'; 

// Start the server using the configuration
// const PORT = devConfig.serverPort;
const PORT = process.env.PORT || devConfig.serverPort;

startServer(Number(PORT));


// const jsonToLoad = fetch('utils/question.json');
// const j = require('./utils/questions.json');
// console.log(j);
// console.log(j.Grasp.questions);
// // console.log(j.Grasp.questions.length);
// const quizLoader = new QuizLoader();
// const quiz = quizLoader.StartQuizLoader();


// const _cards = new CardsLoader().StartCardLoader();

// console.log(quiz);