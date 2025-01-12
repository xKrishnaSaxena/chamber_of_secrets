import express from "express";
import { protect } from "./../controllers/authController";
import { makeShareable, shareLink } from "../controllers/linkController";

const linkRouter = express.Router();

linkRouter.post("/", protect, makeShareable);
linkRouter.get("/:shareLink", protect, shareLink);

export default linkRouter;
