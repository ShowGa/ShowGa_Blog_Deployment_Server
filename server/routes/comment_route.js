import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import {
  commentClickLike,
  createComment,
  getPostComments,
} from "../controllers/comment_controller.js";

const router = express.Router();

router.post("/create", verifyUser, createComment);

router.get("/getpostcomments/:belongPostID", getPostComments);

router.patch("/commentclicklike", commentClickLike);

export default router;
