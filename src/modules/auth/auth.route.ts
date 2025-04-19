import express from "express";
import { Login, Logout, Register } from "./auth.controler";

const userRouter = express.Router();

userRouter.route("/register")
.post(Register)

userRouter.route("/login")
.post(Login)

userRouter.route("/logout")
.delete(Logout)

export default userRouter;