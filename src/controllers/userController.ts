import { Request, Response } from "express";
import prisma from "../utils/prisma";
import bookingQueue from "../queue/bookingQueue";

/**
 * Retrieves all trains available in the database based on the source and destination provided.
 *
 * @param req - The request object containing the source and destination in the query.
 * @param res -  The response object used to send the list of trains or an error message.
 * @requires soruce - The source station to search for trains from.
 * @requires destination - The destination station to search for trains to.
 * @returns A promise that resolves to void.
 *
 * @remarks
 * - If the source or destination is not provided in the query, a 400 status code is sent with an error message.
 *  - If no trains are found for the given source and destination, a 404 status code is sent with an error message.
 * - If the trains are found successfully, a 200 status code is sent with the list of trains.
 *
 
 */
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

/**
 * Books a seat on a train for the authenticated user. The booking is added to a queue for processing.
 *
 * @param req - The request object containing the train ID in the body and user ID in the user object.
 * @param res -  The response object used to send the booking status or an error message.
 * @requires trainId - The train ID to book a seat for.
 * @returns A promise that resolves to void.
 *
 * @remarks
 * - If the train ID is not provided in the request body, a 400 status code is sent with an error message.
 * - If the booking request is added to the queue successfully, a 201 status code is sent with a success message.
 * - If an internal server error occurs, a 400 status code is sent with an error message.
 *
 
 */
export const bookSeat = async (req: Request, res: Response): Promise<void> => {
  const { trainId } = req.body;
  const userId = req.user.id;

  if (!trainId) {
    res.status(400).send("Please provide trainId");
    return;
  }

  try {
    const train = await prisma.train.findUnique({
      where: { id: trainId },
      select: { availableSeats: true },
    });

    if (!train || train.availableSeats <= 0) {
      res.status(400).send("No seats available");
      return;
    }


    await bookingQueue.add({ trainId, userId });
    res.status(201).send("Booking request received");
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};
/**
 * Retrieves booking details for a specific booking ID and user.
 *
 * @param req - The request object containing the booking ID in the parameters and user ID in the user object.
 * @param res - The response object used to send the booking details or an error message.
 * @requires id - The booking ID to retrieve the details for.
 * @returns A promise that resolves to void.
 *
 * @remarks
 * - If the booking ID is not provided in the request parameters, a 400 status code is sent with an error message.
 * - If no booking is found for the given booking ID and user ID, a 404 status code is sent with an error message.
 * - If an internal server error occurs, a 500 status code is sent with an error message.
 *
 
 */
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
