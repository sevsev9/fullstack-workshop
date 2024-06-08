import { Request, Response } from "express";

import logger from "../util/logger.util";
import { UpdateUserProfileInput } from "../schema/user.schema";
import { UpdatedFields, findUserById, updateUser } from "../service/user.service";

export async function getUserProfileHandler(
    req: Request,
    res: Response
) {
    const uid = res.locals.user._id;

    try {
        const user = await findUserById(uid);

        return res.status(200).json(user);
    } catch (e) {
        logger.warn(`Error ${(e as Error).name}: ${(e as Error).message}`);

        return res.status(400).json(e);
    }

}

export async function updateUserProfileHandler(
    req: Request<{}, {}, UpdateUserProfileInput["body"]>,
    res: Response
) {
    try {
        console.log(req.body);

        // send passive aggressive 204 back if empty body is received
        if (Object.keys(req.body).length === 0) {
            return res.status(204).send();
        } else {
            logger.info(`{User Controller} - Updating keys: ${Array.from(Object.keys(req.body))}`);
        }

        const updates: UpdatedFields = await updateUser(res.locals.user._id, req.body);

        logger.info(`{User Controller} - Updated User with the following data: ${JSON.stringify(updates)}`);

        return res.status(201).json({
            message: `Successfully updated data`,
            updates
        });
    } catch (e) {
        logger.warn(`{User Controller} - [${(e as Error).name}] - ${(e as Error).message}`);

        return res.status(500).json(e)
    }
}