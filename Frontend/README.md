# Todo App Frontend (React + TypeScript + Redux Toolkit)

## Setup

```bash
cd Frontend
npm install
```

## Run

```bash
npm run dev
```

Runs at `http://localhost:5173`. In dev, API requests are proxied to `http://localhost:5000` (start the Backend first).

## Build

```bash
npm run build
```

Set `VITE_API_URL` to your API base URL (e.g. `https://your-api.com/api`) when deploying.

## Features

- **Auth:** Login, Register. JWT stored in localStorage.
- **User role:** View and update only tasks assigned to you. Create own tasks. No delete.
- **Admin role:** View all tasks (created by / assigned to). Create tasks and assign to any user. Delete any task.
- **Redux Toolkit:** `auth` and `todos` slices; typed hooks in `store/hooks.ts`.

## Routes

- `/login` – Login
- `/register` – Register
- `/` – Dashboard (protected; shows Admin dashboard or My tasks by role)
