// server/src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      return next(); // ✅ important: stop here if token is valid
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  // ✅ only runs if no token at all
  res.status(401).json({ message: "Not authorized, no token" });
});
