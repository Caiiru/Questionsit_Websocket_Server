// src/services/quizService.ts
import { Player, Question, QuizState } from '../models/interfaces';

class QuizService {
    private quizState: QuizState = {
        currentQuestion: null,
        players: [],
        quizActive: false
    };
    private questions: Question[] = [
        { id: "q1", text: "Capital do Brasil?", options: ["RJ", "Brasília"], correctAnswer: "Brasília" },
        // ... mais perguntas
    ];

    addPlayer(player: Player): void {
        this.quizState.players.push(player);
    }

    removePlayer(playerId: string): void {
        this.quizState.players = this.quizState.players.filter(p => p.id !== playerId);
    }

    getCurrentQuizState(): QuizState {
        return this.quizState;
    }

    // Lógica para avançar para a próxima pergunta, validar resposta, etc.
    submitAnswer(playerId: string, questionId: string, answer: string): { correct: boolean, score: number } {
        const player = this.quizState.players.find(p => p.id === playerId);
        const question = this.questions.find(q => q.id === questionId);

        if (!player || !question || questionId !== this.quizState.currentQuestion?.id) {
            return { correct: false, score: player?.score || 0 };
        }

        const isCorrect = answer === question.correctAnswer;
        if (isCorrect) {
            player.score += 10; // Exemplo
        }
        return { correct: isCorrect, score: player.score };
    }

    startNewQuestion(): Question | null {
        // Lógica para selecionar a próxima pergunta
        const nextQuestion = this.questions[Math.floor(Math.random() * this.questions.length)];
        this.quizState.currentQuestion = nextQuestion;
        return nextQuestion;
    }
    // ...
}

export const quizService = new QuizService();