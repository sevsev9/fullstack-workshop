import exp from "constants";
import { Move } from "../model/game.model";
import { UserDocument } from "../model/user.model";
import WebSocket from "ws";
import { VerifyJwtResult } from "./jwt.types";

export type WSPlayerInfo = {
    user_id: UserDocument["_id"],
    username: UserDocument["username"]
    socket: WebSocket
}

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
    players: Array<WSPlayerInfo>;
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
    | 'warn'
    | 'error';

export interface BaseMessage<T extends MessageType, P> {
    type: T;
    payload: P;
    token?: string;
}

// Request Types
export type GlobalChatRequest = BaseMessage<'global_chat', { user: string; message: string }>;
export type LobbyCreateRequest = BaseMessage<'lobby_create', { user: string; lobbyName: string }>;
export type LobbyJoinRequest = BaseMessage<'lobby_join', { user: string; lobbyName: string }>;
export type LobbyLeaveRequest = BaseMessage<'lobby_leave', { user: string; lobbyName: string }>;
export type LobbyKickRequest = BaseMessage<'lobby_kick', { user: string; lobbyName: string; target: string }>;
export type LobbyChatRequest = BaseMessage<'lobby_chat', { user: string; lobbyName: string; message: string }>;
export type GameMoveRequest = BaseMessage<'game_move', { user: string; lobbyName: string; move: any }>;

export type Request = GlobalChatRequest | LobbyCreateRequest | LobbyJoinRequest | LobbyLeaveRequest | LobbyKickRequest | LobbyChatRequest | GameMoveRequest;

// Response Types
export type GlobalChatResponse = BaseMessage<'global_chat', { user: string; message: string }>;
export type LobbyCreateResponse = BaseMessage<'lobby_create', { success: boolean; lobbyName?: string; error?: string }>;
export type LobbyJoinResponse = BaseMessage<'lobby_join', { success: boolean; lobbyName?: string; error?: string }>;
export type LobbyLeaveResponse = BaseMessage<'lobby_leave', { success: boolean; lobbyName?: string; error?: string }>;
export type LobbyKickResponse = BaseMessage<'lobby_kick', { success: boolean; lobbyName?: string; error?: string }>;
export type LobbyKickedResponse = BaseMessage<'lobby_kicked', { lobbyName: string }>;
export type LobbyChatResponse = BaseMessage<'lobby_chat', { user: string; lobbyName: string; message: string }>;
export type GameMoveResponse = BaseMessage<'game_move', { user: string; lobbyName: string; move: any }>;
export type GameStateResponse = BaseMessage<'game_state', { lobbyName: string; state: any }>;
export type WarningResponse = BaseMessage<'warn', { message: string }>
export type ErrorResponse = BaseMessage<'error', { error: string }>;

export type Response = GlobalChatResponse | LobbyCreateResponse | LobbyJoinResponse | LobbyLeaveResponse | LobbyKickResponse | LobbyKickedResponse | LobbyChatResponse | GameMoveResponse | GameStateResponse | WarningResponse | ErrorResponse;

export interface WebSocketWithAuth extends WebSocket {
    user?: VerifyJwtResult;
}