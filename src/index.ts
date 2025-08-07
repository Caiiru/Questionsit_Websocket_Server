import { startServer } from './app';
import { devConfig } from './config/environment';
import { QuizLoader } from './utils/QuizLoader';

// Start the server using the configuration
const PORT = devConfig.serverPort;

startServer(PORT);


// const jsonToLoad = fetch('utils/question.json');
// const j = require('./utils/questions.json');
// console.log(j);
// console.log(j.Grasp.questions);
// // console.log(j.Grasp.questions.length);
// const quizLoader = new QuizLoader();
// const quiz = quizLoader.StartQuizLoader();

// console.log(quiz);