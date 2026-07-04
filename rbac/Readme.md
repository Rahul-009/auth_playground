# RBAC Project

A simple role-based access control API built with Express, MongoDB, and JWT.

## Project Structure

- `src/index.js` - application entry point and route mounting.
- `src/config/dbconnect.js` - MongoDB connection helper.
- `src/routes/authRoutes.js` - authentication route definitions.
- `src/routes/userRoutes.js` - protected role-based routes.
- `src/controllers/authController.js` - register and login controller logic.
- `src/middlewares/authMiddleware.js` - JWT verification middleware.
- `src/middlewares/roleMiddleware.js` - role authorization middleware.
- `src/models/userModel.js` - Mongoose user schema.

## Models

### `User`

Fields:
- `username` (String, required)
- `password` (String, required)
- `role` (String, enum: `user`, `manager`, `admin`, default: `user`)
- `createdAt` / `updatedAt` (timestamps)

## API Endpoints

### `POST /api/auth/register`

Register a new user.

Request body:
```json
{
  "username": "alice",
  "password": "secret123",
  "role": "user"
}
```

Success response:
- Status: `201`
- JSON: `{ message: "User registered successfully" }`

### `POST /api/auth/login`

Login and receive a JWT token.

Request body:
```json
{
  "username": "alice",
  "password": "secret123"
}
```

Success response:
- Status: `200`
- JSON: `{ message: "Login successful", token }`

### `GET /api/users/admin`

Access for `admin` only.

Headers:
```http
Authorization: Bearer <token>
```

Success response:
- Status: `200`
- JSON: `{ message: "Welcome to the admin page!" }`

### `GET /api/users/manager`

Access for `admin` and `manager`.

Headers:
```http
Authorization: Bearer <token>
```

Success response:
- Status: `200`
- JSON: `{ message: "Welcome to the manager page!" }`

### `GET /api/users/user`

Access for `admin`, `manager`, and `user`.

Headers:
```http
Authorization: Bearer <token>
```

Success response:
- Status: `200`
- JSON: `{ message: "Welcome to the user page!" }`

## Environment Variables

Create a `.env` file with:

```dotenv
CONNECTION_STRING=mongodb://<host>:27017/<database>
JWT_SECRET=your_jwt_secret
PORT=7002
```

## Quickstart

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up `.env` with `CONNECTION_STRING` and `JWT_SECRET`.

3. Start the app:
   ```bash
   npm run dev
   ```

4. Open the app at:
   ```
   http://localhost:7002
   ```

## Start MongoDB with Docker

If MongoDB is not running locally, start it with Docker:

```bash
docker run -d \
  --name rbac-mongo \
  -p 27017:27017 \
  -v rbac-mongo-data:/data/db \
  mongo:latest
```

Then use the connection string:

```dotenv
CONNECTION_STRING=mongodb://127.0.0.1:27017/<database>
```

To stop and remove the MongoDB container:

```bash
docker stop rbac-mongo

docker rm rbac-mongo
```

## Testing the API

Example register request:
```bash
curl -X POST http://localhost:7002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"secret123","role":"admin"}'
```

Example login request:
```bash
curl -X POST http://localhost:7002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"secret123"}'
```

Example protected request:
```bash
curl http://localhost:7002/api/users/admin \
  -H "Authorization: Bearer <token>"
```
