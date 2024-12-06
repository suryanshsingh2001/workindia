import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";
import { User } from "@prisma/client";

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

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).send("Please provide all the details");
            return;
        }

        const user = (await prisma.user.findUnique({ where: { username } })) as User;

        if (!user) {
            res.status(400).send("Invalid credentials");
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
