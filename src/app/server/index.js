const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const WebSocket = require("ws");

const GameManager = require("./gameManager");

const port = parseInt(process.env.PORT, 10) || 3001;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        // Be sure to pass both req and res to handle
        // so that Next.js can handle the response in Node.js
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    // Set up WebSocket server
    const wss = new WebSocket.Server({ server });
    wss.on("connection", (ws) => {
        ws.on("message", (message) => messageRouter(ws, message));
        ws.send(JSON.stringify({ message: "Hello! Message From Server!!" }));
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on port:${port}`);
    });
});

function messageRouter(ws, message) {
    try {
        const data = JSON.parse(message);
        switch (data.type) {
            case "createGame":
                handleCreateGame(ws, data);
                break;
            case "leaveGame":
                handleLeaveGame(ws, data);
                break;
            default:
                console.log(`Received message: ${message}`);
        }
    } catch (e) {
        console.log(`Invalid JSON: ${message}`);
    }
}

function handleCreateGame(ws, data) {
    const game = GameManager.createGame(data.gameName, data.playerName);
    ws.send(JSON.stringify({ type: "gameCreated", ...game }));
    console.log(`Created game: ${game}`);
}

function handleLeaveGame(ws, data) {
    const game = GameManager.deleteGame(data.gameId);
    ws.send(JSON.stringify({ type: "gameLeft", ...game }));
    console.log(
        `Left game: ${data.gameName} | ${data.gameId} | ${data.playerName} |`
    );
}
