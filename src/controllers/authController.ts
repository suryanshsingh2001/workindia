import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';

export const registerUser = async (req: Request, res: Response) => {
    const { username, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { username } });

    if (existingUser) {
        return res.status(400).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { username, password: hashedPassword, role },
    });

    res.status(201).send('User registered successfully');
};

export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
        return res.status(400).send('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).send('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.header('Authorization', token).send('Logged in successfully');
};