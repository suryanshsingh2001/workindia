import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const USER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6InVzZXIiLCJpYXQiOjE3MzM1MDM1MzMsImV4cCI6MTczMzUwNzEzM30.XS12zO9wFAExjJpfzuGhqBznpJc3wgithGAgQwk4ghs'; // Replace with the actual user JWT token
const TRAIN_ID = 3; // Replace with the actual train ID

const bookSeat = async () => {
    
    
    try {
        const response = await axios.post(
            `${BASE_URL}/api/user/book`,
            { trainId: TRAIN_ID },
            {
                headers: {
                    Authorization: `Bearer ${USER_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('Booking successful:', response.data);
    } catch (error : any) {
        console.error('Booking failed:', error.response ? error.response.data : error.message);
    }
};

const testConcurrentBookings = async (numRequests: number) => {
    const promises = [];

    for (let i = 0; i < numRequests; i++) {
        promises.push(bookSeat());
    }

    await Promise.all(promises);
    console.log('All requests completed');
    console.log(`Completed ${numRequests} booking requests`);
};

// Test with 10 concurrent booking requests
testConcurrentBookings(10);