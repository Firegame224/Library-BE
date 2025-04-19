import Express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { ProfileController } from "./profile.controler";
import { upload } from "../../middlewares/multer.middleware";

const profileRouter = Express.Router();
const profile = ProfileController();

profileRouter.route("/")
.get(authMiddleware , profile.getProfile)
.patch(authMiddleware, upload.single("image") , profile.updateProfile)
 
export default profileRouter;