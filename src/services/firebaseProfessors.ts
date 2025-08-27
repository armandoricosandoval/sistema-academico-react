// src/services/firebaseProfessors.ts

import type { Professor } from '@/types';
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

// Servicio de profesores en Firestore
export class FirebaseProfessorsService {
  
  // Obtener todos los profesores
  static async getAllProfessors(): Promise<Professor[]> {
    try {
      const professorsRef = collection(db, collections.professors);
      const q = query(professorsRef, orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const professors: Professor[] = [];
      querySnapshot.forEach((doc) => {
        professors.push({
          id: doc.id,
          ...doc.data()
        } as Professor);
      });
      
      return professors;
    } catch (error) {
      console.error('Error al obtener profesores:', error);
      throw new Error('Error al obtener profesores');
    }
  }

  // Obtener profesor por ID
  static async getProfessorById(professorId: string): Promise<Professor | null> {
    try {
      const professorDoc = await getDoc(doc(db, collections.professors, professorId));
      
      if (!professorDoc.exists()) {
        return null;
      }
      
      return {
        id: professorDoc.id,
        ...professorDoc.data()
      } as Professor;
    } catch (error) {
      console.error('Error al obtener profesor:', error);
      throw new Error('Error al obtener profesor');
    }
  }

  // Crear nuevo profesor
  static async createProfessor(professorData: Omit<Professor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Professor> {
    try {
      const professorsRef = collection(db, collections.professors);
      const newProfessor = {
        ...professorData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const docRef = await addDoc(professorsRef, newProfessor);
      
      return {
        id: docRef.id,
        ...newProfessor
      };
    } catch (error) {
      console.error('Error al crear profesor:', error);
      throw new Error('Error al crear profesor');
    }
  }

  // Actualizar profesor
  static async updateProfessor(professorId: string, updates: Partial<Professor>): Promise<void> {
    try {
      const professorRef = doc(db, collections.professors, professorId);
      
      await updateDoc(professorRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error al actualizar profesor:', error);
      throw new Error('Error al actualizar profesor');
    }
  }

  // Eliminar profesor
  static async deleteProfessor(professorId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, collections.professors, professorId));
    } catch (error) {
      console.error('Error al eliminar profesor:', error);
      throw new Error('Error al eliminar profesor');
    }
  }

  // Obtener profesores por materia
  static async getProfessorsBySubject(subjectId: string): Promise<Professor[]> {
    try {
      const professorsRef = collection(db, collections.professors);
      const q = query(
        professorsRef, 
        where('subjects', 'array-contains', subjectId),
        where('isActive', '==', true)
      );
      const querySnapshot = await getDocs(q);
      
      const professors: Professor[] = [];
      querySnapshot.forEach((doc) => {
        professors.push({
          id: doc.id,
          ...doc.data()
        } as Professor);
      });
      
      return professors;
    } catch (error) {
      console.error('Error al obtener profesores por materia:', error);
      throw new Error('Error al obtener profesores por materia');
    }
  }

  // Obtener profesores activos
  static async getActiveProfessors(): Promise<Professor[]> {
    try {
      const professorsRef = collection(db, collections.professors);
      const q = query(
        professorsRef, 
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      const professors: Professor[] = [];
      querySnapshot.forEach((doc) => {
        professors.push({
          id: doc.id,
          ...doc.data()
        } as Professor);
      });
      
      return professors;
    } catch (error) {
      console.error('Error al obtener profesores activos:', error);
      throw new Error('Error al obtener profesores activos');
    }
  }

  // Asignar materia a profesor
  static async assignSubjectToProfessor(professorId: string, subjectId: string): Promise<void> {
    try {
      const professorRef = doc(db, collections.professors, professorId);
      const professorDoc = await getDoc(professorRef);
      
      if (!professorDoc.exists()) {
        throw new Error('Profesor no encontrado');
      }
      
      const professorData = professorDoc.data() as Professor;
      
      // Validaciones de negocio
      if (professorData.subjects.length >= 2) {
        throw new Error('El profesor ya tiene el máximo de materias permitidas');
      }
      
      if (professorData.subjects.includes(subjectId)) {
        throw new Error('El profesor ya está asignado a esta materia');
      }
      
      // Actualizar profesor
      await updateDoc(professorRef, {
        subjects: [...professorData.subjects, subjectId],
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error al asignar materia:', error);
      throw error;
    }
  }

  // Remover materia de profesor
  static async removeSubjectFromProfessor(professorId: string, subjectId: string): Promise<void> {
    try {
      const professorRef = doc(db, collections.professors, professorId);
      const professorDoc = await getDoc(professorRef);
      
      if (!professorDoc.exists()) {
        throw new Error('Profesor no encontrado');
      }
      
      const professorData = professorDoc.data() as Professor;
      
      // Actualizar profesor
      await updateDoc(professorRef, {
        subjects: professorData.subjects.filter(id => id !== subjectId),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error al remover materia:', error);
      throw error;
    }
  }

  // Obtener profesores por especialidad
  static async getProfessorsBySpecialty(specialty: string): Promise<Professor[]> {
    try {
      const professorsRef = collection(db, collections.professors);
      const q = query(
        professorsRef, 
        where('specialty', '==', specialty),
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      const professors: Professor[] = [];
      querySnapshot.forEach((doc) => {
        professors.push({
          id: doc.id,
          ...doc.data()
        } as Professor);
      });
      
      return professors;
    } catch (error) {
      console.error('Error al obtener profesores por especialidad:', error);
      throw new Error('Error al obtener profesores por especialidad');
    }
  }

  // Escuchar cambios en tiempo real
  static subscribeToProfessors(callback: (professors: Professor[]) => void) {
    const professorsRef = collection(db, collections.professors);
    const q = query(professorsRef, orderBy('name', 'asc'));
    
    return onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const professors: Professor[] = [];
      querySnapshot.forEach((doc) => {
        professors.push({
          id: doc.id,
          ...doc.data()
        } as Professor);
      });
      
      callback(professors);
    });
  }

  // Escuchar cambios de un profesor específico
  static subscribeToProfessor(professorId: string, callback: (professor: Professor | null) => void) {
    const professorRef = doc(db, collections.professors, professorId);
    
    return onSnapshot(professorRef, (doc) => {
      if (doc.exists()) {
        callback({
          id: doc.id,
          ...doc.data()
        } as Professor);
      } else {
        callback(null);
      }
    });
  }

  // Operaciones en lote
  static async batchUpdateProfessors(updates: Array<{ id: string; updates: Partial<Professor> }>) {
    try {
      const batch = writeBatch(db);
      
      updates.forEach(({ id, updates: updateData }) => {
        const professorRef = doc(db, collections.professors, id);
        batch.update(professorRef, {
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

  // Buscar profesores por nombre
  static async searchProfessors(searchTerm: string): Promise<Professor[]> {
    try {
      const professorsRef = collection(db, collections.professors);
      const q = query(
        professorsRef, 
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      const professors: Professor[] = [];
      querySnapshot.forEach((doc) => {
        const professor = {
          id: doc.id,
          ...doc.data()
        } as Professor;
        
        // Filtrar por término de búsqueda
        if (professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            professor.specialty.toLowerCase().includes(searchTerm.toLowerCase())) {
          professors.push(professor);
        }
      });
      
      return professors;
    } catch (error) {
      console.error('Error al buscar profesores:', error);
      throw new Error('Error al buscar profesores');
    }
  }

  // Validar distribución de materias
  static async validateSubjectDistribution(): Promise<{ isValid: boolean; errors: string[] }> {
    try {
      const professors = await this.getAllProfessors();
      const errors: string[] = [];
      
      // Verificar que cada profesor tenga máximo 2 materias
      professors.forEach(professor => {
        if (professor.subjects.length > 2) {
          errors.push(`El profesor ${professor.name} tiene más de 2 materias asignadas`);
        }
      });
      
      // Verificar que no haya materias sin profesor asignado
      // (Esto requeriría verificar las materias también)
      
      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      console.error('Error al validar distribución:', error);
      throw new Error('Error al validar distribución de materias');
    }
  }
}
