import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorize ! Please login again ." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      return req
        .status(400)
        .json({ error: "Unauthorize ! Invalid token, please login again ." });
    }

    req.user = user;
  });

  next();
};
