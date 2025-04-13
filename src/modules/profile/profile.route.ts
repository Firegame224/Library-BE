import Express from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { getProfile } from "./profile.controllers";

const profileRouter = Express.Router();

profileRouter.get("/" , authMiddleware , getProfile)

export default profileRouter