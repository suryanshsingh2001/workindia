import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();



/** 
 * Verifies the role of the user making the request.
 * 
 * @param role - The role to verify against.
 * @requires Authorization - The token provided in the request header.
 * @requires x-api-key - The API key provided in the request header.
 * 
 * 
 * @returns A middleware function that verifies the role of the user.
 * 
 * 
 * @remarks
 * - If no token is provided in the request header, a 401 status code is sent with an error message.
 * - If the token is invalid, a 400 status code is sent with an error message.
 * - If the role is "admin", an API key is required in the request header. If the API key is invalid, a 401 status code is sent with an error message.
 * - If the role is "user", the user is verified and the next middleware is called.
 * 
*/

export const verifyRole = (role: "user" | "admin") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      res.status(401).send("Access Denied: No Token Provided");
      return;
    }

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET as string);
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
