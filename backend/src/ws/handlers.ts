import { Server as WsServer, WebSocket } from 'ws';
import { GameMoveRequest, GlobalChatRequest, LobbyCreateRequest, WSLobby, WebSocketWithAuth, Request, Response, WSPlayerInfo, LobbyJoinRequest, LobbyLeaveRequest, LobbyChatRequest, ErrorResponse, GameMoveResponse, LobbyKickedResponse, LobbyListRequest, LobbyListResponse } from '../types/ws.types';
import { verifyJwt } from '../util/jwt.util';
import { uuid } from 'uuidv4';
import { endGame, updateGameState } from '../service/game.service';
import loggerUtil from '../util/logger.util';

const lobbies: Record<string, WSLobby> = {};
const wss: WsServer = {} as WsServer;

export const connectionHandler = (wss: WsServer) => (ws: WebSocketWithAuth) => {
    // check if the wss has already been initialized
    if (!wss) {
        wss = wss;
    }

    loggerUtil.info('{WebSocket - Connection Handler} - Client has connected');

    try {
        const token = ws.protocol;
        const { valid, expired, decoded, error } = verifyJwt(token);

        // inivalid can also mean expired or malformed
        if (!valid) {
            ws.send(JSON.stringify({ type: 'warn', payload: { error: 'Invalid or expired token' } }));
        }

        ws.user = decoded.user;

        loggerUtil.info(`{WebSocket - Connection Handler} - User ${decoded.user.username} was authenticated successfully.`);

        // send the currently active and joinable lobbies to the user
        const lobbiesList = Object.values(lobbies).filter(e => e.players.length === 1).map((lobby) => ({ name: lobby.name }));

        ws.send(JSON.stringify({ type: 'lobby_list', payload: { lobbies: lobbiesList } } as LobbyListResponse));
    } catch (err) {
        ws.send(JSON.stringify({ type: 'warn', payload: { error: 'Invalid or expired token' } }));
    }


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
        
        // Find the lobby that the user was in
        const lobby = Object.values(lobbies).find((lobby) => lobby.players.some((player) => player.socket === ws));

        if (!lobby) {
            return;
        }

        // Remove the player from the lobby
        lobby.players = lobby.players.filter((player) => player.socket !== ws);

        // If the player was the last one in the lobby, delete the lobby
        if (lobby.players.length === 0) {
            delete lobbies[lobby.name];
        } else {
            // Broadcast the new lobby state to all players in the lobby
            const gameStateMessage: LobbyKickedResponse = {
                type: 'lobby_kicked',
                payload: {
                    lobbyName: lobby.name
                },
            };

            lobby.players.forEach((wpi) => {
                if (wpi.socket.readyState === WebSocket.OPEN) {
                    wpi.socket.send(JSON.stringify(gameStateMessage));
                }
            });
        }
    });
}

function sendResponse(ws: WebSocketWithAuth, response: Response) {
    ws.send(JSON.stringify(response));
}

/**
 * Sends the updated lobby list to all clients.
 */
function broadcastLobbyList() {
    const lobbiesList = Object.values(lobbies).filter(e => e.players.length === 1).map((lobby) => ({ name: lobby.name }));
    
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'lobby_list', payload: { lobbies: lobbiesList } } as LobbyListResponse));
        }
    });
}

/**
 * Sends a message to all clients in a lobby.
 * @param lobby The lobby to send the message to
 * @param message The message to send
 */
function sendMessagesToLobby(lobby: WSLobby, message: LobbyChatRequest) {
    lobby.players.forEach((wpi) => {
        if (wpi.socket.readyState === WebSocket.OPEN) {
            wpi.socket.send(JSON.stringify(message));
        }
    });
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

    // Broadcast the updated lobby list to all clients
    broadcastLobbyList();
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

    // Broadcast the updated lobby list to all clients
    broadcastLobbyList();
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

    // Broadcast the updated lobby list to all clients
    broadcastLobbyList();
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

    // Broadcast the message to all clients in the lobby
    sendMessagesToLobby(lobby, message);
}

function handleGameMove(ws: WebSocketWithAuth, message: GameMoveRequest) {
    const { user, lobbyName, move } = message.payload;
    const lobby = lobbies[lobbyName];

    if (!lobby) {
        sendResponse(ws, {
            type: 'error',
            payload: {
                error: 'Lobby does not exist',
            }
        } as ErrorResponse);
        return;
    }

    if (!lobby.game) {
        sendResponse(ws, {
            type: 'error',
            payload: {
                error: 'Game has not started',
            }
        } as ErrorResponse);
        return;
    }

    // Update game state based on the move
    const newState = updateGameState(lobby.game, move);

    // Broadcast the new game state to all users in the lobby
    const gameStateMessage: GameMoveResponse = {
        type: 'game_move',
        payload: {
            lobbyName,
            user,
            move,
        },
    };

    lobby.players.forEach((wpi) => {
        if (wpi.socket.readyState === WebSocket.OPEN) {
            wpi.socket.send(JSON.stringify(gameStateMessage));
        }
    });

    // Check if the game is over
    if (newState.finished) {


        // handles the db logic for ending the game
        endGame(lobby.game);
    }
}