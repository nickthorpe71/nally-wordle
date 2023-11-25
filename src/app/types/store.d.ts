export type GameState = {
    word: string;
    guesses: never[];
    currentGuess: number;
    readonly won: boolean;
    readonly lost: boolean;
    readonly allGuesses: string[];
    readonly exactGuesses: string[];
    readonly inexactGuesses: string[];
    init(): void;
    submitGuess(): void;
    handleKeyup(e: any): void;
};
