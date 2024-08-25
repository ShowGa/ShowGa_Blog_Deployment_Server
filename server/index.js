import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// router
import authRouter from "./routes/auth_route.js";
import postRouter from "./routes/post_route.js";
import userRouter from "./routes/user_route.js";
import commentRouter from "./routes/comment_route.js";

dotenv.config();
const app = express();

mongoose
  .connect(process.env.MONGODB_CONNECTION || "mongodb://127.0.0.1/showgablogDB")
  .then(() => {
    console.log("Successfully connect to MongoDB");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(
  cors({
    origin: process.env.FRONTEND_SITE,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// route
app.use("/server/auth", authRouter);
app.use("/server/post", postRouter);
app.use("/server/user", userRouter);
app.use("/server/comment", commentRouter);

app.listen(8080, () => {
  console.log("Server listening to Port 8080");
});
