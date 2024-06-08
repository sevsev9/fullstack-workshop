import mongoose from "mongoose";

export enum ROLE {
    ADMIN = "admin",
    USER = "user"
}

export type User = {
    username: string;
    email: string;
    
    /**
     * hashed and salted password
     */ 
    password?: string;

    role: ROLE;

    createdAt?: Date;
    updatedAt?: Date;
}

export type UserDocument = User & mongoose.Document;

export const UserSchema = new mongoose.Schema<UserDocument>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(ROLE),
        required: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            delete ret.password;
            delete ret.__v;
        }
    }
});
