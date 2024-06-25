import MoveModel, { Move } from "./move.model";
import { UserDocument } from "./user.model";
import mongoose, { Document } from "mongoose";

export type Game = {
    game_id: string; // generated uuid v4
    player_x: UserDocument["id"]; // objectid
    player_o: UserDocument["id"]; // objectid
    moves: Array<Move>;
    winner?: string; // objectid
};

export type GameDocument = Document<string, any, Game>;

export const GameModel = mongoose.model<Game>("Game", new mongoose.Schema<Game>({
    game_id: { type: String, required: true },
    player_x: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    player_o: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    moves: { type: [MoveModel], required: true },
    winner: { type: mongoose.Schema.Types.ObjectId }
}));

export default GameModel;