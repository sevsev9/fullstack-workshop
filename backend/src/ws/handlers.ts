import { Server as WsServer, WebSocket } from 'ws';
import { GameMoveRequest, GlobalChatRequest, LobbyCreateRequest, WSLobby, WebSocketWithAuth, Request, Response, WSPlayerInfo } from '../types/ws.types';
import { verifyJwt } from '../util/jwt.util';
import { uuid } from 'uuidv4';

const lobbies: Record<string, WSLobby> = {};

export const connectionHandler = (wss: WsServer) => (ws: WebSocketWithAuth) => {
    ws.on('message', (message: string) => {
        const parsedMessage: Request = JSON.parse(message);

        // on every message that requres a user to be authenticated,
        // we require a token which is an optional parameter on every message.
        // if the token is set and it is deemed valid, we set the user property on the ws object

        // check if token is present
        if (parsedMessage.token) {
            let token = parsedMessage.token;

            // verify the token
            try {
                const { valid, expired, decoded, error } = verifyJwt(token);

                // check if the session is valid
                ws.user = decoded.user;
            } catch (err) {
                return ws.send(JSON.stringify({ type: 'warn', payload: { error: 'Invalid or expired token' } }));
            }
        }


        // check authentication for the message type
        switch (parsedMessage.type) {
            case 'global_chat':
            case 'lobby_create':
            case 'lobby_join':
            case 'lobby_leave':
            case 'lobby_chat':
            case 'game_move':
                // sending such messages requires auth
                break;
        }

        // handle the messages
        switch (parsedMessage.type) {
            case 'global_chat':
                handleGlobalChat(wss, ws, parsedMessage);
                break;
            case 'lobby_create':
                handleLobbyCreate(ws, parsedMessage);
                break;
            case 'lobby_join':
                handleLobbyJoin(ws, parsedMessage);
                break;
            case 'lobby_leave':
                handleLobbyLeave(ws, parsedMessage);
                break;
            case 'lobby_chat':
                handleLobbyChat(ws, parsedMessage);
                break;
            case 'game_move':
                handleGameMove(wss, ws, parsedMessage);
                break;
            default:
                ws.send(JSON.stringify({ type: 'warn', payload: { message: 'Invalid message type' } }));
        }
    });

    ws.on('close', () => {
        console.log('Client has disconnected');
        // Handle client disconnect logic
    });
}

function sendResponse(ws: WebSocketWithAuth, response: Response) {
    ws.send(JSON.stringify(response));
}

function handleGlobalChat(wss: WsServer, ws: WebSocketWithAuth, message: GlobalChatRequest) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

function handleLobbyCreate(ws: WebSocketWithAuth, message: LobbyCreateRequest) {
    const { user, lobbyName } = message.payload;
    if (lobbies[lobbyName]) {
        sendResponse(ws, { type: 'lobby_create', payload: { success: false, error: 'Lobby already exists' } });
        return;
    }

    lobbies[lobbyName] = {
        game_id: uuid(),
        users: [{
            user_id: ws.user.
            name: user,
            ready: false,
        } as WSPlayerInfo],
        chatHistory: [],
        gameState: {}, // Initialize the game state
    };

    sendResponse(ws, { type: 'lobby_create', payload: { success: true, lobbyName } });
}

function handleLobbyJoin(ws: WebSocketWithAuth, message: Request) {
    const { user, lobbyName } = message.payload;
    const lobby = lobbies[lobbyName];

    if (!lobby) {
        sendResponse(ws, { type: 'lobby_join', payload: { success: false, error: 'Lobby does not exist' } });
        return;
    }

    lobby.users.push(ws);
    sendResponse(ws, { type: 'lobby_join', payload: { success: true, lobbyName } });
}

function handleLobbyLeave(ws: WebSocketWithAuth, message: Request) {
    const { user, lobbyName } = message.payload;
    const lobby = lobbies[lobbyName];

    if (!lobby) {
        sendResponse(ws, { type: 'lobby_leave', payload: { success: false, error: 'Lobby does not exist' } });
        return;
    }

    lobby.users = lobby.users.filter((client) => client !== ws);
    if (lobby.users.length === 0) {
        delete lobbies[lobbyName];
    } else {
        sendResponse(ws, { type: 'lobby_leave', payload: { success: true, lobbyName } });
    }
}

function handleLobbyChat(ws: WebSocketWithAuth, message: Request) {
    const { user, lobbyName, message: chatMessage } = message.payload;
    const lobby = lobbies[lobbyName];

    if (!lobby) {
        sendResponse(ws, { type: 'lobby_chat', payload: { user, lobbyName, message: 'Lobby does not exist' } });
        return;
    }

    lobby.chatHistory.push(chatMessage);
    lobby.users.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

function handleGameMove(ws: WebSocketWithAuth, message: GameMoveRequest) {
    const { user, lobbyName, move } = message.payload;
    const lobby = lobbies[lobbyName];

    if (!lobby) {
        sendResponse(ws, { type: 'game_move', payload: { user, lobbyName, move: 'Lobby does not exist' } });
        return;
    }

    // Update game state based on the move
    // const newState = updateGameState(lobby.gameState, move);

    // Broadcast the new game state to all users in the lobby
    const gameStateMessage: Response = {
        type: 'game_state',
        payload: {
            lobbyName,
            state: lobby.gameState, // Use the updated state
        },
    };

    lobby.users.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(gameStateMessage));
        }
    });
}