import { Types } from "mongoose";
import Session, { SessionDocument } from "../model/session.model";
import { signJwt, verifyJwt } from "../util/jwt.util";
import { findUserById } from "./user.service";
import SessionModel from "../model/session.model";
import logger from "../util/logger.util";
import { UserDocument } from "../model/user.model";

/**
 * Creates a new session for a given user
 * @param user_id The user_id the session is for
 * @param userAgent The userAgent the user is requesting a new session from
 * @returns a new session
 */
export async function createSession(user_id: string, userAgent: string) {
    const session = await Session.create({ user_id: user_id, userAgent });
    return session;
}

/**
 * Returns a session for a given id, if it exists.
 * 
 * @param id The session id
 * @returns Session Document
 */
export async function findSessionById(id: Types.ObjectId) {
    try {
        return await SessionModel.findById(id);
    } catch (e) {
        throw new Error(`Failed to retrieve session: ${(e as Error).message}`);
    }
}

/**
 * Validates a session for a given session id.
 * 
 * @param id the session id
 * @returns true if the session is valid
 */
export async function validateSessionWithId(id: Types.ObjectId) {
    try {
        const session = await findSessionById(id);
        return session !== null && session.valid;
    } catch (e) {
        throw new Error(`Failed to validate session: ${(e as Error).message}`);
    }
}

/**
 * Reissues an access token if the refresh token and session are valid.
 * 
 * @param refreshToken The refresh token to verify.
 * @returns A new access token or an error message.
 */
export async function reIssueAccessToken(refreshToken: string): Promise<{ error: string, jwt: string | false }> {
    const { decoded, valid, error } = verifyJwt(refreshToken);

    if (!valid || !decoded) {
        logger.warn(`{Session Service} - Refresh token verification failed: ${error}`);
        return { jwt: false, error: "Invalid refresh token" };
    }

    try {
        const session = await Session.findById(decoded.session_id);
        if (!session || !session.valid) {
            logger.warn(`{Session Service} - Session ${decoded.session_id} invalid or not found`);
            return { jwt: false, error: "Invalid session" };
        }

        const user = await findUserById(session.user_id);
        if (!user) {
            logger.warn(`{Session Service} - User ${session.user_id} not found for session ${decoded.session_id}`);
            return { jwt: false, error: "User not found" };
        }

        const accessToken = signJwt({
            _id: user._id,
            username: user.username,
            role: user.role,
            session_id: session._id
        }, { expiresIn: process.env.ACCESS_TOKEN_TTL });

        return { jwt: accessToken, error: "" };

    } catch (err) {
        logger.error(`{Session Service} - Error in reIssuing access token: ${err}`);
        return { jwt: false, error: 'Error processing refresh token' };
    }
}

/**
 * Invalidates a session by setting its valid flag to false.
 * @param session_id The ID of the session to invalidate.
 */
export async function invalidateSession(session_id: SessionDocument["_id"]): Promise<void> {
    try {
        await SessionModel.findByIdAndUpdate(session_id, { valid: false });
        logger.info(`{Session Service} - Session ${session_id} invalidated successfully.`);
    } catch (error) {
        logger.error(`{Session Service} - Failed to invalidate session ${session_id}: ${(error as Error).message}`);
        throw new Error(`Failed to invalidate session: ${(error as Error).message}`);
    }
}

/**
 * Checks if a currently active session exists for a user, if that is the case, it returns the id.
 * @param user_id The ObjectId
 */
export async function findSessionForUser(user_id: UserDocument["_id"]): Promise<string | undefined> {
    const session = await SessionModel.findOne({ user_id: user_id });

    return session?.id;
}


/**
 * This function invalidates all sessions for a given user
 * @param user_id the ObjectId from the user to invalidate all sessions for
 */
export async function invalidateAllSessionsForUser(user_id: UserDocument["_id"]): Promise<number> {
    const sessions = await SessionModel.updateMany({ user_id: user_id, valid: true }, { valid: false });

    logger.info(`{Session Service} - Invalidated ${sessions.modifiedCount} session${sessions.modifiedCount > 1 ? 's': ''} for user ${user_id}.`);

    return sessions.modifiedCount;
}