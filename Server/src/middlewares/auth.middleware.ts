import jwt from "jsonwebtoken";
import { User } from "../models/User.models.js";
import { Request, Response, NextFunction } from "express";

const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    const jwtSecret = process.env.JWT_ACCESS_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_ACCESS_SECRET is not defined in environment variables");
    }

    interface DecodedToken {
      sub: string;
      tokenVersion: number;
      role: "student" | "admin";
    }

    const decoded = jwt.verify(token, jwtSecret, { algorithms: ["HS256"] }) as DecodedToken;
    const user = await User.findById(decoded.sub).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    if (user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({ message: "Not authorized, token expired" });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export { protect };
