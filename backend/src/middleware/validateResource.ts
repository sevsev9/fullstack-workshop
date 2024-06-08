import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import logger from "../util/logger.util";

const validate =
    (schema: AnyZodObject) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                Object.assign(req, schema.parse({
                    body: req.body,
                    query: req.query,
                    params: req.params,
                }));

                logger.debug("{Validation Middleware} - Validation passed.");

                next();
            } catch (e: any) {
                return res.status(400).json({ message: e.errors });
            }
        };

export default validate;
