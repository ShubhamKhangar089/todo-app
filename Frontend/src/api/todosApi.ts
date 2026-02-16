import { apiRequest } from './client';
import type { Todo } from '../types/todo';
import type { CreateTodoPayload, UpdateTodoPayload } from '../types/todo';

export const todosApi = {
  getTodos: () => apiRequest<Todo[]>('/todos'),

  createTodo: (payload: CreateTodoPayload) =>
    apiRequest<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateTodo: (id: string, payload: UpdateTodoPayload) =>
    apiRequest<Todo>(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  deleteTodo: (id: string) =>
    apiRequest<{ message: string; id: string }>(`/todos/${id}`, { method: 'DELETE' }),

  deleteCompleted: () =>
    apiRequest<{ message: string }>('/todos', { method: 'DELETE' }),
};
