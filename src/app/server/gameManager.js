const words = require("../static-data/words.json");

class Game {
    constructor(gameName, gameCreator) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.name = gameName;
        this.creator = gameCreator;
        this.players = [gameCreator];
        this.word = words[Math.round(Math.random() * words.length)];
    }

    addPlayer(player) {
        this.players.push(player);
    }

    removePlayer(playerId) {
        this.players = this.players.filter((player) => player.id !== playerId);
    }
}

class GameManager {
    constructor() {
        this.games = [];
    }

    createGame(gameName, gameCreator) {
        let game = new Game(gameName, gameCreator);
        this.games.push(game);
        return game;
    }

    getGame(gameId) {
        return this.games.find((game) => game.id === gameId);
    }

    getGames() {
        return this.games;
    }

    deleteGame(gameId) {
        this.games = this.games.filter((game) => game.id !== gameId);
    }
}

module.exports = new GameManager();
