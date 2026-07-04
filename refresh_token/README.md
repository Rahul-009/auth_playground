# Refresh Token Project

A simple Express + MongoDB authentication service with JWT access tokens and refresh tokens stored in HTTP-only cookies.

## Project Structure

- `server.js` - entry point that connects to MongoDB and starts the server.
- `src/app.js` - Express app setup and middleware registration.
- `src/config/config.js` - environment configuration and validation.
- `src/config/database.js` - MongoDB connection helper.
- `src/routes/auth.routes.js` - authentication route definitions.
- `src/controllers/auth.controller.js` - auth controller logic for register, login, token refresh, and user retrieval.
- `src/models/user.model.js` - Mongoose user schema.

## Models

### `User`

Fields:
- `username` (String, required, unique)
- `email` (String, required, unique)
- `password` (String, required)
- `verified` (Boolean, default: false)

## API Endpoints

Base route: `/api/auth`

### `POST /api/auth/register`

Register a new user.

Request body:
```json
{
  "username": "user1",
  "email": "user1@example.com",
  "password": "secret123"
}
```

Success response:
- Status: `201`
- JSON: `{ message, user: { username, email, verified } }`

### `POST /api/auth/login`

Authenticate a user and receive an access token.

Request body:
```json
{
  "email": "user1@example.com",
  "password": "secret123"
}
```

Success response:
- Status: `200`
- Sets `refreshToken` cookie
- JSON: `{ message, user: { id, username, email }, accessToken }`

### `GET /api/auth/refresh-token`

Refresh the access token using the `refreshToken` cookie.

Success response:
- Status: `200`
- Sets a new `refreshToken` cookie
- JSON: `{ message, accessToken }`

### `GET /api/auth/get-me`

Get the current user from the access token.

Headers:
```http
Authorization: Bearer <accessToken>
```

Success response:
- Status: `200`
- JSON: `{ message, user: { username, email } }`

## Environment Variables

Create a `.env` file with:

```dotenv
MONGO_URI=mongodb://<host>:27017/<database>
JWT_SECRET=your_jwt_secret
```

## Quickstart

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up `.env` with `MONGO_URI` and `JWT_SECRET`.

3. Start the app locally:
   ```bash
   npm run dev
   ```

4. Open the app at:
   ```
   http://localhost:3000
   ```

## Start MongoDB with Docker

If you do not have MongoDB running locally, start it using Docker.

```bash
docker run -d \
  --name refresh-token-mongo \
  -p 27017:27017 \
  -v mongo-data:/data/db \
  mongo:latest
```

Then set `MONGO_URI` in your `.env` file:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/<database>
JWT_SECRET=your_jwt_secret
```

To stop and remove the MongoDB container:

```bash
docker stop refresh-token-mongo

docker rm refresh-token-mongo
```

## Testing the API

Use a tool like Postman or curl.

Example login request:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user1@example.com","password":"secret123"}'
```

Example protected request:
```bash
curl http://localhost:3000/api/auth/get-me \
  -H "Authorization: Bearer <accessToken>"
```
