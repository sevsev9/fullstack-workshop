import { Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
import type { MongoServerError } from "mongodb";
import { pick } from "lodash";

import logger from "../util/logger.util";

import { LoginUserInput, RegisterUserInput, RefreshAccessTokenInput } from "../schema/auth.schema";
import type {  } from "../schema/auth.schema";

import { signJwt } from "../util/jwt.util";

import { createSession, invalidateAllSessionsForUser, reIssueAccessToken } from "../service/session.service";
import { createUser, validateUserCredentials } from "../service/user.service";

import { UserJwtPayload } from "../types/jwt.types";
import { ApplicationError, ErrorCode } from "../types/errors";
import { CustomSchemaExpressHandler } from "../types/handler.types";


/**
 * Handles the registration of a user.
 */
export const registerHandler: CustomSchemaExpressHandler<RegisterUserInput> = async (req, res) => {
    const { email, username, password } = req.body;

    logger.debug(`{Auth Controller | Register Handler} - register user body: ${JSON.stringify(req.body)}`);

    logger.info(`{Auth Controller | Register Handler} - Creating User with email ${email}`);

    try {
        await createUser(email, username, password);
    } catch (e) {
        if ((e as Error).name === "MongoServerError") {
            const msr = e as MongoServerError;

            if (msr.code === 11000) {
                logger.warn(`{Auth Controller | Register Handler} - Error creating user with email ${email} | ${msr.error}`);

                let field = Object.keys(msr.keyValue)[0];
                return res.status(409).json({
                    message: 'A user with the given email already exists.',
                    field,
                    value: msr.keyValue[field]
                });
            }
        } else if ((e as Error).name === "ValidationError") {
            const err = e as MongooseError.ValidationError;
            logger.warn(`{Auth Controller | Register Handler} - Error creating user with email ${email} | ${err.message}`);

            return res.status(400).json({
                message: err.message,
                errorFields: Object.keys(err.errors).map(key => {
                    return {
                        field: key,
                        value: "" + err.errors[key].value,
                        message: err.errors[key].message
                    }
                })
            });
        }

        logger.error(`{Auth Controller | Register Handler} - An unexpected error occurred: [${(e as Error).name}]:${(e as Error).message}`);

        return res.status(500).json({
            error: (e as Error).message
        })
    }

    logger.info(`{Auth Controller | Register Handler} - Successfully created new user with email ${email}.`);

    // @roadmap email verification would come here

    res.status(201).json({
        message: "User successfully created, you can log in now."
    });
}


/**
 * Handles the login of a user.
 * @param req A request containing the input required for a login procedure
 */
export const loginHandler: CustomSchemaExpressHandler<LoginUserInput> = async (req, res) => {
    try {
        logger.debug(`{Login Handler | Login Handler} - Validating credentials for user ${req.body.email}...`);

        const user = await validateUserCredentials(req.body.email, req.body.password);

        logger.debug(`{Login Handler | Login Handler} - User ${user.email}(_id: ${user._id}) successfully validated. Creating session...`);

        // check if a session is currently active (should not be - just for consistency)
        const invalidated = await invalidateAllSessionsForUser(user._id);

        if (invalidated > 0) {
            logger.warn(`{Auth Controller | Login Handler} - Found valid session in the login process. Be aware for inconsistencies! - userId="${user._id}" - Invalidating...`);
        }

        // create new session
        const session = await createSession(user._id, req.headers['user-agent'] ?? "not defined");

        logger.debug("{Auth Controller | Login Handler} - session created: " + session.id + "for user " + user.email);

        // create user info object to sign jwt with
        const userinfo = {...pick(user, ["_id", "username", "email", "role"]), sessionId: session._id};

        // create new access JWT
        const access_token = signJwt( userinfo as UserJwtPayload, { expiresIn: process.env.ACCESS_TOKEN_TTL } );

        // create new refresh JWT
        const refresh_token = signJwt( userinfo as UserJwtPayload, { expiresIn: process.env.REFRESH_TOKEN_TTL } );

        return res.status(200).json({
            access_token,
            refresh_token,
            user: user
        })
    } catch (e) {
        if (e instanceof ApplicationError) {
            const err = e as ApplicationError;

            if (err.errorCode === ErrorCode.USER_NOT_FOUND) {
                logger.warn(`{Auth Controller | Login Handler} - User ${req.body.email} not found.`);
                return res.status(404).json({ message: err.message });
            }
        }

        logger.warn(`{Auth Controller | Login Handler} - Error while logging in user ${req.body.email}: [${(e as Error).name}]: ${(e as Error).message}`);
        res.status(401).json({ message: (e as Error).message });
    }
}


/**
 * Issues a new access token for a given refresh token if it is still valid.
 * @param req A request containing the x-refresh header with the refresh token
 * @param res Responds with a json body containing the new access token if the procedure succeeded
 */
export const refreshAccessTokenHandler: CustomSchemaExpressHandler<RefreshAccessTokenInput> = async (req, res) => {
    logger.debug(`{Auth Controller | Refresh Access Token} - Attempting to issue new access token for refresh token: '${req.body.refresh_token.slice(0, 10)}...${req.body.refresh_token.slice(-10)}'`);

    const at = await reIssueAccessToken(req.body.refresh_token);

    if (at.error) {
        logger.warn(`{Auth Controller | Refresh Access Token} - User tried to get new access token with invalid refresh token: ${at.error} | '${req.body.refresh_token.slice(0, 10)}...${req.body.refresh_token.slice(-10)}'`);

        return res.status(401).json({ error: at.error });
    }

    res.status(200).json({
        access_token: at.jwt
    });
}


/**
 * Invalidates a session for a user
 * @param res response containing locals with the session id to invalidate
 */
export async function logoutHandler(
    _: Request,
    res: Response
) {
    try {
        const invalidated_count = await invalidateAllSessionsForUser(res.locals.user._id);

        logger.debug(`{Auth Controller} - Succesfully processed logout request for user ${res.locals.user._id} - Invalidated session${invalidated_count > 1 ? "s" :""}: ${invalidated_count}`);
        return res.status(200).json({
            message: "Successfully logged out."
        });
    } catch (e) {
        logger.error(`{Auth Controller} - Error invalidating session(s) for user ${res.locals.user._id}: `, e);
        return res.status(500).send(e);
    }
}
