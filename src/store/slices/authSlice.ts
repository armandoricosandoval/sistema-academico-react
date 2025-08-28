// src/store/slices/authSlice.ts

import { FirebaseAuthService } from '@/services';
import type { AuthState, CreateStudentRequest, Student } from '@/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Estado inicial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Thunk para login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Usar Firebase Auth
      const user = await FirebaseAuthService.loginUser(credentials.email, credentials.password);
      return user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al iniciar sesión');
    }
  }
);

// Thunk para registro
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: CreateStudentRequest & { password: string }, { rejectWithValue }) => {
    try {
      // Usar Firebase Auth
      const newUser = await FirebaseAuthService.registerUser(userData);
      return newUser;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al registrar usuario');
    }
  }
);

// Thunk para logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // Usar Firebase Auth
      await FirebaseAuthService.logoutUser();
      return true;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al cerrar sesión');
    }
  }
);

// Thunk para actualizar perfil
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updates: Partial<Student>, { rejectWithValue }) => {
    try {
      // Usar Firebase Auth
      await FirebaseAuthService.updateUserProfile(updates);
      return updates;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al actualizar perfil');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Reducer síncrono para limpiar errores
    clearError: (state) => {
      state.error = null;
    },
    
    // Reducer para establecer usuario (útil para persistencia)
    setUser: (state, action: PayloadAction<Student>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    
    // Reducer para resetear estado
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    
    // Reducer para actualizar usuario actual (para sincronizar con studentsSlice)
    updateUser: (state, action: PayloadAction<Student>) => {
      if (state.user && state.user.id === action.payload.id) {
        state.user = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
    
    // Registro
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
    
    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
    
    // Actualizar perfil
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user = { ...state.user, ...action.payload, updatedAt: new Date().toISOString() };
        }
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
  },
});

// Exportar acciones
export const { clearError, setUser, resetAuth, updateUser } = authSlice.actions;

// Exportar reducer
export default authSlice.reducer;

// Exportar selectores
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
