// src/services/firebaseSubjects.ts

import type { Subject, SubjectId } from '@/types';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    DocumentData,
    getDoc,
    getDocs,
    increment,
    onSnapshot,
    orderBy,
    query,
    QuerySnapshot,
    updateDoc,
    where,
    writeBatch
} from 'firebase/firestore';
import { collections, db } from './firebase';

// Servicio de materias en Firestore
export class FirebaseSubjectsService {
  
  // Obtener todas las materias
  static async getAllSubjects(): Promise<Subject[]> {
    try {
      const subjectsRef = collection(db, collections.subjects);
      const q = query(subjectsRef, orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const subjects: Subject[] = [];
      querySnapshot.forEach((doc) => {
        subjects.push({
          id: doc.id,
          ...doc.data()
        } as Subject);
      });
      
      return subjects;
    } catch (error) {
      console.error('Error al obtener materias:', error);
      throw new Error('Error al obtener materias');
    }
  }

  // Obtener materia por ID
  static async getSubjectById(subjectId: string): Promise<Subject | null> {
    try {
      const subjectDoc = await getDoc(doc(db, collections.subjects, subjectId));
      
      if (!subjectDoc.exists()) {
        return null;
      }
      
      return {
        id: subjectDoc.id,
        ...subjectDoc.data()
      } as Subject;
    } catch (error) {
      console.error('Error al obtener materia:', error);
      throw new Error('Error al obtener materia');
    }
  }

  // Crear nueva materia
  static async createSubject(subjectData: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>): Promise<Subject> {
    try {
      const subjectsRef = collection(db, collections.subjects);
      const newSubject = {
        ...subjectData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const docRef = await addDoc(subjectsRef, newSubject);
      
      return {
        id: docRef.id,
        ...newSubject
      };
    } catch (error) {
      console.error('Error al crear materia:', error);
      throw new Error('Error al crear materia');
    }
  }

  // Actualizar materia
  static async updateSubject(subjectId: string, updates: Partial<Subject>): Promise<void> {
    try {
      const subjectRef = doc(db, collections.subjects, subjectId);
      
      await updateDoc(subjectRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error al actualizar materia:', error);
      throw new Error('Error al actualizar materia');
    }
  }

  // Eliminar materia
  static async deleteSubject(subjectId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, collections.subjects, subjectId));
    } catch (error) {
      console.error('Error al eliminar materia:', error);
      throw new Error('Error al eliminar materia');
    }
  }

  // Obtener materias por profesor
  static async getSubjectsByProfessor(professorId: string): Promise<Subject[]> {
    try {
      const subjectsRef = collection(db, collections.subjects);
      const q = query(
        subjectsRef, 
        where('professor', '==', professorId),
        where('isActive', '==', true)
      );
      const querySnapshot = await getDocs(q);
      
      const subjects: Subject[] = [];
      querySnapshot.forEach((doc) => {
        subjects.push({
          id: doc.id,
          ...doc.data()
        } as Subject);
      });
      
      return subjects;
    } catch (error) {
      console.error('Error al obtener materias por profesor:', error);
      throw new Error('Error al obtener materias por profesor');
    }
  }

