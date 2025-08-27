// src/types/index.ts

// Tipos base para IDs
export type StudentId = string;
export type SubjectId = string;
export type ProfessorId = string;

// Enums para valores constantes
export enum Semester {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
  FOURTH = 4,
  FIFTH = 5,
  SIXTH = 6,
  SEVENTH = 7,
  EIGHTH = 8,
  NINTH = 9,
  TENTH = 10,
}

export enum CreditLimit {
  MAX_CREDITS_PER_SEMESTER = 9,
  CREDITS_PER_SUBJECT = 3,
  MAX_SUBJECTS_PER_SEMESTER = 4,
}

// Interfaces principales
export interface Student {
  id: StudentId;
  name: string;
  email: string;
  phone: string;
  subjects: SubjectId[];
  professors: ProfessorId[];
  semester: Semester;
  gpa: number;
  credits: number;
  maxCredits: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Subject {
  id: SubjectId;
  name: string;
  credits: number;
  professor: ProfessorId;
  schedule: string;
  capacity: number;
  enrolled: number;
  description: string;
  prerequisites: SubjectId[];
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Professor {
  id: ProfessorId;
  name: string;
  email: string;
  subjects: SubjectId[];
  maxSubjects: number;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Estados de Redux
export interface AuthState {
  user: Student | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface StudentsState {
  students: Student[];
  currentStudent: Student | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    searchTerm: string;
    selectedSubject: string;
    selectedProfessor: string;
    selectedSemester: string;
  };
}

export interface SubjectsState {
  subjects: Subject[];
  selectedSubjects: SubjectId[];
  isLoading: boolean;
  error: string | null;
  filters: {
    searchTerm: string;
    selectedProfessor: string;
    selectedSemester: string;
  };
}

export interface ProfessorsState {
  professors: Professor[];
  isLoading: boolean;
  error: string | null;
}

// Tipos para acciones
export interface CreateStudentRequest {
  name: string;
  email: string;
  phone: string;
  semester: Semester;
}

export interface UpdateStudentRequest {
  id: StudentId;
  updates: Partial<Omit<Student, 'id' | 'createdAt' | 'updatedAt'>>;
}

export interface SelectSubjectRequest {
  studentId: StudentId;
  subjectId: SubjectId;
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para validaciones
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string;
}

// Tipos para filtros y búsquedas
export interface StudentFilters {
  searchTerm?: string;
  subject?: SubjectId;
  professor?: ProfessorId;
  semester?: Semester;
  minGpa?: number;
  maxGpa?: number;
}

export interface SubjectFilters {
  searchTerm?: string;
  professor?: ProfessorId;
  semester?: Semester;
  hasPrerequisites?: boolean;
  isActive?: boolean;
}

// Re-exportar tipos de Firebase
export * from './firebase';
