import axios from "axios";

/* 
Add your Train ID and User Token here
*/
const BASE_URL = "http://localhost:3000";
const TRAIN_ID = null;
const USER_TOKEN = null;
const NUM_REQUESTS = 10;

/**
 * Function to book a seat
 
 * */
const bookSeat = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/user/book`,
      { trainId: TRAIN_ID },
      {
        headers: {
          Authorization: `Bearer ${USER_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Booking successful:", response.data);
  } catch (error: any) {
    console.error(
      "Booking failed:",
      error.response ? error.response.data : error.message
    );
  }
};

/** 
Function to test concurrent booking requests

@param numRequests: number of concurrent booking requests to test

@remarks 
This function sends multiple concurrent booking requests to the server. To run this, run `npm run test` after adding your Train ID and User Token in the constants above.
*/
const testConcurrentBookings = async (numRequests: number) => {
  if (!TRAIN_ID || !USER_TOKEN) {
    throw new Error(
        "Please add your Train ID and User Token in the constants in the file: src/test/testConcurrentBookings.ts"
        );
  
  }
  const promises = [];

  for (let i = 0; i < numRequests; i++) {
    promises.push(bookSeat());
  }

  await Promise.all(promises);
  console.log("All requests completed");
  console.log(`Completed ${numRequests} booking requests`);
};

// Test with 10 concurrent booking requests
testConcurrentBookings(NUM_REQUESTS);
