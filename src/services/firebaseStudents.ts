// src/services/firebaseStudents.ts

import type { CreateStudentRequest, Student, UpdateStudentRequest } from '@/types';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    DocumentData,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    QuerySnapshot,
    updateDoc,
    where,
    writeBatch
} from 'firebase/firestore';
import { collections, db } from './firebase';

// Servicio de estudiantes en Firestore
export class FirebaseStudentsService {
  
  // Obtener todos los estudiantes
  static async getAllStudents(): Promise<Student[]> {
    try {
      const studentsRef = collection(db, collections.students);
      const q = query(studentsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const students: Student[] = [];
      querySnapshot.forEach((doc) => {
        students.push({
          id: doc.id,
          ...doc.data()
        } as Student);
      });
      
      return students;
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);
      throw new Error('Error al obtener estudiantes');
    }
  }

  // Obtener estudiante por ID
  static async getStudentById(studentId: string): Promise<Student | null> {
    try {
      const studentDoc = await getDoc(doc(db, collections.students, studentId));
      
      if (!studentDoc.exists()) {
        return null;
      }
      
      return {
        id: studentDoc.id,
        ...studentDoc.data()
      } as Student;
    } catch (error) {
      console.error('Error al obtener estudiante:', error);
      throw new Error('Error al obtener estudiante');
    }
  }

  // Crear nuevo estudiante
  static async createStudent(studentData: CreateStudentRequest): Promise<Student> {
    try {
      const studentsRef = collection(db, collections.students);
      const newStudent = {
        ...studentData,
        phone: '',
        subjects: [],
        professors: [],
        gpa: 0,
        credits: 0,
        maxCredits: 9,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const docRef = await addDoc(studentsRef, newStudent);
      
      return {
        id: docRef.id,
        ...newStudent
      };
    } catch (error) {
      console.error('Error al crear estudiante:', error);
      throw new Error('Error al crear estudiante');
    }
  }

  // Actualizar estudiante
  static async updateStudent(updateData: UpdateStudentRequest): Promise<void> {
    try {
      const { id, updates } = updateData;
      const studentRef = doc(db, collections.students, id);
      
      await updateDoc(studentRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error al actualizar estudiante:', error);
      throw new Error('Error al actualizar estudiante');
    }
  }

  // Eliminar estudiante
  static async deleteStudent(studentId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, collections.students, studentId));
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
      throw new Error('Error al eliminar estudiante');
    }
  }

  // Obtener estudiantes por materia
  static async getStudentsBySubject(subjectId: string): Promise<Student[]> {
    try {
      const studentsRef = collection(db, collections.students);
      const q = query(studentsRef, where('subjects', 'array-contains', subjectId));
      const querySnapshot = await getDocs(q);
      
      const students: Student[] = [];
      querySnapshot.forEach((doc) => {
        students.push({
          id: doc.id,
          ...doc.data()
        } as Student);
      });
      
      return students;
    } catch (error) {
      console.error('Error al obtener estudiantes por materia:', error);
      throw new Error('Error al obtener estudiantes por materia');
    }
  }

  // Obtener estudiantes por profesor
  static async getStudentsByProfessor(professorId: string): Promise<Student[]> {
    try {
      const studentsRef = collection(db, collections.students);
      const q = query(studentsRef, where('professors', 'array-contains', professorId));
      const querySnapshot = await getDocs(q);
      
      const students: Student[] = [];
      querySnapshot.forEach((doc) => {
        students.push({
          id: doc.id,
          ...doc.data()
        } as Student);
      });
      
      return students;
    } catch (error) {
      console.error('Error al obtener estudiantes por profesor:', error);
      throw new Error('Error al obtener estudiantes por profesor');
    }
  }

  // Seleccionar materia para estudiante
  static async selectSubject(studentId: string, subjectId: string): Promise<void> {
    try {
      const studentRef = doc(db, collections.students, studentId);
      const studentDoc = await getDoc(studentRef);
      
      if (!studentDoc.exists()) {
        throw new Error('Estudiante no encontrado');
      }
      
      const studentData = studentDoc.data() as Student;
      
      // Validaciones de negocio
      if (studentData.subjects.length >= 3) {
        throw new Error('Ya tienes el máximo de materias permitidas');
      }
      
      if (studentData.credits + 3 > 9) {
        throw new Error('Excedes el límite de créditos permitidos');
      }
      
      // Actualizar estudiante
      await updateDoc(studentRef, {
        subjects: [...studentData.subjects, subjectId],
        credits: studentData.credits + 3,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error al seleccionar materia:', error);
      throw error;
    }
  }

  // Remover materia de estudiante
  static async removeSubject(studentId: string, subjectId: string): Promise<void> {
    try {
      const studentRef = doc(db, collections.students, studentId);
      const studentDoc = await getDoc(studentRef);
      
      if (!studentDoc.exists()) {
        throw new Error('Estudiante no encontrado');
      }
      
      const studentData = studentDoc.data() as Student;
      
      // Actualizar estudiante
      await updateDoc(studentRef, {
        subjects: studentData.subjects.filter(id => id !== subjectId),
        credits: Math.max(0, studentData.credits - 3),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error al remover materia:', error);
      throw error;
    }
  }

  // Escuchar cambios en tiempo real
  static subscribeToStudents(callback: (students: Student[]) => void) {
    const studentsRef = collection(db, collections.students);
    const q = query(studentsRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const students: Student[] = [];
      querySnapshot.forEach((doc) => {
        students.push({
          id: doc.id,
          ...doc.data()
        } as Student);
      });
      
      callback(students);
    });
  }

  // Escuchar cambios de un estudiante específico
  static subscribeToStudent(studentId: string, callback: (student: Student | null) => void) {
    const studentRef = doc(db, collections.students, studentId);
    
    return onSnapshot(studentRef, (doc) => {
      if (doc.exists()) {
        callback({
          id: doc.id,
          ...doc.data()
        } as Student);
      } else {
        callback(null);
      }
    });
  }

  // Operaciones en lote
  static async batchUpdateStudents(updates: Array<{ id: string; updates: Partial<Student> }>) {
    try {
      const batch = writeBatch(db);
      
      updates.forEach(({ id, updates: updateData }) => {
        const studentRef = doc(db, collections.students, id);
        batch.update(studentRef, {
          ...updateData,
          updatedAt: new Date().toISOString()
        });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error en actualización en lote:', error);
      throw new Error('Error en actualización en lote');
    }
  }
}
