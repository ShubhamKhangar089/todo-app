import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import type { AuthState, User, LoginPayload, RegisterPayload } from '../types/auth';

const token = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

const initialState: AuthState = {
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
  token,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await authApi.login(payload);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      return res;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const res = await authApi.register(payload);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      return res;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const fetchMe = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authApi.me();
      return { user: { id: user.id, name: user.name, email: user.email, role: user.role as User['role'] } };
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.token = payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.token = payload.token;
        state.error = null;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
      })
      .addCase(fetchMe.fulfilled, (state, { payload }) => {
        state.user = payload.user;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
