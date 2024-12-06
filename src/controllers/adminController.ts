import { Request, Response } from "express";
import prisma from "../utils/prisma";

/**
 * Adds a new train to the database.
 *
 * @param req - The request object containing the train details in the body.
 * @param res - The response object used to send the response.
 * @requires name - The name of the train.
 * @requires source - The source station of the train.
 * @requires destination - The destination station of the train.
 * @requires totalSeats - The total number of seats available on the train.
 * 
 * @returns A promise that resolves to void.
 *
 * @remarks
 * The request body must contain the following properties:
 * - `name`: The name of the train.
 * - `source`: The source station of the train.
 * - `destination`: The destination station of the train.
 * - `totalSeats`: The total number of seats available on the train.
 *
 * If any of these properties are missing, a 400 status code is returned with an error message.
 * If the train is added successfully, a 201 status code is returned with a success message and the train details.
 * If there is an internal server error, a 500 status code is returned with an error message.
 */
export const addTrain = async (req: Request, res: Response): Promise<void> => {
  const { name, source, destination, totalSeats } = req.body;

  if (!name || !source || !destination || !totalSeats) {
    res.status(400).send("Please provide all the details");
    return;
  }

  try {
    const train = await prisma.train.create({
      data: {
        name,
        source,
        destination,
        totalSeats,
        availableSeats: totalSeats,
      },
    });

    res.status(201).send({ message: "Train added successfully", train });
  } catch (error) {
    res.status(500).send({ message: "Internal Server", error });
  }
};
