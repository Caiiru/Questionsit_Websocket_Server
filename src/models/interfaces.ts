
export interface QuizClient {

    id: string;
    name: string;
    socketId: string;

}
export interface Host extends QuizClient {

}
export interface Player extends QuizClient {
    score: number;
    // ... outros atributos do jogador
}

export interface Question {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
    // ...
}

export interface QuizState {
    currentQuestion: Question | null;
    players: Player[];
    quizActive: boolean;
    roomCode: string,
    // ...
}

export interface SocketEvents {
    'joinGame': (data: { playerName: string }) => void;
    'submitAnswer': (data: { questionId: string; answer: string }) => void;
    'playerJoined': (data: Player) => void;
    // ...
}