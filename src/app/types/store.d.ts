export type GameState = {
    word: string;
    guesses: string[];
    currentGuess: number;
    currentGame: {
        id: string;
        name: string;
        players: string[];
        word: string;
    };
    ws: WebSocket;
    readonly won: boolean;
    readonly lost: boolean;
    readonly playing: boolean;
    readonly waiting: boolean;
    readonly allGuesses: string[];
    readonly exactGuesses: string[];
    readonly inexactGuesses: string[];
    init(): void;
    createGame(): void;
    leaveGame(): void;
    submitGuess(): void;
    handleKeyup(e: any): void;
    dismountWS(): void;
};
