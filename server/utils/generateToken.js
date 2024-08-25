import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, isAdmin, res) => {
  const token = jwt.sign({ id: userId, isAdmin }, process.env.JWT_SECRET);

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    // prevent XSS attacks cross-site scripting attacks
    httpOnly: true,
    // CSRF attacks cross-site request forgery attacks
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
};

export default generateTokenAndSetCookie;
