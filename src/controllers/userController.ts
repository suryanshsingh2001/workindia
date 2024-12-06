import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getSeatAvailability = async (req: Request, res: Response) => {
    const { source, destination } = req.query;

    const trains = await prisma.train.findMany({ where: { source: source as string, destination: destination as string } });

    res.status(200).json(trains);
};

export const bookSeat = async (req: Request, res: Response) => {
    const { trainId } = req.body;
    const userId = req.user.id;

    const train = await prisma.train.findUnique({ where: { id: trainId } });
    if (!train || train.availableSeats <= 0) {
        return res.status(400).send('No seats available');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return res.status(400).send('User not found');
    }

    await prisma.train.update({
        where: { id: trainId },
        data: { availableSeats: train.availableSeats - 1 },
    });

    const booking = await prisma.booking.create({
        data: { userId, trainId, seatNumber: train.totalSeats - train.availableSeats + 1 },
    });

    res.status(201).send('Seat booked successfully');
};

export const getBookingDetails = async (req: Request, res: Response) => {
    const bookingId = req.params.id;
    const userId = req.user.id;

    const booking = await prisma.booking.findFirst({
        where: { id: parseInt(bookingId), userId },
        include: { train: true },
    });

    if (!booking) {
        return res.status(404).send('Booking not found');
    }

    res.status(200).json(booking);
};