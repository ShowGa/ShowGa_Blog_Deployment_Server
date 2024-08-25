import express from "express";
import {
  login,
  loginGoogle,
  logOut,
  signUp,
} from "../controllers/auth_controller.js";

const router = express.Router();

router.post("/signup", signUp);

router.post("/login", login);

router.post("/loginGoogle", loginGoogle);

router.get("/logout", logOut);

export default router;
