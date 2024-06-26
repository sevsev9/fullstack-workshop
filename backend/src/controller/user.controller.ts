import { Application, Request, Response } from "express";
import { Error as MongooseError } from "mongoose";

import logger from "../util/logger.util";
import { UpdateUserProfileInput } from "../schema/user.schema";
import { UpdatedFields, findUserById, updateUser } from "../service/user.service";
import { CustomSchemaExpressHandler } from "./handler.type";
import { ApplicationError } from "../types/errors";

export async function getUserProfileHandler(
    _: Request,
    res: Response
) {
    const uid = res.locals.user._id;

    try {
        const user = await findUserById(uid);

        return res.status(200).json(user);
    } catch (e) {
        logger.debug(`{User Controller | Get User Profile} - Error: ${e}`);

        if ((e as Error).name === "ApplicationError") {
            const err = e as ApplicationError;

            logger.error(`{User Controller | Get User Profile} - Error ${err.errorCode}: ${err.message}`);
            return res.status(400).json([
                {
                    message: err.message,
                    errorCode: err.errorCode
                }
            ]);
        }

        return res.status(400).json({
            message: "An unexpected error occurred",
        });
    }

}


export const updateUserProfileHandler: CustomSchemaExpressHandler<UpdateUserProfileInput> = async (req, res) => {
    try {
        logger.debug(`{User Controller | Update User Profile} - Updating user profile: ${JSON.stringify(req.body)}`);

        // send passive aggressive 204 back if empty body is received
        if (Object.keys(req.body).length === 0) {
            return res.status(204).send();
        } else {
            logger.info(`{User Controller | Update User Profile} - Updating keys: ${Array.from(Object.keys(req.body))}`);
        }

        const updates: UpdatedFields = await updateUser(res.locals.user._id, req.body);

        logger.info(`{User Controller | Update User Profile} - Updated User with the following data: ${JSON.stringify(updates)}`);

        return res.status(201).json({
            message: `Successfully updated data`,
            updates
        });
    } catch (e: any) {
        logger.warn(`{User Controller | Update User Profile} - [${e.name}] - ${e.message}`);

        return res.status(500).json(e);
    }
}