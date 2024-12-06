import { Request, Response } from "express";
import prisma from "../utils/prisma";

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
