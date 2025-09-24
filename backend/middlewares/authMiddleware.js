import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // attach userId and role to request
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalid or expired" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // user is admin, allow access
  } else {
    res.status(403).json({ error: "Access denied, admin only" });
  }
};

