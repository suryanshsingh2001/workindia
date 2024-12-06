# SDE API Round - IRCTC

IRCTC is a simple ticketing system for Indian Railways. It allows users to view trains based on source and destination, check availability, book seats, and view booking details. Admins can add new trains to the system.

## Table of Contents

- [Task Overview](#task-overview)
    - [Functional Requirements](#functional-requirements)
    - [Non-Functional Requirements](#non-functional-requirements)
- [Tech Stack Used](#tech-stack-used)
    - [Handling Race Conditions and Scalability](#handling-race-conditions-and-scalability)
- [Assumptions](#assumptions)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
    - [Authentication](#authentication)
        - [Register User](#register-user)
        - [Login User](#login-user)
    - [User](#user)
        - [Get Seat Availability](#get-seat-availability)
        - [Book Seat](#book-seat)
        - [Get Booking Details](#get-booking-details)
    - [Admin](#admin)
        - [Add Train](#add-train)
- [Folder Structure](#folder-structure)
- [Database Schema](#database-schema)
    - [User Table](#user-table)
    - [Train Table](#train-table)
    - [Booking Table](#booking-table)
    - [Relationships](#relationships)



## Task Overview

### Functional Requirements

- [x] User/Admin can register and login.
- [x] User can view all trains available based on source and destination.
- [x] User can check availability on a train.
- [x] User can book a seat on a train.
- [x] User can view booking details.
- [x] Admin can add a new train to the system.

### Non-Functional Requirements

- [x] Secure authentication using JWT.
- [x] Efficient database operations with Prisma ORM.
- [x] Concurrent booking requests using a queue.
- [x] Clear and concise API documentation.
- [x] Environment configuration using `.env` file.
- [x] Consistent error handling and status codes.


## Tech Stack Used

- **Backend Framework**: Express.js/Node.js/TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Queue**: Bull.js
- **API Testing**: Postman


### Handling Race Conditions and Scalability

To ensure data consistency and prevent race conditions during concurrent booking requests, the following strategies were implemented:

- **Database Transactions**: Ensured atomicity by wrapping critical operations in transactions.
- **Queue System**: Utilized Bull.js to manage and process concurrent booking requests in a sequential manner.
- **Optimistic Locking**: Implemented an optimistic locking mechanism to prevent race conditions when updating the available seats for a train. This involves checking the current version of the train record before applying updates.


**Note** You can test the scenario by running `npm run test`.After supplying the required inputs in `src/test/testConcurrentBookings.ts` you can see the output in the console.

## Assumptions

- User and admin roles are predefined and static.
- No partial bookings; requests are fully processed or rejected.
- JWT tokens are securely stored and managed by the client.
- Admin API key is securely managed and protected from unauthorized access.
- Source and destination locations are predefined and static.

## Setup Instructions

1. In the root directory, create a `.env` file and add the following environment variables:

```sh
PORT=3000
JWT_SECRET=secret
ADMIN_API_KEY=12345-ABCDE-67890-FGHIJ
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<databaseName>?schema=public"
```

> Note that DATABASE_URL should be the connection string for your PostgreSQL database. Replace the `username`, `password`, and `database name` with your own values. Feel free to change `API key` and `JWT secret` as well.

2. Install the dependencies:

```sh
npm install
```

3. Run the migrations to create the database schema:

```sh
npm run migrate
```

4. Run the start script to start the server:

```sh
npm start
```

The server should now be running on `http://localhost:3000`. You would get this message in the console:

```sh
Database connection is healthy
Server is running on port 3000
```

5. You can now test the API endpoints using a tool like Postman or cURL.


---

## API Documentation

### Authentication

### Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Registers a new user by hashing the password and storing the user in the database.

**Sample Request:**

```json
{
  "username": "john_doe",
  "password": "password123",
  "role": "user"
}
```

**Sample Response:**

```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "role": "user"
  }
}
```

**Curl Request:**

```sh
curl -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
    "username": "john_doe",
    "password": "password123",
    "role": "user"
}'
```

### Login User

**Endpoint:** `POST /api/auth/login`

**Description:** Logs in a user by verifying the password and generating a JWT token for authentication preset in header of the response.

**Sample Request:**

```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Sample Response:**

```json
{
  "message": "Login successful"
}
```

Header `Authorization`:

```json
Bearer <JWT Token>
```

**Curl Request:**

```sh
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
    "username": "john_doe",
    "password": "password123"
}'
```

 

## User

**Note**: All user endpoints require a valid JWT token in the `Authorization` header. The token is generated during the login process. Make sure to replace `<JWT_TOKEN>` with the actual token.

### Get Seat Availability

**Endpoint:** `GET /api/user/availability`

**Description:** Retrieves all trains available in the database based on the source and destination provided.

**Parameters:**

- `source (string)`: Source location
- `destination (string)`: Destination location

**Curl Request:**

```sh
curl -X GET "http://localhost:3000/api/user/availability?source=NYC&destination=LA" \
-H "Authorization: Bearer <JWT_TOKEN>"
```

**Sample Response:**

```json
[
  {
    "id": 1,
    "name": "Express Train",
    "source": "NYC",
    "destination": "LA",
    "totalSeats": 100,
    "availableSeats": 50
  }
]
```

### Book Seat

**Endpoint:** `POST /api/user/book`

**Description:** Books a seat on a train for the authenticated user. The booking is added to a queue for processing. If the booking is successful, the available seats for the train are updated and the booking is created.

**Sample Request:**

```json
{
  "trainId": 1
}
```

**Sample Response:**

```json
{
  "message": "Booking request received"
}
```

**Curl Request:**

```sh
curl -X POST http://localhost:3000/api/user/book \
-H "Authorization: Bearer <JWT_TOKEN>" \
-H "Content-Type: application/json" \
-d '{
    "trainId": 1
}'
```

### Get Booking Details

**Endpoint:** `GET /api/user/booking/:id`

**Description:** Retrieves booking details for a specific booking ID and user.

**Sample Request:**

```sh
curl -X GET http://localhost:3000/api/user/booking/1 \
-H "Authorization: Bearer <JWT_TOKEN>"
```

**Sample Response:**

```json
{
  "id": 1,
  "userId": 1,
  "trainId": 1,
  "seatNumber": 10,
  "train": {
    "id": 1,
    "name": "Express Train",
    "source": "NYC",
    "destination": "LA",
    "totalSeats": 100,
    "availableSeats": 90
  }
}
```

## Admin

### Add Train

**Endpoint:** `POST /api/admin/train`

**Description:** Adds a new train to the database.

**Request Headers:**

- `x-api-key (string)`: Admin API key
- `Authorization (string)`: Bearer JWT token

**Sample Request:**

```json
{
  "name": "Express Train",
  "source": "NYC",
  "destination": "LA",
  "totalSeats": 100
}
```

**Sample Response:**

```json
{
  "message": "Train added successfully",
  "train": {
    "id": 1,
    "name": "Express Train",
    "source": "NYC",
    "destination": "LA",
    "totalSeats": 100,
    "availableSeats": 100
  }
}
```

**Curl Request:**

```sh
curl -X POST http://localhost:3000/api/admin/train \
-H "Authorization: Bearer <JWT_TOKEN>" \
-H "x-api-key: <ADMIN_API_KEY>" \
-H "Content-Type: application/json" \
-d '{
    "name": "Express Train",
    "source": "NYC",
    "destination": "LA",
    "totalSeats": 100
}'
```

--- 

## Folder Structure
```
/src
    /controllers
        - authController.ts
        - userController.ts
        - adminController.ts
    /middlewares
        - authMiddleware.ts
        - errorMiddleware.ts
    /queue
        - bookingQueue.ts
    /routes
        - authRoutes.ts
        - userRoutes.ts
        - adminRoutes.ts
    - app.ts
    - server.ts
/prisma
    - schema.prisma
- 
```
--- 

## Database Schema

### User Table

| Column   | Type   | Constraints          |
|----------|--------|----------------------|
| id       | Int    | Primary Key, Auto Increment |
| username | String | Unique               |
| password | String |                      |
| role     | String |                      |

### Train Table

| Column         | Type   | Constraints          |
|----------------|--------|----------------------|
| id             | Int    | Primary Key, Auto Increment |
| name           | String |                      |
| source         | String |                      |
| destination    | String |                      |
| totalSeats     | Int    |                      |
| availableSeats | Int    |                      |
| version        | Int    | Default: 0           |

### Booking Table

| Column     | Type   | Constraints          |
|------------|--------|----------------------|
| id         | Int    | Primary Key, Auto Increment |
| userId     | Int    | Foreign Key (User)   |
| trainId    | Int    | Foreign Key (Train)  |
| seatNumber | Int    |                      |

### Relationships

- A `User` can have multiple `Bookings`.
- A `Train` can have multiple `Bookings`.
- Each `Booking` is associated with one `User` and one `Train`. 



---



## About Me

- **Name**: Suryansh Singh
- **Email**: tashusingh2001@gmail.com
- **LinkedIn**: [Suryansh Singh](https://www.linkedin.com/in/suryanshsingh2001/)
- **GitHub**: [Suryansh Singh](https://www.github.com/suryansh2001)
- **Portfolio**: [Suryansh Singh](https://www.surydev.site)


---

Thank you for reading!  🚀