  // Obtener materias activas
  static async getActiveSubjects(): Promise<Subject[]> {
    try {
      const subjectsRef = collection(db, collections.subjects);
      const q = query(
        subjectsRef, 
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      const subjects: Subject[] = [];
      querySnapshot.forEach((doc) => {
        subjects.push({
          id: doc.id,
          ...doc.data()
        } as Subject);
      });
      
      return subjects;
    } catch (error) {
      console.error('Error al obtener materias activas:', error);
      throw new Error('Error al obtener materias activas');
    }
  }

  // Obtener materias con cupos disponibles
  static async getAvailableSubjects(): Promise<Subject[]> {
    try {
      const subjectsRef = collection(db, collections.subjects);
      const q = query(
        subjectsRef, 
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      const subjects: Subject[] = [];
      querySnapshot.forEach((doc) => {
        const subject = {
          id: doc.id,
          ...doc.data()
        } as Subject;
        
        // Filtrar solo materias con cupos disponibles
        if (subject.enrolled < subject.capacity) {
          subjects.push(subject);
        }
      });
      
      return subjects;
    } catch (error) {
      console.error('Error al obtener materias disponibles:', error);
      throw new Error('Error al obtener materias disponibles');
    }
  }

  // Inscribir estudiante en materia
  static async enrollStudent(subjectId: string): Promise<void> {
    try {
      const subjectRef = doc(db, collections.subjects, subjectId);
      const subjectDoc = await getDoc(subjectRef);
      
      if (!subjectDoc.exists()) {
        throw new Error('Materia no encontrada');
      }
      
      const subjectData = subjectDoc.data() as Subject;
      
      // Validaciones
      if (!subjectData.isActive) {
        throw new Error('La materia no está activa');
      }
      
      if (subjectData.enrolled >= subjectData.capacity) {
        throw new Error('La materia está llena');
      }
      
      // Incrementar contador de inscritos
      await updateDoc(subjectRef, {
        enrolled: increment(1),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error al inscribir estudiante:', error);
      throw error;
    }
  }

  // Retirar estudiante de materia
  static async unenrollStudent(subjectId: string): Promise<void> {
    try {
      const subjectRef = doc(db, collections.subjects, subjectId);
      const subjectDoc = await getDoc(subjectRef);
      
      if (!subjectDoc.exists()) {
        throw new Error('Materia no encontrada');
      }
      
      const subjectData = subjectDoc.data() as Subject;
      
      // Decrementar contador de inscritos
      await updateDoc(subjectRef, {
        enrolled: Math.max(0, subjectData.enrolled - 1),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error al retirar estudiante:', error);
      throw error;
    }
  }

  // Obtener materias por prerrequisitos
  static async getSubjectsByPrerequisites(prerequisites: SubjectId[]): Promise<Subject[]> {
    try {
      const subjectsRef = collection(db, collections.subjects);
      const q = query(
        subjectsRef, 
        where('prerequisites', 'array-contains-any', prerequisites),
        where('isActive', '==', true)
      );
      const querySnapshot = await getDocs(q);
      
      const subjects: Subject[] = [];
      querySnapshot.forEach((doc) => {
        subjects.push({
          id: doc.id,
          ...doc.data()
        } as Subject);
      });
      
      return subjects;
    } catch (error) {
      console.error('Error al obtener materias por prerrequisitos:', error);
      throw new Error('Error al obtener materias por prerrequisitos');
    }
  }

  // Escuchar cambios en tiempo real
  static subscribeToSubjects(callback: (subjects: Subject[]) => void) {
    const subjectsRef = collection(db, collections.subjects);
    const q = query(subjectsRef, orderBy('name', 'asc'));
    
    return onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const subjects: Subject[] = [];
      querySnapshot.forEach((doc) => {
        subjects.push({
          id: doc.id,
          ...doc.data()
        } as Subject);
      });
      
      callback(subjects);
    });
  }

  // Escuchar cambios de una materia específica
  static subscribeToSubject(subjectId: string, callback: (subject: Subject | null) => void) {
    const subjectRef = doc(db, collections.subjects, subjectId);
    
    return onSnapshot(subjectRef, (doc) => {
      if (doc.exists()) {
        callback({
          id: doc.id,
          ...doc.data()
        } as Subject);
      } else {
        callback(null);
      }
    });
  }

  // Operaciones en lote
  static async batchUpdateSubjects(updates: Array<{ id: string; updates: Partial<Subject> }>) {
    try {
      const batch = writeBatch(db);
      
      updates.forEach(({ id, updates: updateData }) => {
        const subjectRef = doc(db, collections.subjects, id);
        batch.update(subjectRef, {
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

  // Buscar materias por nombre
  static async searchSubjects(searchTerm: string): Promise<Subject[]> {
    try {
      const subjectsRef = collection(db, collections.subjects);
      const q = query(
        subjectsRef, 
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      const subjects: Subject[] = [];
      querySnapshot.forEach((doc) => {
        const subject = {
          id: doc.id,
          ...doc.data()
        } as Subject;
        
        // Filtrar por término de búsqueda
        if (subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subject.description.toLowerCase().includes(searchTerm.toLowerCase())) {
          subjects.push(subject);
        }
      });
      
      return subjects;
    } catch (error) {
      console.error('Error al buscar materias:', error);
      throw new Error('Error al buscar materias');
    }
  }
}
