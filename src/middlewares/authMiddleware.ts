import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyRole = (role: "user" | "admin") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      res.status(401).send("Access Denied: No Token Provided");
      return;
    }

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET as string);
      console.log(verified);
      req.user = verified;

      if (role === "admin") {
        const apiKey = req.header("x-api-key");
        if (apiKey !== process.env.ADMIN_API_KEY) {
          res.status(401).send("Access Denied: Invalid API Key");
          return;
        }
      }

      next();
    } catch (err) {
      console.log(err);
      res.status(400).send("Invalid Token");
    }
  };
};

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) {
    res.status(401).send("Access Denied");
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.header("x-api-key");
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).send("Access Denied");
    return;
  }

  if (apiKey !== process.env.ADMIN_API_KEY) {
    res.status(401).send("Access Denied");
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = verified;
    next();
  } catch (err) {
    console.log(process.env.JWT_SECRET);
    console.log(err);
    res.status(400).send("Invalid Token");
  }
};
