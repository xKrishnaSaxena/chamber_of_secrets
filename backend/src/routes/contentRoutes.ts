import express from "express";
import { protect } from "./../controllers/authController";
import {
  createContent,
  deleteContent,
  getContentByUser,
} from "../controllers/contentController";
const contentRouter = express.Router();

contentRouter.post("/", protect, createContent);
contentRouter.get("/", protect, getContentByUser);
contentRouter.delete("/:id", protect, deleteContent);

export default contentRouter;
