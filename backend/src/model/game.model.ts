import { UserDocument } from "./user.model"

export type Move = {
    player: UserDocument["id"];

    // rfc3339
    timestamp: string;

    field_idx: [number, number];
    cell_idx: [number, number];
}

export type Game = {
    game_id: string, // generated uuid v4
    player_x: UserDocument["id"], // objectid
    player_o: UserDocument["id"], // objectid
    moves: Array<Move>,
    winner?: string, // objectid
}


