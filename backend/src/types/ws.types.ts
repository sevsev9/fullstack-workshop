import { Move } from "../model/game.model";
import { UserDocument } from "../model/user.model";

export type WSPlayerInfo = {
    user_id: UserDocument["id"];
    username: UserDocument["username"];

    points: number;
};

export type WSGame = {
    game_id: string;
    player_x: WSPlayerInfo;
    player_y: WSPlayerInfo;
    moves: Array<Move>;

    // the player that is currently playing - next move swaps the two letters
    curr: "x" | "o";

    // the field that is currently being played - chosen randomly at the start
    active_field: [number, number];
};

export type WSGameFinishedEvent = {
    game_id: string;
    player: WSPlayerInfo;
};

export type WSLobby = {
    game_id: string; // generated uuid v4
    name: string;
    created: Date;
    players: Array<UserDocument["id"]>;
};
