import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  getPostAdmin,
  getSidebarPostCard,
  postClickLike,
  updatePost,
} from "../controllers/post_controller.js";

const router = express.Router();

router.post("/create", verifyUser, createPost);

router.delete("/delete/:postID", verifyUser, deletePost);

// for public search
router.get("/getallposts", getAllPosts);

router.get("/getpost/:slug", getPost);

// get recommend sidebar posts
router.get("/getsidebarpost", getSidebarPostCard);

// get post in admin dashboard
router.get("/getpostadmin/:postID", verifyUser, getPostAdmin);

router.patch("/updatepost/:slug", verifyUser, updatePost);

// Like
router.patch("/postclicklike", postClickLike);

export default router;
