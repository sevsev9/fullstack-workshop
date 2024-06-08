import { ROLE } from "../model/user.model";

export type UserJwtPayload = {
    _id: string;
    role: ROLE;
    session_id: string;
    exp?: number; // expiration date
    iat?: number; // issued at
}

export type VerifyJwtResult = {
    valid: boolean;
    expired?: boolean;
    decoded?: UserJwtPayload;
    error?: string | null;
}