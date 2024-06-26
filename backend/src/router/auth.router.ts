import { Request, Response, NextFunction, Router } from "express";
import loggerUtil from "../util/logger.util";
import validate from "../middleware/validateResource";
import { loginUserSchema, refreshAccessTokenSchema, registerUserSchema } from "../schema/auth.schema";
import requireUser from "../middleware/requireUser";
import { loginHandler, logoutHandler, refreshAccessTokenHandler, registerHandler } from "../controller/auth.controller";

// path: /api/auth
const router = Router();

// register with full name, email and password
router.post('/register', [loggedInRedirect, validate(registerUserSchema)], registerHandler)

// log in with email and password
router.post('/login', [loggedInRedirect, validate(loginUserSchema)], loginHandler)

// route for getting a new access token from the refresh token
router.post('/refresh', [validate(refreshAccessTokenSchema)], refreshAccessTokenHandler);

// logout route
router.post('/logout', requireUser, logoutHandler);

function loggedInRedirect(req: Request, res: Response, next: NextFunction) {
    if (res.locals.user) {
        loggerUtil.debug(`Logged in user tried to go to login/signup page | sid:${res.locals.user.sessionId}`);
        return res.redirect('/');
    }

    next();
}

export default router;