# Task Manager Backend (Express + Mongo)

Minimal backend for the task‑manager application.

## Requirements

- Node.js 18+ or similar
- MongoDB running locally or remotely

## Setup

1. `cd backend`
2. `npm install` to pull dependencies
3. create a `.env` file with at least:
   ```
   MONGO_URI=<your MongoDB connection string>
   JWT_SECRET=<a secret for auth tokens>
   PORT=5000  # optional
   ```

## Running

- `npm run dev` starts the server with nodemon
- `npm start` runs the compiled build

The API exposes `/auth` and `/todos` endpoints; refer to the code comments for details.

## Notes

- Authentication uses JWT.  Include `Authorization: Bearer <token>` on protected routes.
- `userId` is pulled from the token and used when querying todos.

