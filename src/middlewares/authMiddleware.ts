import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.header('x-api-key');
    if (apiKey !== process.env.ADMIN_API_KEY) return res.status(401).send('Access Denied');

    next();
};