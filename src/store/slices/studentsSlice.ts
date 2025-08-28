// src/store/slices/studentsSlice.ts

import { FirebaseStudentsService } from '@/services';
import type {
    CreateStudentRequest,
    Student,
    StudentsState,
    UpdateStudentRequest
} from '@/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
const CREDITS_PER_SUBJECT = 3;
// Estado inicial
const initialState: StudentsState = {
  students: [],
  currentStudent: null,
  isLoading: false,
  error: null,
  filters: {
    searchTerm: '',
    selectedSubject: '',
    selectedProfessor: '',
    selectedSemester: '',
  },
};

// No hay datos mock - Firebase se encarga de todo

// Thunk para obtener estudiantes
export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
      // Usar Firebase
      const students = await FirebaseStudentsService.getAllStudents();
      return students;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al obtener estudiantes');
    }
  }
);

// Thunk para crear estudiante
export const createStudent = createAsyncThunk(
  'students/createStudent',
  async (studentData: CreateStudentRequest, { rejectWithValue }) => {
    try {
      // Usar Firebase
      const newStudent = await FirebaseStudentsService.createStudent(studentData);
      return newStudent;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al crear estudiante');
    }
  }
);

// Thunk para actualizar estudiante
export const updateStudent = createAsyncThunk(
  'students/updateStudent',
  async (updateData: UpdateStudentRequest, { rejectWithValue }) => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      return updateData;
    } catch (error) {
      return rejectWithValue('Error al actualizar estudiante');
    }
  }
);

// Thunk para eliminar estudiante
export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (studentId: string, { rejectWithValue }) => {
    try {
      // Usar Firebase
      await FirebaseStudentsService.deleteStudent(studentId);
      return studentId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al eliminar estudiante');
    }
  }
);

// Thunk para seleccionar materia
export const selectSubject = createAsyncThunk(
  'students/selectSubject',
  async ({ studentId, subjectId }: { studentId: string; subjectId: string }, { rejectWithValue }) => {
    try {
      // Usar Firebase con validaciones incluidas
      await FirebaseStudentsService.selectSubject(studentId, subjectId);
      return { studentId, subjectId };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al seleccionar materia');
    }
  }
);

// Thunk para remover materia
export const removeSubject = createAsyncThunk(
  'students/removeSubject',
  async ({ studentId, subjectId }: { studentId: string; subjectId: string }, { rejectWithValue }) => {
    try {
      // Usar Firebase
      await FirebaseStudentsService.removeSubject(studentId, subjectId);
      return { studentId, subjectId };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al remover materia');
    }
  }
);

