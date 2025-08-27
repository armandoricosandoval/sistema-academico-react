// src/types/firebase.ts

import type { Timestamp } from 'firebase/firestore';

// Tipos para documentos de Firestore
export interface FirestoreDocument {
  id: string;
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
  isActive: boolean;
}

// Tipos para respuestas de Firebase
export interface FirebaseResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Tipos para operaciones en lote
export interface BatchOperation<T> {
  id: string;
  operation: 'create' | 'update' | 'delete';
  data?: Partial<T>;
}

// Tipos para consultas de Firestore
export interface FirestoreQuery {
  field: string;
  operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in';
  value: any;
}

export interface FirestoreOrderBy {
  field: string;
  direction: 'asc' | 'desc';
}

// Tipos para paginación
export interface FirestorePagination {
  limit: number;
  startAfter?: any;
  endBefore?: any;
}

// Tipos para filtros
export interface FirestoreFilters {
  queries?: FirestoreQuery[];
  orderBy?: FirestoreOrderBy[];
  pagination?: FirestorePagination;
}

// Tipos para suscripciones en tiempo real
export interface FirestoreSubscription {
  unsubscribe: () => void;
  isActive: boolean;
}

// Tipos para manejo de errores de Firebase
export interface FirebaseError {
  code: string;
  message: string;
  details?: any;
}

// Tipos para validaciones de Firestore
export interface FirestoreValidation {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

// Tipos para operaciones de autenticación
export interface AuthOperation {
  type: 'login' | 'register' | 'logout' | 'password-reset' | 'email-verification';
  success: boolean;
  error?: string;
  user?: any;
}

// Tipos para sincronización de datos
export interface DataSync {
  lastSync: Date;
  isSyncing: boolean;
  syncErrors: string[];
  pendingChanges: number;
}

// Tipos para cache de Firestore
export interface FirestoreCache {
  key: string;
  data: any;
  timestamp: Date;
  ttl: number; // Time to live in milliseconds
}

// Tipos para métricas de Firestore
export interface FirestoreMetrics {
  readCount: number;
  writeCount: number;
  deleteCount: number;
  errorCount: number;
  lastOperation: Date;
}
