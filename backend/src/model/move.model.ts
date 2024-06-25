import mongoose, { Document } from "mongoose";
import { UserDocument } from "./user.model";

export type Move = {
    player: UserDocument["id"];

    // rfc3339
    timestamp: string;

    position: [number, number];

    // optional for super modes
    super_field?: [number, number];
};

export type MoveDocument = Document<string, any, Move>;

export const MoveModel = mongoose.model<Move>("Move", new mongoose.Schema<Move>({
    player: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    timestamp: { type: String, required: true },
    position: { type: [Number], required: true },
    super_field: { type: [Number] }
}));

export default MoveModel;