import { coerce, object, string } from "zod";
import { config } from "dotenv";

// Load environment variables from .env file
config();

const envSchema = object({
    PORT: coerce.number({
        message: "PORT must be a number."
    }).default(3000),
    DB_URL: string({
        required_error: "DB_URL is required."
    }),
    SALT_WORK_FACTOR: string({
        required_error: "SALT_WORK_FACTOR is required."
    }).refine(e => parseInt(e) > 0, "Salt work factor must be greater than 0"),
    ACCESS_TOKEN_TTL: string({
        required_error: "ACCESS_TOKEN_TTL is required."
    }),
    REFRESH_TOKEN_TTL: string({
        required_error: "REFRESH_TOKEN_TTL is required."
    }),
    PRIVATE_KEY_FILE: string({
        required_error: "PRIVATE_KEY_FILE is required."
    }),
    PUBLIC_KEY_FILE: string({
        required_error: "PUBLIC_KEY_FILE is required."
    }),
    RUN_ENV: string().default("DEV").refine(e => ["DEV", "TEST", "PROD"].includes(e), "RUN_ENV must be DEV or PROD"),
    LOG_LEVEL: string().default("info").refine(e => ["trace", "debug", "info", "warn", "error", "fatal"].includes(e), "LOG_LEVEL must be one of trace, debug, info, warn, error, fatal"),
});

export default envSchema.parse(process.env);