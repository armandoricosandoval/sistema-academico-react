// src/store/slices/professorsSlice.ts

import { FirebaseProfessorsService } from '@/services';
import type {
  Professor,
  ProfessorId,
  ProfessorsState,
  SubjectId
} from '@/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Estado inicial
const initialState: ProfessorsState = {
  professors: [],
  isLoading: false,
  error: null,
};

// No hay datos mock - Firebase se encarga de todo

// Thunk para obtener profesores
export const fetchProfessors = createAsyncThunk(
  'professors/fetchProfessors',
  async (_, { rejectWithValue }) => {
    try {
      // Usar Firebase
      const professors = await FirebaseProfessorsService.getAllProfessors();
      return professors;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al obtener profesores');
    }
  }
);

// Thunk para crear profesor
export const createProfessor = createAsyncThunk(
  'professors/createProfessor',
  async (professorData: Omit<Professor, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validar que no exceda el límite de materias
      if (professorData.subjects.length > professorData.maxSubjects) {
        return rejectWithValue(`El profesor no puede dictar más de ${professorData.maxSubjects} materias`);
      }
      
      const newProfessor: Professor = {
        id: Date.now().toString(),
        ...professorData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return newProfessor;
    } catch (error) {
      return rejectWithValue('Error al crear profesor');
    }
  }
);

// Thunk para actualizar profesor
export const updateProfessor = createAsyncThunk(
  'professors/updateProfessor',
  async ({ id, updates }: { id: ProfessorId; updates: Partial<Professor> }, { rejectWithValue }) => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validar límite de materias si se están actualizando
      if (updates.subjects && updates.subjects.length > 2) {
        return rejectWithValue('Cada profesor solo puede dictar máximo 2 materias');
      }
      
      return { id, updates };
    } catch (error) {
      return rejectWithValue('Error al actualizar profesor');
    }
  }
);

// Thunk para eliminar profesor
export const deleteProfessor = createAsyncThunk(
  'professors/deleteProfessor',
  async (professorId: ProfessorId, { rejectWithValue, getState }) => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validar que no tenga estudiantes inscritos
      const state = getState() as { students: { students: { professors: ProfessorId[] }[] } };
      const hasEnrolledStudents = state.students.students.some((student: { professors: ProfessorId[] }) => 
        Array.isArray(student.professors) && student.professors.includes(professorId)
      );
      if (hasEnrolledStudents) {
        return rejectWithValue('No se puede eliminar un profesor con estudiantes inscritos');
      }
      
      return professorId;
    } catch (error) {
      return rejectWithValue('Error al eliminar profesor');
    }
  }
);

// Thunk para asignar materia a profesor
export const assignSubjectToProfessor = createAsyncThunk(
  'professors/assignSubjectToProfessor',
  async ({ professorId, subjectId }: { professorId: ProfessorId; subjectId: SubjectId }, { rejectWithValue, getState }) => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Validaciones de negocio
      const state = getState() as { professors: ProfessorsState };
      const professor = state.professors.professors.find(p => p.id === professorId);
      
      if (!professor) {
        return rejectWithValue('Profesor no encontrado');
      }
      
      if (!professor.isActive) {
        return rejectWithValue('El profesor no está activo');
      }
      
      if (professor.subjects.length >= professor.maxSubjects) {
        return rejectWithValue('El profesor ya tiene el máximo de materias permitidas');
      }
      
      if (professor.subjects.includes(subjectId)) {
        return rejectWithValue('El profesor ya está asignado a esta materia');
      }
      
      return { professorId, subjectId };
    } catch (error) {
      return rejectWithValue('Error al asignar materia');
    }
  }
);

// Thunk para remover materia de profesor
export const removeSubjectFromProfessor = createAsyncThunk(
  'professors/removeSubjectFromProfessor',
  async ({ professorId, subjectId }: { professorId: ProfessorId; subjectId: SubjectId }, { rejectWithValue, getState }) => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Validar que no haya estudiantes inscritos en esa materia
      const state = getState() as { students: { students: Array<{ subjects: SubjectId[]; professors: ProfessorId[] }> } };
      const hasEnrolledStudents = state.students.students.some((student: { subjects: SubjectId[]; professors: ProfessorId[] }) => 
        student.subjects.includes(subjectId) && student.professors.includes(professorId)
      );
      if (hasEnrolledStudents) {
        return rejectWithValue('No se puede remover la materia porque hay estudiantes inscritos');
      }
      
      return { professorId, subjectId };
    } catch (error) {
      return rejectWithValue('Error al remover materia');
    }
  }
);

