# Auth Playground Repository

This repository contains three independent authentication-related Node.js projects:

- `fusion/` - JWT auth with refresh tokens, email OTP verification, session tracking, and Gmail OAuth2 email sending.
- `RBAC/` - Role-based access control example with protected routes for `admin`, `manager`, and `user`.
- `refresh_token/` - Simple JWT auth with refresh-token cookie flow.

## Projects

### fusion

A more advanced auth playground that supports:
- user registration
- login with access token + refresh token cookie
- refresh token rotation
- logout and logout-all sessions
- email verification via OTP
- session storage with refresh token hashing

See `fusion/README.md` for full setup, endpoints, and environment variables.

### RBAC

A role-based access control API that includes:
- user registration
- login with JWT
- protected routes for `admin`, `manager`, and `user`
- middleware for token verification and role authorization

See `RBAC/README.md` for full setup, endpoints, and environment variables.

### refresh_token

A lightweight refresh token authentication app with:
- register/login flows
- refresh token cookie support
- `/get-me` protected user info endpoint

See `refresh_token/README.md` for full setup, endpoints, and environment variables.

## Common Setup

Each project is a separate Node.js app. Use the following pattern from the project folder:

```bash
cd <project-folder>
npm install
```

Create a `.env` file in the project folder with the required variables for that project.

## Starting MongoDB with Docker

If you do not have MongoDB installed locally, start it once with Docker:

```bash
docker run -d \
  --name auth-playground-mongo \
  -p 27017:27017 \
  -v auth-playground-mongo-data:/data/db \
  mongo:latest
```

Then point each project to `mongodb://127.0.0.1:27017/<database>` in its `.env` file.

To stop and remove the MongoDB container:

```bash
docker stop auth-playground-mongo
docker rm auth-playground-mongo
```

## Running a Project

Example for a project folder:

```bash
cd fusion
npm run dev
```

Then open the app on the port listed in that project's README.

## Notes

- Each project uses its own `.env` configuration.
- Use the subproject README files for detailed environment variable names and API testing examples.
- Projects are independent and can be run separately.
