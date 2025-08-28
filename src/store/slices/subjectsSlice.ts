// src/store/slices/subjectsSlice.ts

import { FirebaseSubjectsService } from '@/services';
import type {
  ProfessorId,
  Student,
  Subject,
  SubjectId,
  SubjectsState
} from '@/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Estado inicial
const initialState: SubjectsState = {
  subjects: [],
  selectedSubjects: [],
  isLoading: false,
  error: null,
  filters: {
    searchTerm: '',
    selectedProfessor: '',
    selectedSemester: '',
  },
};

// No hay datos mock - Firebase se encarga de todo

// Thunk para obtener materias
export const fetchSubjects = createAsyncThunk(
  'subjects/fetchSubjects',
  async (_, { rejectWithValue }) => {
    try {
      // Usar Firebase
      const subjects = await FirebaseSubjectsService.getAllSubjects();
      return subjects;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al obtener materias');
    }
  }
);

// Thunk para crear materia
export const createSubject = createAsyncThunk(
  'subjects/createSubject',
  async (subjectData: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      // Usar Firebase con validaciones incluidas
      const newSubject = await FirebaseSubjectsService.createSubject(subjectData);
      return newSubject;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al crear materia');
    }
  }
);

// Thunk para actualizar materia
export const updateSubject = createAsyncThunk(
  'subjects/updateSubject',
  async ({ id, updates }: { id: SubjectId; updates: Partial<Subject> }, { rejectWithValue }) => {
    try {
      const CREDITS_PER_SUBJECT = 3;
      // Validar créditos si se están actualizando
      if (updates.credits && updates.credits !== CREDITS_PER_SUBJECT) {
        return rejectWithValue('Cada materia debe tener exactamente 3 créditos');
      }
      
      // Usar Firebase para actualizar la materia
      await FirebaseSubjectsService.updateSubject(id, updates);
      
      // Obtener la materia actualizada para asegurar que tenemos los datos más recientes
      const updatedSubject = await FirebaseSubjectsService.getSubjectById(id);
      if (!updatedSubject) {
        return { id, updates };
      }
      
      return { id, updates: updatedSubject };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al actualizar materia');
    }
  }
);

// Thunk para eliminar materia
export const deleteSubject = createAsyncThunk(
  'subjects/deleteSubject',
  async (subjectId: SubjectId, { rejectWithValue, getState }) => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validar que no haya estudiantes inscritos
      interface Student {
        id: string;
        name: string;
        subjects: string[];
        // Agrega aquí otras propiedades si es necesario
      }
      const state = getState() as { students: { students: Student[] } };
      const hasEnrolledStudents = state.students.students.some((student: Student) => 
        student.subjects.includes(subjectId)
      );
      if (hasEnrolledStudents) {
        return rejectWithValue('No se puede eliminar una materia con estudiantes inscritos');
      }
      
      return subjectId;
    } catch (error) {
      return rejectWithValue('Error al eliminar materia');
    }
  }
);

// Thunk para inscribir estudiante en materia
export const enrollStudentInSubject = createAsyncThunk(
  'subjects/enrollStudentInSubject',
  async ({ subjectId, studentId }: { subjectId: SubjectId; studentId: string }, { rejectWithValue, getState }) => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Validaciones de negocio
      const state = getState() as { subjects: SubjectsState };
      const subject = state.subjects.subjects.find(s => s.id === subjectId);
      
      if (!subject) {
        return rejectWithValue('Materia no encontrada');
      }
      
      if (!subject.isActive) {
        return rejectWithValue('La materia no está activa');
      }
      
      if (subject.enrolled >= subject.capacity) {
        return rejectWithValue('La materia está llena');
      }
      
      return { subjectId, studentId };
    } catch (error) {
      return rejectWithValue('Error al inscribir estudiante');
    }
  }
);

// Thunk para retirar estudiante de materia
export const unenrollStudentFromSubject = createAsyncThunk(
  'subjects/unenrollStudentFromSubject',
  async ({ subjectId, studentId }: { subjectId: SubjectId; studentId: string }, { rejectWithValue }) => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      return { subjectId, studentId };
    } catch (error) {
      return rejectWithValue('Error al retirar estudiante');
    }
  }
);

