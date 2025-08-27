// src/services/firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCK-dwW2ISCrgmf0jnO6ARUNczMMuuRB3c",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "interrapidisimoprueba.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "interrapidisimoprueba",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "interrapidisimoprueba.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "709086552686",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:709086552686:web:9e361084368af8d722bc7f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-50WRJPVZRG"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configuración simple de Firestore
console.log('🔥 Firebase configurado correctamente');
console.log('📊 Proyecto:', firebaseConfig.projectId);
console.log('🔐 Auth Domain:', firebaseConfig.authDomain);

// Configuración para desarrollo vs producción
if (process.env.NODE_ENV === 'development') {
  console.log('🚀 Modo desarrollo: usando Firebase real');
} else {
  console.log('🏭 Modo producción: usando Firebase real');
}

// Exportar la app para uso en otros lugares si es necesario
export { app };

// Configuración de Firestore
export const firestoreConfig = {
  // Configuraciones específicas de Firestore
  experimentalForceLongPolling: true, // Para mejor compatibilidad
  useFetchStreams: false,
};

// Colecciones de Firestore
export const collections = {
  students: 'students',
  subjects: 'subjects',
  professors: 'professors',
  users: 'users',
  enrollments: 'enrollments',
} as const;

// Tipos para las colecciones
export type CollectionName = typeof collections[keyof typeof collections];