// Slice
const studentsSlice = createSlice({
  name: 'students',
  initialState: {
    ...initialState,
    students: [], // Inicializar vacío - Firebase se encarga
  },
  reducers: {
    // Reducer para establecer estudiante actual
    setCurrentStudent: (state, action: PayloadAction<Student>) => {
      state.currentStudent = action.payload;
    },
    
    // Reducer para limpiar estudiante actual
    clearCurrentStudent: (state) => {
      state.currentStudent = null;
    },
    
    // Reducer para actualizar filtros
    updateFilters: (state, action: PayloadAction<Partial<StudentsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Reducer para limpiar filtros
    clearFilters: (state) => {
      state.filters = {
        searchTerm: '',
        selectedSubject: '',
        selectedProfessor: '',
        selectedSemester: '',
      };
    },
    
    // Reducer para actualizar estudiantes desde tiempo real
    updateStudentsFromRealtime: (state, action: PayloadAction<Student[]>) => {
      state.students = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    
    // Reducer para actualizar un estudiante específico desde tiempo real
    updateStudentFromRealtime: (state, action: PayloadAction<Student>) => {
      const index = state.students.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = action.payload;
      } else {
        state.students.push(action.payload);
      }
      
      // Si es el estudiante actual, actualizarlo también
      if (state.currentStudent?.id === action.payload.id) {
        state.currentStudent = action.payload;
      }
    },
    
    // Reducer para limpiar errores
    clearError: (state) => {
      state.error = null;
    },
    
    // Reducer para resetear estado
    resetStudents: (state) => {
      state.students = [];
      state.currentStudent = null;
      state.isLoading = false;
      state.error = null;
      state.filters = {
        searchTerm: '',
        selectedSubject: '',
        selectedProfessor: '',
        selectedSemester: '',
      };
    },
  },
  extraReducers: (builder) => {
    // Obtener estudiantes
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.students = action.payload;
        state.error = null;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
    
    // Crear estudiante
    builder
      .addCase(createStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.students.push(action.payload);
        state.error = null;
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
    
    // Actualizar estudiante
    builder
      .addCase(updateStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.students.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.students[index] = { 
            ...state.students[index], 
            ...action.payload.updates, 
            updatedAt: new Date().toISOString() 
          };
        }
        if (state.currentStudent?.id === action.payload.id) {
          state.currentStudent = { ...state.currentStudent, ...action.payload.updates, updatedAt: new Date().toISOString() };
        }
        state.error = null;
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
    
    // Eliminar estudiante
    builder
      .addCase(deleteStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.students = state.students.filter(s => s.id !== action.payload);
        if (state.currentStudent?.id === action.payload) {
          state.currentStudent = null;
        }
        state.error = null;
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
    
    // Seleccionar materia
    builder
      .addCase(selectSubject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(selectSubject.fulfilled, (state, action) => {
        state.isLoading = false;
        const { studentId, subjectId } = action.payload;
        const student = state.students.find(s => s.id === studentId);
        if (student && !student.subjects.includes(subjectId)) {
          student.subjects.push(subjectId);
          student.credits += CREDITS_PER_SUBJECT;
          student.updatedAt = new Date().toISOString();
        }
        if (state.currentStudent?.id === studentId) {
          if (state.currentStudent && !state.currentStudent.subjects.includes(subjectId)) {
            state.currentStudent.subjects.push(subjectId);
            state.currentStudent.credits += CREDITS_PER_SUBJECT;
            state.currentStudent.updatedAt = new Date();
          }
        }
        state.error = null;
      })
      .addCase(selectSubject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
    
    // Remover materia
    builder
      .addCase(removeSubject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeSubject.fulfilled, (state, action) => {
        state.isLoading = false;
        const { studentId, subjectId } = action.payload;
        const student = state.students.find(s => s.id === studentId);
        if (student) {
          student.subjects = student.subjects.filter(id => id !== subjectId);
          student.credits = Math.max(0, student.credits - CREDITS_PER_SUBJECT);
          student.updatedAt = new Date().toISOString();
        }
        if (state.currentStudent?.id === studentId) {
          if (state.currentStudent) {
            state.currentStudent.subjects = state.currentStudent.subjects.filter(id => id !== subjectId);
            state.currentStudent.credits = Math.max(0, state.currentStudent.credits - CREDITS_PER_SUBJECT);
            state.currentStudent.updatedAt = new Date();
          }
        }
        state.error = null;
      })
      .addCase(removeSubject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
  },
});

// Exportar acciones
export const { 
  setCurrentStudent, 
  clearCurrentStudent, 
  updateFilters, 
  clearFilters, 
  clearError, 
  resetStudents,
  updateStudentsFromRealtime,
  updateStudentFromRealtime
} = studentsSlice.actions;

// Exportar reducer
export default studentsSlice.reducer;

// Exportar selectores
export const selectStudents = (state: { students: StudentsState }) => state.students;
export const selectAllStudents = (state: { students: StudentsState }) => state.students.students;
export const selectCurrentStudent = (state: { students: StudentsState }) => state.students.currentStudent;
export const selectStudentsLoading = (state: { students: StudentsState }) => state.students.isLoading;
export const selectStudentsError = (state: { students: StudentsState }) => state.students.error;
export const selectStudentFilters = (state: { students: StudentsState }) => state.students.filters;

// Selector para estudiantes filtrados
export const selectFilteredStudents = (state: { students: StudentsState }) => {
  const { students, filters } = state.students;
  
  return students.filter(student => {
    const matchesSearch = !filters.searchTerm || 
      student.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesSubject = !filters.selectedSubject || 
      student.subjects.includes(filters.selectedSubject);
    
    const matchesProfessor = !filters.selectedProfessor || 
      student.professors.includes(filters.selectedProfessor);
    
    const matchesSemester = !filters.selectedSemester || 
      student.semester.toString() === filters.selectedSemester;
    
    return matchesSearch && matchesSubject && matchesProfessor && matchesSemester;
  });
};
