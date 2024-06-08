// This utility function is used to connect to the mongodb database
import mongoose from "mongoose";
import logger from "./logger.util";

export default async function connect(db_uri: string) {
    try {
        await mongoose.connect(db_uri);
        logger.info("Connected to MongoDB");
    } catch (err) {
        logger.error(err);
    }
}