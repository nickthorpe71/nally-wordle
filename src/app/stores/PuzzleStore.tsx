import { makeAutoObservable } from "mobx";

// static data
import words from "../static-data/words.json";

// types
import { GameState } from "@/app/types/store";

class Store implements GameState {
    word = "";
    guesses = [];
    currentGuess = 0;
    ws = null;
    currentGame = null;

    constructor() {
        makeAutoObservable(this);
        this.init();
    }

    init = () => {
        if (this.ws !== null) {
            this.ws.close();
        }

        this.word = "";
        this.guesses = new Array(6).fill("");
        this.currentGuess = 0;
        this.ws = new WebSocket("ws://localhost:3001");
        this.currentGame = null;

        this.ws.onopen = () => {
            this.sendMessage({ type: "init", message: "Hello server" });
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "gameCreated") {
                this.handleGameCreated(data);
            }

            if (data.type === "gameLeft") {
                this.handleGameLeft();
            }
        };
    };

    get won() {
        return this.guesses[this.currentGuess - 1] === this.word;
    }

    get lost() {
        return this.currentGuess === 6;
    }

    get waiting() {
        return this.currentGame && this.currentGame.players.length === 1;
    }

    get playing() {
        return this.currentGame && this.currentGame.players.length === 2;
    }

    get allGuesses() {
        return this.guesses.slice(0, this.currentGuess).join("").split("");
    }

    get exactGuesses() {
        return (
            this.word
                .split("")
                // if any guesses include this letter in this position/index
                .filter((letter, i) => {
                    return this.guesses
                        .slice(0, this.currentGuess)
                        .map((word) => word[i])
                        .includes(letter);
                })
        );
    }

    get inexactGuesses() {
        return this.word
            .split("")
            .filter((letter) => this.allGuesses.includes(letter));
    }

    handleGameCreated = (data) => {
        this.currentGame = {
            gameId: data.id,
            players: data.players,
            word: data.word,
            name: data.name,
        };
        this.word = data.word;
    };

    handleGameLeft = () => {
        this.currentGame = null;
    };

    createGame = () => {
        this.sendMessage({
            type: "createGame",
            gameName: "test",
            playerName: "nick",
        });
    };

    leaveGame = () => {
        if (!this.currentGame) return;
        this.ws.send(
            JSON.stringify({
                type: "leaveGame",
                gameId: this.currentGame.gameId,
            })
        );
    };

    submitGuess = () => {
        if (words.includes(this.guesses[this.currentGuess])) {
            this.currentGuess += 1;
        }
        this.ws.send(this.guesses[this.currentGuess]);
    };

    handleKeyup = (e) => {
        if (this.won || this.lost) {
            return;
        }

        if (e.key === "Enter") {
            return this.submitGuess();
        }
        if (e.key === "Backspace") {
            this.guesses[this.currentGuess] = this.guesses[
                this.currentGuess
            ].slice(0, this.guesses[this.currentGuess].length - 1);
            return;
        }
        if (
            this.guesses[this.currentGuess].length < 5 &&
            e.key.match(/^[A-z]$/)
        ) {
            this.guesses[this.currentGuess] =
                this.guesses[this.currentGuess] + e.key.toLowerCase();
        }
    };

    dismountWS = () => {
        this.leaveGame();
        this.ws.close();
    };

    sendMessage = (message: any) => {
        if (this.ws) {
            this.ws.send(JSON.stringify(message));
        }
    };
}

export default new Store();
