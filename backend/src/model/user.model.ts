/**
 * Game statistics
 * - wins
 * - losses
 * - draws
 * - games played
 * - games abandoned
 * - time played (in game)
 * - time in lobby
 * - averate time per game
 * - average time per move
 */

import mongoose from "mongoose";

export enum ROLE {
    ADMIN = "admin",
    USER = "user",
}

export type User = {
    username: string;
    email: string;

    /**
     * hashed and salted password
     */
    password?: string;

    role: ROLE;
};

export type UserDocument = User & mongoose.Document<string>;

export const UserSchema = new mongoose.Schema<UserDocument>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: Object.values(ROLE),
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const UserModel = mongoose.model<UserDocument>("User", UserSchema);

export default UserModel;
