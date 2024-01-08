import React, { FC } from "react";
import { observer } from "mobx-react-lite";
import { GameState } from "@/app/types/store";

interface KeyboardProps {
    store: GameState;
}

const Keyboard: FC<KeyboardProps> = ({ store }) => {
    const { exactGuesses, inexactGuesses, allGuesses } = store;
    const qwerty = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
    return (
        <div>
            {qwerty.map((row, i) => (
                <div
                    key={`key-row--${i}-${row}`}
                    className='flex justify-center'
                >
                    {row.split("").map((char, j) => {
                        const bgColor = exactGuesses.includes(char)
                            ? "bg-green-400"
                            : inexactGuesses.includes(char)
                            ? "bg-yellow-400"
                            : allGuesses.includes(char)
                            ? "bg-gray-800"
                            : "bg-gray-400";
                        return (
                            <div
                                key={`key--${i}-${j}-${char}`}
                                className={`rounded-m m-px flex h-10 w-10 items-center justify-center uppercase ${bgColor}`}
                            >
                                {char}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default observer(Keyboard);