// Slice
const subjectsSlice = createSlice({
  name: 'subjects',
  initialState: {
    ...initialState,
    subjects: [], // Inicializar vacío - Firebase se encarga
  },
  reducers: {
    // Reducer para actualizar materias seleccionadas
    setSelectedSubjects: (state, action: PayloadAction<SubjectId[]>) => {
      state.selectedSubjects = action.payload;
    },
    
    // Reducer para agregar materia seleccionada
    addSelectedSubject: (state, action: PayloadAction<SubjectId>) => {
      if (!state.selectedSubjects.includes(action.payload)) {
        state.selectedSubjects.push(action.payload);
      }
    },
    
    // Reducer para remover materia seleccionada
    removeSelectedSubject: (state, action: PayloadAction<SubjectId>) => {
      state.selectedSubjects = state.selectedSubjects.filter(id => id !== action.payload);
    },
    
    // Reducer para limpiar materias seleccionadas
    clearSelectedSubjects: (state) => {
      state.selectedSubjects = [];
    },
    
    // Reducer para actualizar filtros
    updateFilters: (state, action: PayloadAction<Partial<SubjectsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Reducer para limpiar filtros
    clearFilters: (state) => {
      state.filters = {
        searchTerm: '',
        selectedProfessor: '',
        selectedSemester: '',
      };
    },
    
    // Reducer para actualizar materias desde tiempo real
    updateSubjectsFromRealtime: (state, action: PayloadAction<Subject[]>) => {
      state.subjects = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    
    // Reducer para limpiar errores
    clearError: (state) => {
      state.error = null;
    },
    
    // Reducer para resetear estado
    resetSubjects: (state) => {
      state.subjects = [];
      state.selectedSubjects = [];
      state.isLoading = false;
      state.error = null;
      state.filters = {
        searchTerm: '',
        selectedProfessor: '',
        selectedSemester: '',
      };
    },
  },
  extraReducers: (builder) => {
    // Obtener materias
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subjects = action.payload;
        state.error = null;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
    
    // Crear materia
    builder
      .addCase(createSubject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subjects.push(action.payload);
        state.error = null;
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
    
    // Actualizar materia
    builder
      .addCase(updateSubject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        state.isLoading = false;
        const { id, updates } = action.payload;
        const index = state.subjects.findIndex(s => s.id === id);
        if (index !== -1) {
                  state.subjects[index] = { 
          ...state.subjects[index], 
          ...updates, 
          updatedAt: new Date().toISOString() 
        };
        }
        state.error = null;
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
    
    // Eliminar materia
    builder
      .addCase(deleteSubject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subjects = state.subjects.filter(s => s.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
    
    // Inscribir estudiante
    builder
      .addCase(enrollStudentInSubject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(enrollStudentInSubject.fulfilled, (state, action) => {
        state.isLoading = false;
        const { subjectId } = action.payload;
        const subject = state.subjects.find(s => s.id === subjectId);
        if (subject) {
          subject.enrolled += 1;
          subject.updatedAt = new Date().toISOString();
        }
        state.error = null;
      })
      .addCase(enrollStudentInSubject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
    
    // Retirar estudiante
    builder
      .addCase(unenrollStudentFromSubject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unenrollStudentFromSubject.fulfilled, (state, action) => {
        state.isLoading = false;
        const { subjectId } = action.payload;
        const subject = state.subjects.find(s => s.id === subjectId);
        if (subject) {
          subject.enrolled = Math.max(0, subject.enrolled - 1);
          subject.updatedAt = new Date().toISOString();
        }
        state.error = null;
      })
      .addCase(unenrollStudentFromSubject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
  },
});

// Exportar acciones
export const { 
  setSelectedSubjects, 
  addSelectedSubject, 
  removeSelectedSubject, 
  clearSelectedSubjects,
  updateFilters, 
  clearFilters, 
  clearError, 
  resetSubjects,
  updateSubjectsFromRealtime
} = subjectsSlice.actions;

// Exportar reducer
export default subjectsSlice.reducer;

// Exportar selectores
export const selectSubjects = (state: { subjects: SubjectsState }) => state.subjects;
export const selectAllSubjects = (state: { subjects: SubjectsState }) => state.subjects.subjects;
export const selectSelectedSubjects = (state: { subjects: SubjectsState }) => state.subjects.selectedSubjects;
export const selectSubjectsLoading = (state: { subjects: SubjectsState }) => state.subjects.isLoading;
export const selectSubjectsError = (state: { subjects: SubjectsState }) => state.subjects.error;
export const selectSubjectFilters = (state: { subjects: SubjectsState }) => state.subjects.filters;

// Selector para materias filtradas
export const selectFilteredSubjects = (state: { subjects: SubjectsState }) => {
  const { subjects, filters } = state.subjects;
  
  return subjects.filter(subject => {
    const matchesSearch = !filters.searchTerm || 
      subject.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      subject.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesProfessor = !filters.selectedProfessor || 
      subject.professor === filters.selectedProfessor;
    
    const matchesSemester = !filters.selectedSemester || 
      subject.schedule.includes(filters.selectedSemester);
    
    return matchesSearch && matchesProfessor && matchesSemester && subject.isActive;
  });
};

// Selector para materias disponibles (con cupos)
export const selectAvailableSubjects = (state: { subjects: SubjectsState }) => {
  const { subjects } = state.subjects;
  return subjects.filter(subject => 
    subject.isActive && subject.enrolled < subject.capacity
  );
};

// Selector para materias por profesor
export const selectSubjectsByProfessor = (professorId: ProfessorId) => (state: { subjects: SubjectsState }) => {
  const { subjects } = state.subjects;
  return subjects.filter(subject => 
    subject.professor === professorId && subject.isActive
  );
};

// Selector para verificar si un estudiante puede inscribirse en una materia
export const selectCanEnrollInSubject = (subjectId: SubjectId, studentId: string) => (state: { 
  subjects: SubjectsState; 
  students: { students: Student[] } 
}) => {
  const subject = state.subjects.subjects.find(s => s.id === subjectId);
  const student = state.students.students.find(s => s.id === studentId);
  
  if (!subject || !student) return false;
  
  // Verificar si la materia está activa y tiene cupos
  if (!subject.isActive || subject.enrolled >= subject.capacity) return false;
  
  // Verificar si el estudiante ya está inscrito
  if (student.subjects.includes(subjectId)) return false;
  
  // Verificar límite de materias
  if (student.subjects.length >= 3) return false;
  
  // Verificar límite de créditos
  if (student.credits + 3 > 9) return false;
  
  return true;
};
