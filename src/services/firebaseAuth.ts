// src/services/firebaseAuth.ts

import type { CreateStudentRequest, Student } from '@/types';
import {
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  UserCredential
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, collections, db } from './firebase';

// Servicio de autenticación
export class FirebaseAuthService {
  
  // Registrar nuevo usuario
  static async registerUser(userData: CreateStudentRequest & { password: string }): Promise<Student> {
    try {
      console.log('🔐 Iniciando registro de usuario:', userData.email);
      
      // Crear usuario en Firebase Auth
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      const user = userCredential.user;
      console.log('✅ Usuario creado en Firebase Auth:', user.uid);

      // Crear perfil de estudiante en Firestore
      const studentData: Omit<Student, 'id'> = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        subjects: [],
        professors: [],
        semester: userData.semester,
        gpa: 0,
        credits: 0,
        maxCredits: 9,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('📝 Guardando perfil en Firestore...');
      
      // Guardar en Firestore
      await setDoc(doc(db, collections.students, user.uid), studentData);
      console.log('✅ Perfil guardado en Firestore');

      // Actualizar perfil de Firebase Auth
      await updateProfile(user, {
        displayName: userData.name
      });
      console.log('✅ Perfil de Firebase Auth actualizado');

      // Retornar datos del estudiante
      const newStudent = {
        id: user.uid,
        ...studentData
      };
      
      console.log('🎉 Usuario registrado exitosamente:', newStudent);
      return newStudent;

    } catch (error) {
      console.error('❌ Error al registrar usuario:', error);
      
      // Manejar errores específicos de Firebase
      if (error instanceof Error) {
        if (error.message.includes('auth/email-already-in-use')) {
          throw new Error('El email ya está registrado');
        } else if (error.message.includes('auth/weak-password')) {
          throw new Error('La contraseña es muy débil');
        } else if (error.message.includes('auth/invalid-email')) {
          throw new Error('Email inválido');
        } else {
          throw new Error(`Error de autenticación: ${error.message}`);
        }
      }
      
      throw new Error('Error al registrar usuario');
    }
  }

  // Iniciar sesión
  static async loginUser(email: string, password: string): Promise<Student> {
    try {
      console.log('🔐 Iniciando sesión para:', email);
      
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      console.log('✅ Usuario autenticado en Firebase Auth:', user.uid);

      // Obtener datos del estudiante desde Firestore
      console.log('📝 Obteniendo perfil desde Firestore...');
      const studentDoc = await getDoc(doc(db, collections.students, user.uid));
      
      if (!studentDoc.exists()) {
        console.error('❌ Perfil de estudiante no encontrado en Firestore');
        throw new Error('Perfil de estudiante no encontrado. Contacta al administrador.');
      }

      const studentData = studentDoc.data();
      console.log('✅ Perfil obtenido de Firestore:', studentData);
      
      const student = {
        id: user.uid,
        ...studentData
      } as Student;
      
      console.log('🎉 Sesión iniciada exitosamente:', student);
      return student;

    } catch (error) {
      console.error('❌ Error al iniciar sesión:', error);
      
      // Manejar errores específicos de Firebase
      if (error instanceof Error) {
        if (error.message.includes('auth/user-not-found')) {
          throw new Error('Usuario no encontrado');
        } else if (error.message.includes('auth/wrong-password')) {
          throw new Error('Contraseña incorrecta');
        } else if (error.message.includes('auth/invalid-email')) {
          throw new Error('Email inválido');
        } else if (error.message.includes('auth/too-many-requests')) {
          throw new Error('Demasiados intentos fallidos. Intenta más tarde.');
        } else {
          throw new Error(`Error de autenticación: ${error.message}`);
        }
      }
      
      throw new Error('Error al iniciar sesión');
    }
  }

  // Cerrar sesión
  static async logoutUser(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw new Error('Error al cerrar sesión');
    }
  }

  // Obtener usuario actual
  static async getCurrentUser(): Promise<Student | null> {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        return null;
      }

      // Obtener datos del estudiante desde Firestore
      const studentDoc = await getDoc(doc(db, collections.students, user.uid));
      
      if (!studentDoc.exists()) {
        return null;
      }

      const studentData = studentDoc.data();
      
      return {
        id: user.uid,
        ...studentData
      } as Student;

    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  }

  // Actualizar perfil
  static async updateUserProfile(updates: Partial<Student>): Promise<void> {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      // Actualizar en Firestore
      await setDoc(doc(db, collections.students, user.uid), {
        ...updates,
        updatedAt: new Date().toISOString()
      }, { merge: true });

    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw new Error('Error al actualizar perfil');
    }
  }

  // Verificar si el usuario está autenticado
  static isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  // Obtener el ID del usuario actual
  static getCurrentUserId(): string | null {
    return auth.currentUser?.uid || null;
  }
}

// Hook para escuchar cambios de autenticación
export const onAuthStateChanged = (callback: (user: FirebaseUser | null) => void) => {
  return auth.onAuthStateChanged(callback);
};
