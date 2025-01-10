import express from "express";
import { protect, signup, login } from "./../controllers/authController";
const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", login);

export default userRouter;
