import express from "express";
import { protect } from "./../controllers/authController";
import { createTag, getTags } from "../controllers/tagController";
const tagRouter = express.Router();

tagRouter.post("/", protect, createTag);
tagRouter.get("/", protect, getTags);

export default tagRouter;
