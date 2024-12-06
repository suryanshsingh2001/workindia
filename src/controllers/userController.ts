import { Request, Response } from "express";
import prisma from "../utils/prisma";

export const getSeatAvailability = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { source, destination } = req.query;

    if (!source || !destination) {
      res.status(400).send("Please provide source and destination");
      return;
    }

    const trains = await prisma.train.findMany({
      where: { source: source as string, destination: destination as string },
    });

    res.status(200).send(trains);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const bookSeat = async (req: Request, res: Response): Promise<void> => {
    const { trainId } = req.body;
    const userId = req.user.id;

    if (!trainId) {
        res.status(400).send("Please provide trainId");
        return;
    }

    try {
        await prisma.$transaction(async (prisma) => {
            const train = await prisma.train.findUnique({
                where: { id: trainId },
                select: { availableSeats: true, totalSeats: true, version: true },
            });

            if (!train || train.availableSeats <= 0) {
                throw new Error("No seats available");
            }

            const updatedTrain = await prisma.train.update({
                where: {
                    id: trainId,
                    version: train.version,
                },
                data: {
                    availableSeats: { decrement: 1 },
                    version: { increment: 1 },
                },
            });

            if (!updatedTrain) {
                console.log("Failed to book seat due to concurrent update");
                throw new Error("Failed to book seat due to concurrent update");
            }

            await prisma.booking.create({
                data: {
                    userId,
                    trainId,
                    seatNumber: train.totalSeats - train.availableSeats + 1,
                },
            });
        });

        res.status(201).send("Seat booked successfully");
    } catch (error : any) {
        if (error.code === 'P2025') {
            res.status(409).send("Seat booking failed due to concurrent update. Please try again.");
        } else {
            res.status(400).send(error.message);
        }
    }
};

export const getBookingDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;

    if (!bookingId) {
      res.status(400).send("Please provide bookingId");
      return;
    }

    const booking = await prisma.booking.findFirst({
      where: { id: parseInt(bookingId), userId },
      include: { train: true },
    });

    if (!booking) {
      res.status(404).send("Booking not found");
      return;
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
