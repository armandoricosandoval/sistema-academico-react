// src/store/index.ts

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
    FLUSH,
    PAUSE,
    PERSIST,
    persistReducer,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Importar reducers
import authReducer from "./slices/authSlice";
import professorsReducer from "./slices/professorsSlice";
import studentsReducer from "./slices/studentsSlice";
import subjectsReducer from "./slices/subjectsSlice";

// Configuración de persistencia
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "students", "subjects"], // Solo persistir estos estados
  blacklist: ["professors"], // No persistir este estado
};

// Reducer raíz
const rootReducer = combineReducers({
  auth: authReducer,
  students: studentsReducer,
  subjects: subjectsReducer,
  professors: professorsReducer,
});

// Reducer persistido
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuración del store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar acciones de Redux Persist para evitar warnings
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignorar campos específicos que no son serializables
        ignoredPaths: ["professors.items"],
      },
      // Middleware personalizado para logging en desarrollo
      ...(process.env.NODE_ENV === "development" && {
        logger: {
          log: (message: string) => console.log("Redux:", message),
          warn: (message: string) => console.warn("Redux Warning:", message),
          error: (message: string) => console.error("Redux Error:", message),
        },
      }),
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Persistor para persistencia
export const persistor = persistStore(store);

// Tipos para TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hooks personalizados para usar en componentes
export type AppState = ReturnType<typeof store.getState>;

// Función para resetear el store (útil para logout)
export const resetStore = () => {
  persistor.purge();
  store.dispatch({ type: "RESET_STORE" });
};

// Función para obtener el estado inicial
export const getInitialState = (): Partial<RootState> => ({});
