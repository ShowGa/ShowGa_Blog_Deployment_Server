import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // check if the user was existed
    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser) {
      return res.status(400).json({
        error: "User existed ! Please change your email or username .",
      });
    }
    // hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);
    // create and save user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    // exclude the password
    const { password: ps, ...rest } = savedUser._doc;

    return res.status(201).json(rest);
  } catch (e) {
    console.log("Error in signUp controller", e.message);
    res
      .status(500)
      .json({ error: "Internal Server Error ! Please contact us ." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check user email and password
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(402).json({ error: "Invalid username or password !" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(402).json({ error: "Invalid username or password !" });
    }

    const { password: ps, ...rest } = foundUser._doc;
    // generate token and send cookie
    generateTokenAndSetCookie(foundUser._id, foundUser.isAdmin, res);
    return res.status(200).json(rest);
  } catch (e) {
    console.log("Error in login controller", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logOut = (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "Logout successfully !" });
  } catch (e) {
    console.log("Error in logout controller", e.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const loginGoogle = async (req, res) => {
  try {
    const { username, email, avatar } = req.body;
    const foundUser = await User.findOne({ email });
    // check if user existed
    if (foundUser) {
      generateTokenAndSetCookie(foundUser._id, foundUser.isAdmin, res);
      // take off the password
      const { password: ps, ...rest } = foundUser._doc;
      return res.status(200).json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        avatar,
      });

      const savedUser = await newUser.save();

      generateTokenAndSetCookie(savedUser._id, savedUser.isAdmin, res);

      // take off the password
      const { password: ps, ...rest } = savedUser._doc;
      return res.status(200).json(rest);
    }
  } catch (e) {
    console.log("Error in loginGoogle controller", e.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
