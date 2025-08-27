// src/store/hooks.ts

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './index';

// Hooks tipados para usar en lugar de los hooks estándar de react-redux
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Hook para seleccionar estudiantes
export const useStudents = () => {
  return useAppSelector((state) => state.students);
};

// Hook para seleccionar materias
export const useSubjects = () => {
  return useAppSelector((state) => state.subjects);
};

// Hook para seleccionar profesores
export const useProfessors = () => {
  return useAppSelector((state) => state.professors);
};

// Hook para seleccionar autenticación
export const useAuth = () => {
  return useAppSelector((state) => state.auth);
};

// Hook para seleccionar estudiante actual
export const useCurrentStudent = () => {
  return useAppSelector((state) => state.students.currentStudent);
};

// Hook para seleccionar materias seleccionadas
export const useSelectedSubjects = () => {
  return useAppSelector((state) => state.subjects.selectedSubjects);
};

// Hook para seleccionar filtros de estudiantes
export const useStudentFilters = () => {
  return useAppSelector((state) => state.students.filters);
};

// Hook para seleccionar filtros de materias
export const useSubjectFilters = () => {
  return useAppSelector((state) => state.subjects.filters);
};

// Hook para verificar si está cargando
export const useIsLoading = () => {
  const studentsLoading = useAppSelector((state) => state.students.isLoading);
  const subjectsLoading = useAppSelector((state) => state.subjects.isLoading);
  const professorsLoading = useAppSelector((state) => state.professors.isLoading);
  
  return studentsLoading || subjectsLoading || professorsLoading;
};

// Hook para verificar si hay errores
export const useHasErrors = () => {
  const studentsError = useAppSelector((state) => state.students.error);
  const subjectsError = useAppSelector((state) => state.subjects.error);
  const professorsError = useAppSelector((state) => state.professors.error);
  
  return !!(studentsError || subjectsError || professorsError);
};

// Hook para obtener todos los errores
export const useAllErrors = () => {
  const studentsError = useAppSelector((state) => state.students.error);
  const subjectsError = useAppSelector((state) => state.subjects.error);
  const professorsError = useAppSelector((state) => state.professors.error);
  
  return {
    students: studentsError,
    subjects: subjectsError,
    professors: professorsError,
  };
};
