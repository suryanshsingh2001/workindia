import { Request, Response } from "express";
import prisma from "../utils/prisma";
import bookingQueue from "../queue/bookingQueue";

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
      await bookingQueue.add({ trainId, userId });
      res.status(201).send("Booking request received");
  } catch (error : any) {
      res.status(400).send(error.message);
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
