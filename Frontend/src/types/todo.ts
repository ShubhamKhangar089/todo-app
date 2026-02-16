export interface TodoUser {
  _id: string;
  name: string;
  email: string;
}

export interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  createdBy: TodoUser;
  assignedTo: TodoUser;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoPayload {
  title: string;
  assignedTo?: string; // user id, admin only
}

export interface UpdateTodoPayload {
  title?: string;
  completed?: boolean;
}
