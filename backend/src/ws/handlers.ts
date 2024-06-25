import { Server as WsServer, WebSocket } from 'ws';
import { GameMoveRequest, GlobalChatRequest, LobbyCreateRequest, WSLobby, WebSocketWithAuth, Request, Response, WSPlayerInfo, LobbyJoinRequest, LobbyLeaveRequest, LobbyChatRequest, GameMoveResponse, GameStateResponse } from '../types/ws.types';
import { verifyJwt } from '../util/jwt.util';
import { uuid } from 'uuidv4';

const lobbies: Record<string, WSLobby> = {};

export const connectionHandler = (wss: WsServer) => (ws: WebSocketWithAuth) => {
    // verify that the user is authenticated in the on open event
    ws.on('open', () => {
        try {
            const token = ws.protocol;
            const { valid, expired, decoded, error } = verifyJwt(token);

            if (!valid) {
                ws.send(JSON.stringify({ type: 'warn', payload: { error: 'Invalid or expired token' } }));
            }

            ws.user = decoded.user;
        } catch (err) {
            ws.send(JSON.stringify({ type: 'warn', payload: { error: 'Invalid or expired token' } }));
        }
    });


    ws.on('message', (message: string) => {
        const parsedMessage: Request = JSON.parse(message);

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
                handleGameMove(ws, parsedMessage);
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
    const { lobbyName } = message.payload;
    if (lobbies[lobbyName]) {
        sendResponse(ws, { type: 'lobby_create', payload: { success: false, error: 'Lobby already exists' } });
        return;
    }

    lobbies[lobbyName] = {
        game_id: uuid(),
        name: lobbyName,
        created: new Date(),
        players: [
            {
                user_id: ws.user.decoded?._id,
                username: ws.user.decoded?.username,
                socket: ws,
            } as WSPlayerInfo
        ],
        chatHistory: [],
        gameState: {}, // Initialize the game state
    } as WSLobby;

    sendResponse(ws, { type: 'lobby_create', payload: { success: true, lobbyName } });
}

function handleLobbyJoin(ws: WebSocketWithAuth, message: LobbyJoinRequest) {
    const { lobbyName } = message.payload;
    const lobby = lobbies[lobbyName];

    if (!lobby) {
        sendResponse(ws, { type: 'lobby_join', payload: { success: false, error: 'Lobby does not exist' } });
        return;
    }

    lobby.players.push({
        user_id: ws.user.decoded?._id,
        username: ws.user.decoded?.username,
        socket: ws,
    } as WSPlayerInfo);
    sendResponse(ws, { type: 'lobby_join', payload: { success: true, lobbyName } });
}

function handleLobbyLeave(ws: WebSocketWithAuth, message: LobbyLeaveRequest) {
    const { user, lobbyName } = message.payload;
    const lobby = lobbies[lobbyName];

    if (!lobby) {
        sendResponse(ws, { type: 'lobby_leave', payload: { success: false, error: 'Lobby does not exist' } });
        return;
    }

    lobby.players = lobby.players.filter((wpi) => wpi.socket !== ws);

    if (lobby.players.length === 0) {
        delete lobbies[lobbyName];
    } else {
        sendResponse(ws, { type: 'lobby_leave', payload: { success: true, lobbyName } });
    }
}

function handleLobbyChat(ws: WebSocketWithAuth, message: LobbyChatRequest) {
    const { user, lobbyName, message: chatMessage } = message.payload;
    const lobby = lobbies[lobbyName];

    if (!lobby) {
        sendResponse(ws, { type: 'lobby_chat', payload: { user, lobbyName, message: 'Lobby does not exist' } });
        return;
    }

    lobby.chatHistory.push({
        user,
        message: chatMessage,
        timestamp: new Date(),
    });

    lobby.players.forEach((wpi) => {
        if (wpi.socket.readyState === WebSocket.OPEN) {
            wpi.socket.send(JSON.stringify(message));
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
    const gameStateMessage: GameStateResponse = {
        type: 'game_state',
        payload: {
            lobbyName,
            state: lobby.game, // Use the updated state
        },
    };

    lobby.players.forEach((wpi) => {
        if (wpi.socket.readyState === WebSocket.OPEN) {
            wpi.socket.send(JSON.stringify(gameStateMessage));
        }
    });
}