"use client";

import React, { useEffect } from "react";

// store
import { observer } from "mobx-react-lite";

// components
import Guess from "./components/Guess";
import Keyboard from "./components/Keyboard";
import store from "./stores/PuzzleStore";

export default observer(function Home() {
    useEffect(() => {
        store.init();
        window.addEventListener("keyup", store.handleKeyup);

        return () => {
            window.removeEventListener("keyup", store.handleKeyup);
            store.dismountWS();
        };
    }, []);

    return (
        <div className='flex h-screen w-screen flex-col items-center justify-center bg-gray-600'>
            <h1 className='bg-gradient-to-br from-green-600 to-yellow-200 bg-clip-text text-6xl font-bold uppercase text-transparent'>
                NALLY WORDLE
            </h1>
            <button onClick={() => console.log(store)}>Log State</button>
            {store.playing ? (
                <>
                    {store.guesses.map((_: any, i: number) => (
                        <Guess
                            key={i}
                            word={store.word}
                            guess={store.guesses[i]}
                            isGuessed={i < store.currentGuess}
                        />
                    ))}
                    {store.won && <h1>You won!</h1>}
                    {store.lost && <h1>You lost!</h1>}
                    {(store.won || store.lost) && (
                        <button onClick={store.init}>Play Again</button>
                    )}
                    <Keyboard store={store} />
                </>
            ) : store.waiting ? (
                <div>
                    <h1>Waiting for opponent...</h1>
                    <button onClick={store.leaveGame}>Leave Game</button>
                </div>
            ) : (
                <div>
                    <button onClick={store.createGame}>Create Game</button>
                </div>
            )}
        </div>
    );
});
