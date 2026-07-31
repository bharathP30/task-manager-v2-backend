# Task Manager v2 — Backend

The API server for Task Manager v2 — Node.js/Express with MongoDB, serving a React frontend.

**Live API:** https://task-manager-v2-backend-zuim.onrender.com
**Frontend repo:** [task-manager-v2-frontend](https://github.com/bharathP30/task-manager-v2-frontend)

> Hosted on Render's free tier — the first request after ~15 minutes of inactivity will be slow (~30–50s) while the instance spins back up. This is expected, not a bug.

## Tech stack

- **Node.js / Express 5**
- **MongoDB** via **Mongoose**
- **JWT** (`jsonwebtoken`) for authentication
- **bcrypt** for password hashing
- **dotenv** for environment config, **cors** for cross-origin access, **nodemon** for local dev auto-restart

## Getting started

```bash
git clone https://github.com/bharathP30/task-manager-v2-backend.git
cd task-manager-v2-backend
npm install
```

Create a `.env` file in the project root:

```
MONGODB_URL=mongodb://localhost:27017/task_Manager
JWT_SECRET_KEY=some-long-random-string
PORT=3000
```

`MONGODB_URL` can point at a local MongoDB instance or an Atlas connection string — just make sure it includes a database name (e.g. `.../task_Manager`), or MongoDB will silently default to a database called `test`. `PORT` is optional and defaults to `3000`.

```bash
npm start
```

## API reference

All request/response bodies are JSON. Routes under `/api/todos` require an `Authorization: Bearer <token>` header.

### Auth — `/api/auth`

| Method | Route | Body | Notes |
|---|---|---|---|
| `POST` | `/signup` | `{ name, email, password, rememberMe }` | Returns `{ message, user, token }`. `409` if the email is already registered. |
| `POST` | `/login` | `{ email, password, rememberMe }` | Returns `{ message, user, token }`. Returns a generic `401` for both "no such user" and "wrong password," by design — this avoids leaking which emails are registered. |

`rememberMe: true` issues a 30-day token; otherwise the token expires in 7 days.

### Todos — `/api/todos` (all require auth)

| Method | Route | Body / Query | Notes |
|---|---|---|---|
| `GET` | `/` | — | All todos for the authenticated user, newest first. |
| `GET` | `/filter` | Query: `category`, `priority`, `completed`, `search` | All params optional and combinable. `search` matches task text, case-insensitive. |
| `GET` | `/:id` | — | A single todo by id. |
| `POST` | `/` | `{ taskContent, category?, priority?, dueDate? }` | `taskContent` is required. |
| `PATCH` | `/:id` | Any subset of `{ taskContent, category, priority, dueDate, completed }` | Only these fields are writable — other fields in the body are ignored. |
| `DELETE` | `/:id` | — | Returns a confirmation message, not the deleted document. |

Every todo route is scoped to the authenticated user — there's no way to read, edit, or delete another user's data through this API.

## Data models

**User** — `name`, `email` (unique), `password` (bcrypt-hashed before save), `refreshToken` (reserved, not currently used).

**Todo** — `taskContent` (required), `category` (default `"others"`), `priority` (default `"low"`), `dueDate`, `completed`, `userId` (owner reference). Timestamps enabled on both models.

## Security notes

- Passwords are hashed with bcrypt before storage; nothing password-related is ever logged.
- Query filters are explicitly type-cast before being used in database lookups, to prevent parameter-injection style query manipulation.
- Update requests use an explicit field whitelist rather than trusting the full request body, so a client can't write to fields it shouldn't have access to.

## Known limitations

- CORS currently allows a hardcoded list of origins (`localhost` + the production frontend URL) rather than matching a pattern — Vercel preview/branch deployment URLs aren't covered by default.
- No rate limiting on login/signup yet.