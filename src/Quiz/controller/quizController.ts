
// src/controllers/quizController.ts
import { Socket } from 'socket.io';
import { quizService } from '../quizService';
import { io } from '../../app';

export const handleSubmitAnswer = (socket: Socket) => {
    socket.on('submitAnswer', (data: { questionId: string; answer: string }) => {
        const result = quizService.submitAnswer(socket.id, data.questionId, data.answer);
        socket.emit('answerResult', { correct: result.correct, score: result.score, feedback: result.correct ? 'Correto!' : 'Incorreto!' });

        // Se for multiplayer, você pode querer broadcast o placar atualizado
        io.emit('updateLeaderboard', quizService.getCurrentQuizState().players);
    });
};

export const handleQuizStart = (socket: Socket) => {
    socket.on('startQuiz', () => {
        const nextQuestion = quizService.startNewQuestion();
        if (nextQuestion) {
            io.emit('newQuestion', { questionId: nextQuestion.id, text: nextQuestion.text, options: nextQuestion.options });
        } else {
            socket.emit('error', { message: 'Nenhuma pergunta disponível ou quiz já iniciado.' });
        }
    });
};
