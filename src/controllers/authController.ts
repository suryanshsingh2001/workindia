import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";
import { User } from "@prisma/client";

/**
 * Registers a new user by hashing the password and storing the user in the database.
 *
 * @description This function registers a new user by hashing the password and storing the user in the database.
 * @param req - The request object containing the username and password in the body.
 * @param res - The response object used to send back the appropriate response.
 * @returns A promise that resolves to void.
 *
 * @remarks
 * - If the username, password, or role is missing, a 400 status code with an error message is sent.
 * - If the user already exists, a 400 status code with an error message is sent.
 * - If the user is created successfully, a 200 status code with a success message and the user details is sent.
 * - In case of any server error, a 500 status code with an error message is sent.
 */
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      res.status(400).send("Please provide all the details");
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });

    if (existingUser) {
      res.status(400).send("User already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, password: hashedPassword, role },
    });

    res.status(200).send({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

/**
 * Logs in a user by validating their credentials and generating a JWT token.
 *
 * @description This function logs in a user by validating their credentials and generating a JWT token. The username and password are extracted from the request body. If either of them is missing, a 400 status code with an error message is sent. If the user is not found or the password is invalid, a 400 status code with an error message is sent. If the credentials are valid, a JWT token is generated using the user's ID and role, and sent in the response header with a success message. In case of any server error, a 500 status code with an error message is sent.
 * @param req - The request object containing the username and password in the body.
 * @param res - The response object used to send back the appropriate response.
 * @returns A promise that resolves to void.
 * 
 *
 * @remarks
 * - If the username or password is missing, a 400 status code with an error message is sent.
 * - If the user is not found or the password is invalid, a 400 status code with an error message is sent.
 * - If the credentials are valid, a JWT token is generated and sent in the response header with a success message.
 * - In case of any server error, a 500 status code with an error message is sent.
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).send("Please provide all the details");
      return;
    }

    const user = (await prisma.user.findUnique({
      where: { username },
    })) as User;

    if (!user) {
      res.status(400).send("User not found");
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(400).send("Invalid credentials");
      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    res.header("Authorization", token).send("Logged in successfully");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};
