import { ZodError, infer, object, string } from "zod";

const envVariables = object({
    PORT: string().default("8080").transform(e => {
        // check if the port is a int
        try {
            let p = parseInt(e);

            return p.toString();
        } catch (e) {
            console.warn("Error parsing given port, using default 8080");
        }

        return "8080";
    }),
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

export function checkEnv() {
    require("dotenv").config();

    try {
        // reassign process.env to the parsed env variables
        Object.assign(process.env, envVariables.parse(process.env));
    } catch (e) {
        if (e instanceof ZodError) {
            console.error(e.errors);
        }

        process.exit(1);
    }

    return process.env;
}

declare global {
    namespace NodeJS {
        interface ProcessEnv extends infer<typeof envVariables> { }
    }
}