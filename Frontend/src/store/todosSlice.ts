import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { todosApi } from '../api/todosApi';
import type { Todo } from '../types/todo';
import type { CreateTodoPayload, UpdateTodoPayload } from '../types/todo';

interface TodosState {
  items: Todo[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TodosState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchTodos = createAsyncThunk(
  'todos/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await todosApi.getTodos();
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const createTodo = createAsyncThunk(
  'todos/create',
  async (payload: CreateTodoPayload, { rejectWithValue }) => {
    try {
      return await todosApi.createTodo(payload);
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const updateTodo = createAsyncThunk(
  'todos/update',
  async ({ id, payload }: { id: string; payload: UpdateTodoPayload }, { rejectWithValue }) => {
    try {
      return await todosApi.updateTodo(id, payload);
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  'todos/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await todosApi.deleteTodo(id);
      return res.id;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const deleteCompleted = createAsyncThunk(
  'todos/deleteCompleted',
  async (_, { rejectWithValue }) => {
    try {
      await todosApi.deleteCompleted();
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.items = payload;
        state.error = null;
      })
      .addCase(fetchTodos.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
      })
      .addCase(createTodo.fulfilled, (state, { payload }) => {
        state.items.unshift(payload);
        state.error = null;
      })
      .addCase(createTodo.rejected, (state, { payload }) => {
        state.error = payload as string;
      })
      .addCase(updateTodo.fulfilled, (state, { payload }) => {
        const i = state.items.findIndex((t) => t._id === payload._id);
        if (i !== -1) state.items[i] = payload;
        state.error = null;
      })
      .addCase(updateTodo.rejected, (state, { payload }) => {
        state.error = payload as string;
      })
      .addCase(deleteTodo.fulfilled, (state, { payload }) => {
        state.items = state.items.filter((t) => t._id !== payload);
        state.error = null;
      })
      .addCase(deleteTodo.rejected, (state, { payload }) => {
        state.error = payload as string;
      })
      .addCase(deleteCompleted.fulfilled, (state) => {
        state.items = state.items.filter((t) => !t.completed);
        state.error = null;
      })
      .addCase(deleteCompleted.rejected, (state, { payload }) => {
        state.error = payload as string;
      });
  },
});

export const { clearError: clearTodosError } = todosSlice.actions;
export default todosSlice.reducer;
