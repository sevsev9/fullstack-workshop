import { Router } from "express";
import validate from "../middleware/validateResource";
import requireUser from "../middleware/requireUser";
import { getUserProfileHandler, updateUserProfileHandler } from "../controller/user.controller";
import { updateUserProfileSchema } from "../schema/user.schema";

// path: /api/user
const router = Router();

router.get('/profile', requireUser, getUserProfileHandler);

router.put('/profile', [requireUser, validate(updateUserProfileSchema)], updateUserProfileHandler);

export default router;