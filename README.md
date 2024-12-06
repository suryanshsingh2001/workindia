# API Documentation

## Authentication

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

---

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
