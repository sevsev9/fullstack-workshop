import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../util/jwt.util";
import logger from "../util/logger.util";

/**
 * This middleware handles the verification and deserialization of the user information stored in a provided jwt
 * @param req A request containing the jwt in the "Authentication" header as Bearer token
 * @param res 
 * @param next 
 * @returns 
 */
export async function deserializeUser(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.headers.authorization?.replace(/^Bearer\s/, "");

  // no access token
  if (!accessToken) {
    res.locals.error = "No access token provided.";
    return next();
  }

  const { valid, expired, decoded, error } = verifyJwt(accessToken);

  // if the token is invalid but also not expired
  if (!valid && !expired) {
    logger.warn(`Access token invalid: ${error} | '${accessToken}'`);
    res.locals.error = "Access token invalid."
    return next();
  }

  if (decoded) {
    logger.debug(`{Deserialize User} - Session ID from decoded JWT: ${decoded.sessionId} - valid: ${!expired} - url: ${req.url}`);
    try {
      if (expired) {
        /**
         * If expired, the user gives us an access token that has expired,
         * this does NOT mean we should invalidate the whole session
         * but rather prompt the user to call the refresh endpoint to aquire a new access token
         * 
         * the session should only be invalidated if the user comes with an expired refresh token,
         * which is to be done in the /auth/refresh handler
         */

        if (req.url !== "/api/auth/logout" && req.url !== "/api/auth/refresh" && req.url !== "/api/healthcheck") {
          return res.status(401).json({ error: 'Access token expired, please refresh your session' });
        } else {
          logger.debug(`{Deserialize User} - Let expired access token pass to '${req.url}' - SessionId: ${decoded.sessionId}`);
        }
      }

      // Continue with valid decoded information
      res.locals.user = decoded;
      logger.debug(`{Deserialize User} - User ${decoded._id} deserialized from JWT`);

      return next();
    } catch (error) {
      logger.error("Error processing JWT: " + (error as Error).message);
      return res.status(500).json({ error: 'Internal server error during JWT processing' });
    }
  }
}