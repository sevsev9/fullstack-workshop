import express from "express";
import mongoose from "mongoose";
import fs from "fs/promises";
import { Server } from "ws";

import cors from "./util/cors.util";
import connect from "./util/mongodb.util";
import logger from "./util/logger.util";
import { deserializeUser } from "./middleware/deserializeUser";
import router from "./router";
import { checkEnv } from "./util/env.util";
import { connectionHandler } from "./ws/handlers";

(async () => {
    try {
        checkEnv();
        logger.info("Successfully validated environment.");

        // attempt to read public key files
        try {
            logger.info(
                `Attempting to read key files. PRIV="${process.env.PRIVATE_KEY_FILE}", PUB="${process.env.PUBLIC_KEY_FILE}"`,
            );

            // read keys from files
            const private_key = await fs.readFile(
                process.env.PRIVATE_KEY_FILE,
                "utf-8",
            );
            const public_key = await fs.readFile(
                process.env.PUBLIC_KEY_FILE,
                "utf-8",
            );

            // set keys in environment
            process.env.PRIVATE_KEY = private_key;
            process.env.PUBLIC_KEY = public_key;

            logger.info(`Successfully loaded keys.`);
        } catch (e) {
            logger.error("Unable to read private or public key file.");
            process.exit(1);
        }

        if (process.env.DEV) {
            logger.warn("Running in DEVELOPMENT mode.");
        }

        // Connect to the database
        logger.info("Attempting to connect to configured mongodb...");
        await connect(process.env.DB_URL);
        logger.info("Successfully connected to mongodb!");

        const app = express();

        app.use(express.json());

        app.use(cors);

        // middleware to handle jwts if they exist in the request headers.
        app.use(deserializeUser);

        // add the routes
        app.use("/api", router);

        const server = app.listen(process.env.PORT, () => {
            logger.info(
                `Super-TicTacToe API running on port ${process.env.PORT}`,
            );
        });

        const wss = new Server({ server });

        wss.on("connection", connectionHandler);

        /**
         * Exit function to handle SIGTERM and SIGINT events
         */
        async function exit() {
            logger.info("Shutting down server...");

            try {
                await mongoose.disconnect();
            } catch (e) {
                logger.error("Could not close database connection");
            }

            server.close(() => {
                logger.info("Server shut down complete.");
            });

            process.exit(0);
        }

        // handle SIGINT and SIGTERM events
        process.on("SIGINT", exit);
        process.on("SIGTERM", exit);
    } catch (e) {
        if (e instanceof Error) {
            // address in use error
            if (e.message.includes("EADDRINUSE")) {
                logger.error(
                    `Error starting server: Port ${process.env.PORT} is already in use.`,
                );
                process.exit(1);
            } else {
                logger.error(
                    `Error starting server: [${e.name}]:${e.message} [${e.stack?.substring(0, 100)}...]`,
                );
            }
        }
    
        logger.error("Exiting due to error: ", e);
        process.exit(1);
    }
})();