// Slice
const professorsSlice = createSlice({
  name: 'professors',
  initialState: {
    ...initialState,
    professors: [], // Inicializar vacío - Firebase se encarga
  },
  reducers: {
    // Reducer para limpiar errores
    clearError: (state) => {
      state.error = null;
    },
    
    // Reducer para resetear estado
    resetProfessors: (state) => {
      state.professors = [];
      state.isLoading = false;
      state.error = null;
    },
    
    // Reducer para validar distribución de materias
    validateSubjectDistribution: (state) => {
      const invalidProfessors = state.professors.filter(p => 
        p.isActive && p.subjects.length !== 2
      );
      
      if (invalidProfessors.length > 0) {
        state.error = 'Algunos profesores no tienen exactamente 2 materias asignadas';
      }
    },
    
    // Reducer para actualizar profesores desde tiempo real
    updateProfessorsFromRealtime: (state, action: PayloadAction<Professor[]>) => {
      state.professors = action.payload;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Obtener profesores
    builder
      .addCase(fetchProfessors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfessors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.professors = action.payload;
        state.error = null;
      })
      .addCase(fetchProfessors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
    
    // Crear profesor
    builder
      .addCase(createProfessor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProfessor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.professors.push(action.payload);
        state.error = null;
      })
      .addCase(createProfessor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
    
    // Actualizar profesor
    builder
      .addCase(updateProfessor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfessor.fulfilled, (state, action) => {
        state.isLoading = false;
        const { id, updates } = action.payload;
        const index = state.professors.findIndex(p => p.id === id);
        if (index !== -1) {
          state.professors[index] = { 
            ...state.professors[index], 
            ...updates, 
            updatedAt: new Date().toISOString() 
          };
        }
        state.error = null;
      })
      .addCase(updateProfessor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
    
    // Eliminar profesor
    builder
      .addCase(deleteProfessor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProfessor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.professors = state.professors.filter(p => p.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteProfessor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
    
    // Asignar materia
    builder
      .addCase(assignSubjectToProfessor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(assignSubjectToProfessor.fulfilled, (state, action) => {
        state.isLoading = false;
        const { professorId, subjectId } = action.payload;
        const professor = state.professors.find(p => p.id === professorId);
        if (professor && !professor.subjects.includes(subjectId)) {
          professor.subjects.push(subjectId);
          professor.updatedAt = new Date().toISOString();
        }
        state.error = null;
      })
      .addCase(assignSubjectToProfessor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
    
    // Remover materia
    builder
      .addCase(removeSubjectFromProfessor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeSubjectFromProfessor.fulfilled, (state, action) => {
        state.isLoading = false;
        const { professorId, subjectId } = action.payload;
        const professor = state.professors.find(p => p.id === professorId);
        if (professor) {
          professor.subjects = professor.subjects.filter(id => id !== subjectId);
          professor.updatedAt = new Date().toISOString();
        }
        state.error = null;
      })
      .addCase(removeSubjectFromProfessor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
  },
});

// Exportar acciones
export const { 
  clearError, 
  resetProfessors, 
  validateSubjectDistribution,
  updateProfessorsFromRealtime
} = professorsSlice.actions;

// Exportar reducer
export default professorsSlice.reducer;

// Exportar selectores
export const selectProfessors = (state: { professors: ProfessorsState }) => state.professors;
export const selectAllProfessors = (state: { professors: ProfessorsState }) => state.professors.professors;
export const selectProfessorsLoading = (state: { professors: ProfessorsState }) => state.professors.isLoading;
export const selectProfessorsError = (state: { professors: ProfessorsState }) => state.professors.error;

// Selector para profesores activos
export const selectActiveProfessors = (state: { professors: ProfessorsState }) => {
  const { professors } = state.professors;
  return professors.filter(professor => professor.isActive);
};

// Selector para profesores con materias completas
export const selectProfessorsWithFullLoad = (state: { professors: ProfessorsState }) => {
  const { professors } = state.professors;
  return professors.filter(professor => 
    professor.isActive && professor.subjects.length >= professor.maxSubjects
  );
};

// Selector para profesores disponibles para nuevas materias
export const selectAvailableProfessors = (state: { professors: ProfessorsState }) => {
  const { professors } = state.professors;
  return professors.filter(professor => 
    professor.isActive && professor.subjects.length < professor.maxSubjects
  );
};

// Selector para verificar distribución correcta de materias
export const selectIsSubjectDistributionValid = (state: { professors: ProfessorsState }) => {
  const { professors } = state.professors;
  return professors.every(professor => 
    !professor.isActive || professor.subjects.length === 2
  );
};

// Selector para obtener materias de un profesor
export const selectProfessorSubjects = (professorId: ProfessorId) => (state: { professors: ProfessorsState }) => {
  const { professors } = state.professors;
  const professor = professors.find(p => p.id === professorId);
  return professor ? professor.subjects : [];
};

// Selector para verificar si un profesor puede dictar más materias
export const selectCanProfessorTakeMoreSubjects = (professorId: ProfessorId) => (state: { professors: ProfessorsState }) => {
  const { professors } = state.professors;
  const professor = professors.find(p => p.id === professorId);
  return professor ? professor.isActive && professor.subjects.length < professor.maxSubjects : false;
};
