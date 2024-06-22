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

  // if the token is invalid
  if (!valid) {
    logger.warn(`Access token invalid: ${error} | '${accessToken}'`);
    res.locals.error = "Access token invalid."
    return next();
  }

  if (decoded) {
    logger.debug(`{Deserialize User} - Session ID from decoded JWT: ${decoded.sessionId} - valid: ${!expired} - url: ${req.url}`);
    try {
      
      if (!expired) {
        // Continue with valid decoded information
        res.locals.user = decoded;
        logger.debug(`{Deserialize User} - User ${decoded._id} deserialized from JWT`);
      } else {
        // Token expired
        res.locals.error = "Access token expired.";
      }
      
      return next();
    } catch (error) {
      logger.error("Error processing JWT: " + (error as Error).message);
      return res.status(500).json({ error: 'Internal server error during JWT processing' });
    }
  }
}