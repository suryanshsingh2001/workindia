import Queue from "bull";
import prisma from "../utils/prisma";

const bookingQueue = new Queue("bookingQueue");

/**
 * Booking queue process function to book a seat on a train.
 *
 * @async
 * @function
 * @param {number} trainId - The unique identifier of the train to be updated.
 * @param {object} train - The current train object containing its version.
 * @returns {Promise<object>} The updated train record from the database.
 * @throws {Error} If the update operation fails.
 */
bookingQueue.process(async (job) => {
  const { trainId, userId } = job.data;

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
      console.log(`Booking failed for user ${userId}`);
      throw new Error("Failed to book seat due to concurrent update");
    }

    await prisma.booking.create({
      data: {
        userId,
        trainId,
        seatNumber: train.totalSeats - train.availableSeats + 1,
      },
    });

    console.log(`Booking successful for user ${userId}`);
  });
});

export default bookingQueue;
