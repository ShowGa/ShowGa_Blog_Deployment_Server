import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import { deleteAccount, updateUser } from "../controllers/user_controller.js";

const router = express.Router();

// update User info
router.patch("/update/:userId", verifyUser, updateUser);

// delete account
router.delete("/delete/:userId", verifyUser, deleteAccount);

export default router;
