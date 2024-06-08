import { Move } from "../model/game.model";
import { UserDocument } from "../model/user.model";

export type WSPlayerInfo = {
    user_id: UserDocument["id"];
    username: UserDocument["username"];

    points: number;
};

export type WSGame = {
    player_x: WSPlayerInfo;
    player_o: WSPlayerInfo;

    // the timestamp when the game was started
    game_started: Date;

    moves: Array<Move>;

    // the player that is currently playing - next move swaps the two letters
    curr: "x" | "o";

    // the field that is currently being played - chosen randomly at the start
    active_field: number;
};

export type WSGameFinishedEvent = {
    game_id: string;
    winner: WSPlayerInfo;
    reason: "win" | "draw" | "forfeit";
    timestamp: Date;
};

export type WSLobby = {
    game_id: string; // generated uuid v4
    name: string;
    created: Date;
    players: Array<{
        user_id: UserDocument["_id"],
        username: UserDocument["username"]
        socket: WebSocket
    }>;
    // chatHistory: Array<{ user: UserDocument["username"], message: string, timestamp: Date }>;

    /**
     * The game that is currently being played in this lobby.
     * 
     * If this is undefined, the lobby is in the lobby state until the game is started by 
     */
    game?: WSGame;
};

export type MessageType =
    | 'global_chat'
    | 'lobby_create'
    | 'lobby_join'
    | 'lobby_leave'
    | 'lobby_kick'
    | 'lobby_kicked'
    | 'lobby_chat'
    | 'game_move'
    | 'game_state'
    | 'auth'
    | 'error';

interface BaseMessage<T extends MessageType, P> {
    type: T;
    payload: P;
}

// Request Types
export type Request =
    | BaseMessage<'global_chat', { user: string; message: string }>
    | BaseMessage<'lobby_create', { user: string; lobbyName: string }>
    | BaseMessage<'lobby_join', { user: string; lobbyName: string }>
    | BaseMessage<'lobby_leave', { user: string; lobbyName: string }>
    | BaseMessage<'lobby_kick', { user: string; lobbyName: string; target: string }>
    | BaseMessage<'lobby_chat', { user: string; lobbyName: string; message: string }>
    | BaseMessage<'auth', { token: string }>
    | BaseMessage<'game_move', { user: string; lobbyName: string; move: any }>;

// Response Types
export type Response =
    | BaseMessage<'global_chat', { user: string; message: string }>
    | BaseMessage<'lobby_create', { success: boolean; lobbyName?: string; error?: string }>
    | BaseMessage<'lobby_join', { success: boolean; lobbyName?: string; error?: string }>
    | BaseMessage<'lobby_leave', { success: boolean; lobbyName?: string; error?: string }>
    | BaseMessage<'lobby_kick', { success: boolean; lobbyName?: string; error?: string }>
    | BaseMessage<'lobby_kicked', { lobbyName: string }>
    | BaseMessage<'lobby_chat', { user: string; lobbyName: string; message: string }>
    | BaseMessage<'game_move', { user: string; lobbyName: string; move: any }>
    | BaseMessage<'game_state', { lobbyName: string; state: any }>
    | BaseMessage<'auth', { success: boolean; error?: string }>
    | BaseMessage<'error', { error: string }>;
