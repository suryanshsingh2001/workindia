import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { User } from "@prisma/client";

export const getSeatAvailability = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { source, destination } = req.query;

  const trains = await prisma.train.findMany({
    where: { source: source as string, destination: destination as string },
  });

  res.status(200).json(trains);
};

export const bookSeat = async (req: Request, res: Response): Promise<void> => {
  const { trainId } = req.body;
  const userId = req.user.id;

  const selectedTrain = await prisma.train.findUnique({ where: { id: trainId } });
  if (!selectedTrain || selectedTrain.availableSeats <= 0) {
    res.status(400).send("No seats available");
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    res.status(400).send("User not found");
  }

  await prisma.train.update({
    where: { id: trainId },
    data: { availableSeats: { decrement: 1 } },
  });

  const booking = await prisma.booking.create({
    data: {
      userId,
      trainId,
      seatNumber: selectedTrain.totalSeats - selectedTrain.availableSeats,
    },
  });

  res.status(201).send("Seat booked successfully");
};

export const getBookingDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  const bookingId = req.params.id;
  const userId = req.user.id;

  const booking = await prisma.booking.findFirst({
    where: { id: parseInt(bookingId), userId },
    include: { train: true },
  });

  if (!booking) {
    res.status(404).send("Booking not found");
  }

  res.status(200).json(booking);
};
