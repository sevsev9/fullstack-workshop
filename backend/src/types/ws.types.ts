import { Move } from "../model/move.model";
import { UserDocument } from "../model/user.model";
import WebSocket from "ws";
import { UserJwtPayload } from "./jwt.types";

export type WSPlayerInfo = {
    userId: UserDocument["_id"],
    username: UserDocument["username"]
    socket: WebSocket
}

export enum GameMode {
    NORMAL = "normal",
    SUPER = "super",
    META = "meta",
    ULTIMATE = "ultimate"
}

/**
 * This type is a field in the game that represents a 3x3 grid of the game.
 * 
 * The field is represented as a 2D array of 3x3, where each element is either "x", "o" or null.
 */
export type ClassicField = {
    field: Array<Array<"x" | "o" | null>>;
    winner: "x" | "o" | null;
    draw: boolean;
    finished: boolean;
};

export type WSGame = {
    player_x: WSPlayerInfo;
    player_o: WSPlayerInfo;

    // the game mode that is being played
    mode: GameMode;

    // the timestamp when the game was started
    game_started: Date;

    moves: Array<Move>;

    // the player that is currently playing - next move swaps the two letters
    curr: "x" | "o";

    // the field that is currently being played - chosen randomly at the start
    active_field: number;

    // The field data for the game fields[i][j]: SubField represents the SubField that is located in the i-th row and j-th column of the game field
    super_fields?: Array<Array<ClassicField>>;

    // normal field
    field?: ClassicField;

    // game finished
    finished: boolean;

    // winner of the game
    winner?: WSPlayerInfo;
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
    chatHistory: Array<{ user: UserDocument["username"], message: string, timestamp: Date }>;

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
    | 'lobby_list'
    | 'game_start'
    | 'game_move'
    | 'game_state'  // for disconnects
    | 'game_end'
    | 'warn'
    | 'error';

export interface BaseMessage<T extends MessageType, P> {
    type: T;
    payload: P;
}

////////// Request Types

// Lobby requests
export type LobbyCreateRequest = BaseMessage<'lobby_create', { user: string; lobbyName: string }>;
export type LobbyJoinRequest = BaseMessage<'lobby_join', { user: string; lobbyName: string }>;
export type LobbyLeaveRequest = BaseMessage<'lobby_leave', { user: string; lobbyName: string }>;
export type LobbyKickRequest = BaseMessage<'lobby_kick', { user: string; lobbyName: string; target: string }>;
export type LobbyChatRequest = BaseMessage<'lobby_chat', { user: string; lobbyName: string; message: string }>;
export type LobbyListRequest = BaseMessage<'lobby_list', { lobbies: { name: string, full: boolean }}>;

// Game requests
export type GameStartRequest = BaseMessage<'game_start', { user: string; lobbyName: string; mode: GameMode }>;
export type GameMoveRequest = BaseMessage<'game_move', { user: string; lobbyName: string; move: Move }>;
export type GameStateRequest = BaseMessage<'game_state', { user: string; lobbyName: string }>;
export type GameEndRequest = BaseMessage<'game_end', { user: string; lobbyName: string }>;

// Meta requests
export type GlobalChatRequest = BaseMessage<'global_chat', { user: string; message: string }>;

export type Request = GlobalChatRequest | LobbyCreateRequest | LobbyJoinRequest | LobbyLeaveRequest | LobbyKickRequest | LobbyChatRequest | GameStartRequest | GameMoveRequest | GameEndRequest;

////////// Response Types

// Lobby responses
export type LobbyCreateResponse = BaseMessage<'lobby_create', { success: boolean; lobbyName?: string; error?: string }>;
export type LobbyJoinResponse = BaseMessage<'lobby_join', { success: boolean; lobbyName?: string; error?: string }>;
export type LobbyLeaveResponse = BaseMessage<'lobby_leave', { success: boolean; lobbyName?: string; error?: string }>;
export type LobbyKickResponse = BaseMessage<'lobby_kick', { success: boolean; lobbyName?: string; error?: string }>;
export type LobbyKickedResponse = BaseMessage<'lobby_kicked', { lobbyName: string }>;
export type LobbyChatResponse = BaseMessage<'lobby_chat', { user: string; lobbyName: string; message: string }>;
export type LobbyListResponse = BaseMessage<'lobby_list', { lobbies: { name: string }[] }>;

// Game responses
export type GameStartResponse = BaseMessage<'game_start', { mode: GameMode }>;
export type GameMoveResponse = BaseMessage<'game_move', { user: string; lobbyName: string; move: Move }>;
export type GameStateResponse = BaseMessage<'game_state', { state: WSGame }>;
export type GameEndResponse = BaseMessage<'game_end', { state: WSGame }>;

// Meta responses
export type GlobalChatResponse = BaseMessage<'global_chat', { user: string; message: string }>;
export type WarningResponse = BaseMessage<'warn', { message: string }>
export type ErrorResponse = BaseMessage<'error', { error: string }>;


export type Response = GlobalChatResponse | LobbyCreateResponse | LobbyJoinResponse | LobbyLeaveResponse | LobbyKickResponse | LobbyKickedResponse | LobbyChatResponse | GameStartResponse | GameMoveResponse | GameEndResponse | WarningResponse | ErrorResponse;

export interface WebSocketWithAuth extends WebSocket {
    user: UserJwtPayload;
}