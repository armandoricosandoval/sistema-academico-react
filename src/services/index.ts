// src/services/index.ts

// Exportar configuración principal de Firebase
export { app, auth, collections, db } from './firebase';

// Exportar servicios de autenticación
export { FirebaseAuthService, onAuthStateChanged } from './firebaseAuth';

// Exportar servicios de entidades
export { FirebaseProfessorsService } from './firebaseProfessors';
export { FirebaseStudentsService } from './firebaseStudents';
export { FirebaseSubjectsService } from './firebaseSubjects';

// Re-exportar tipos útiles
export type { CollectionName } from './firebase';
