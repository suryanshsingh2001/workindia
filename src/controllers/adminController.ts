import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const addTrain = async (req: Request, res: Response) => {
    const { name, source, destination, totalSeats } = req.body;

    const train = await prisma.train.create({
        data: { name, source, destination, totalSeats, availableSeats: totalSeats },
    });

    res.status(201).send('Train added successfully');
};