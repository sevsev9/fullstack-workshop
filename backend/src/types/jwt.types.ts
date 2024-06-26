import { ROLE } from "../model/user.model";

export type UserJwtPayload = {
    _id: string;
    username: string;
    role: ROLE;
    sessionId: string;
    exp?: number; // expiration date
    iat?: number; // issued at
}

export type VerifyJwtResult = {
    valid: boolean;
    expired?: boolean;
    decoded?: UserJwtPayload;
    error?: string | null;
}