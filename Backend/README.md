# Todo App Backend (Node.js + Express + Mongoose)

## Role-based access

| Role  | Create task        | Assign task to   | View tasks     | Update                    | Delete   |
|-------|--------------------|------------------|----------------|---------------------------|----------|
| User  | Own only           | Self only        | Own tasks      | Only tasks assigned to me | No access |
| Admin | Any                | Any user         | All tasks      | Any task                  | Any task |

- **User**: Minimal access. Can create tasks for themselves, view and update only tasks assigned to them. **User cannot delete any task (including their own).**
- **Admin**: Full access. Can create tasks and assign to any user, view all tasks with full details (createdBy, assignedTo), update and delete any task.

## Create first admin

From `Backend` folder:

```bash
# Optional: set in .env
# ADMIN_EMAIL=admin@example.com
# ADMIN_PASSWORD=yourpassword

node scripts/seedAdmin.js
```

Default seed: `admin@todo.app` / `admin123`. Change in production.

## API

- `POST /api/auth/register` – Register (creates user role only).
- `POST /api/auth/login` – Login (returns `user` + `token`).
- `GET /api/auth/me` – Current user (header: `Authorization: Bearer <token>`).

- `GET /api/users` – List users (Admin only; for assign dropdown).
- `GET /api/todos` – List todos (user: own; admin: all with details).
- `POST /api/todos` – Create todo. Body: `{ title, assignedTo? }`. Admin can set `assignedTo` (user id).
- `PATCH /api/todos/:id` – Update todo.
- `DELETE /api/todos/:id` – Delete todo (Admin only).
- `DELETE /api/todos` – Delete all completed (Admin only).

All todo and user-list routes require `Authorization: Bearer <token>`.
