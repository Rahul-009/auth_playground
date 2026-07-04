# Fusion Project

A JWT-based authentication playground with refresh tokens, email OTP verification, and session tracking and refresh token rotation.

## Project Structure

- `server.js` - entry point that connects to MongoDB and starts the app.
- `src/app.js` - Express app setup and middleware registration.
- `src/config/config.js` - environment variable validation.
- `src/config/database.js` - MongoDB connection helper.
- `src/routes/auth.routes.js` - auth route definitions.
- `src/controllers/auth.controller.js` - register, login, refresh token, logout, verification logic.
- `src/models/user.model.js` - user schema.
- `src/models/session.model.js` - refresh token session tracking.
- `src/models/otp.model.js` - email OTP storage.
- `src/services/email.service.js` - Gmail OAuth2 email sender.
- `src/utils/utils.js` - OTP generation and HTML template.

## Models

### `User`

Fields:
- `username` (String, required, unique)
- `email` (String, required, unique)
- `password` (String, required)
- `verified` (Boolean, default: false)

### `Session`

Fields:
- `user` (ObjectId ref `users`, required)
- `refreshTokenHash` (String, required)
- `ip` (String, required)
- `userAgent` (String, required)
- `revoked` (Boolean, default: false)

### `OTP`

Fields:
- `email` (String, required)
- `user` (ObjectId ref `users`, required)
- `otpHash` (String, required)

## API Endpoints

Base route: `/api/auth`

### `POST /api/auth/register`

Register a new user and send an OTP email for verification.

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

Login a user and issue an access token plus an HTTP-only refresh token cookie.

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
- JSON: `{ message, user: { username, email }, accessToken }`

### `GET /api/auth/refresh-token`

Refresh the access token using the refresh token cookie.

Success response:
- Status: `200`
- Sets a new `refreshToken` cookie
- JSON: `{ message, accessToken }`

### `GET /api/auth/logout`

Revoke the current refresh token and clear the cookie.

Success response:
- Status: `200`
- JSON: `{ message: "Logged out successfully" }`

### `GET /api/auth/logout-all`

Revoke all active refresh token sessions for the current user.

Success response:
- Status: `200`
- JSON: `{ message: "Logged out from all devices successfully" }`

### `GET /api/auth/get-me`

Fetch the current user details from the access token.

Headers:
```http
Authorization: Bearer <accessToken>
```

Success response:
- Status: `200`
- JSON: `{ message, user: { username, email } }`

### `GET /api/auth/verify-email`

Verify a user email using OTP.

Request body:
```json
{
  "email": "user1@example.com",
  "otp": "123456"
}
```

Success response:
- Status: `200`
- JSON: `{ message, user: { username, email, verified } }`

## Environment Variables

Create a `.env` file with:

```dotenv
MONGO_URI=mongodb://<host>:27017/<database>
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_USER=your_gmail_address
```

## Quickstart

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up `.env` with the required environment variables.

3. Start the app:
   ```bash
   npm run dev
   ```

4. Open the app at:
   ```
   http://localhost:3000
   ```

## Start MongoDB with Docker

If MongoDB is not running locally, start it with Docker:

```bash
docker run -d \
  --name fusion-mongo \
  -p 27017:27017 \
  -v fusion-mongo-data:/data/db \
  mongo:latest
```

Then set:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/<database>
```

To stop and remove MongoDB:

```bash
docker stop fusion-mongo

docker rm fusion-mongo
```

## Testing the API

Example register request:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","email":"user1@example.com","password":"secret123"}'
```

Example login request:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user1@example.com","password":"secret123"}'
```

Example refresh request:
```bash
curl http://localhost:3000/api/auth/refresh-token \
  -b "refreshToken=<cookie>"
```

Example protected request:
```bash
curl http://localhost:3000/api/auth/get-me \
  -H "Authorization: Bearer <accessToken>"
```

