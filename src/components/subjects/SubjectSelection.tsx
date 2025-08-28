import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FirebaseSubjectsService } from "@/services";
import { FirebaseStudentsService } from "@/services/firebaseStudents";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchStudents, updateStudent, updateStudentFromRealtime } from "@/store/slices/studentsSlice";
import { fetchSubjects, updateSubject, updateSubjectsFromRealtime } from "@/store/slices/subjectsSlice";
import type { Professor, Student, Subject } from "@/types";
import { AlertTriangle, CheckCircle2, Clock, Loader2, RefreshCw, Users, X } from "lucide-react";
import { useEffect, useState } from "react";

export const SubjectSelection = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { subjects: subjectsFromStore, isLoading: subjectsLoading } = useAppSelector((state) => state.subjects);
  console.log('subjectsFromStore :', subjectsFromStore);
  const { professors: professorsFromStore } = useAppSelector((state) => state.professors);
  console.log('professorsFromStore  :', professorsFromStore );
  const { user: currentUser } = useAppSelector((state) => state.auth);
  console.log('currentUser :', currentUser);
  
  // Estado local para materias seleccionadas
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [student, setStudent] = useState<Student | null>(null);

  // Cargar datos cuando cambien los stores
  useEffect(() => {
    if (subjectsFromStore && subjectsFromStore.length > 0) {
      setSubjects(subjectsFromStore);
    }
    if (professorsFromStore && professorsFromStore.length > 0) {
      setProfessors(professorsFromStore);
    }
  }, [subjectsFromStore, professorsFromStore]);
  
  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    // Solo suscribirse si hay un estudiante autenticado
    if (!student?.id) return;
    
    console.log('Suscribiéndose a cambios en tiempo real para el estudiante:', student.id);
    
    // Suscribirse a cambios del estudiante
    const unsubscribeStudent = FirebaseStudentsService.subscribeToStudent(
      student.id,
      (updatedStudent) => {
        if (updatedStudent) {
          console.log('Estudiante actualizado en tiempo real:', updatedStudent);
          // Actualizar estado local
          setStudent(updatedStudent);
          setSelectedSubjects(updatedStudent.subjects || []);
          // Actualizar Redux store
          dispatch(updateStudentFromRealtime(updatedStudent));
        }
      }
    );
    
    // Suscribirse a cambios de materias
    const unsubscribeSubjects = FirebaseSubjectsService.subscribeToSubjects(
      (updatedSubjects) => {
        console.log('Materias actualizadas en tiempo real:', updatedSubjects);
        // Actualizar estado local
        setSubjects(updatedSubjects);
        // Actualizar Redux store
        dispatch(updateSubjectsFromRealtime(updatedSubjects));
      }
    );
    
    // Limpiar suscripciones al desmontar
    return () => {
      unsubscribeStudent();
      unsubscribeSubjects();
      console.log('Suscripciones en tiempo real canceladas');
    };
  }, [student?.id, dispatch]);

  // Cargar datos del estudiante cuando se autentique
  useEffect(() => {
    const loadStudentData = async () => {
      if (currentUser && currentUser.id) {
        try {
          console.log('Cargando datos del estudiante:', currentUser.id);
          
          // Intentar obtener datos del estudiante desde Firebase
          const studentData = await FirebaseStudentsService.getStudentById(currentUser.id);
          
          if (studentData) {
            console.log('Datos del estudiante cargados:', studentData);
            setStudent(studentData);
            setSelectedSubjects(studentData.subjects || []);
          } else {
            console.log('No se encontró el estudiante en Firebase, usando datos del store');
            // Si no se encuentra en Firebase, usar los datos del store
            setStudent(currentUser as unknown as Student);
            setSelectedSubjects(currentUser.subjects || []);
          }
        } catch (error) {
          console.error('Error al cargar datos del estudiante:', error);
          // En caso de error, usar los datos del store
          setStudent(currentUser as unknown as Student);
          setSelectedSubjects(currentUser.subjects || []);
        }
      }
    };

    loadStudentData();
  }, [currentUser]);

  // Función para obtener el nombre del profesor
  const getProfessorName = (professorId: string) => {
    const professor = professors.find(p => p.id === professorId);
    return professor ? professor.name : "Profesor no encontrado";
  };

  // Función para obtener el email del profesor

  const totalSelectedCredits = selectedSubjects.reduce((total, id) => {
    const subject = subjects.find(s => s.id === id);
    return total + (subject?.credits || 0);
  }, 0);

  const canSelectMore = selectedSubjects.length < 3;
  const hasDuplicateProfessor = (professorToCheck: string) => {
    return selectedSubjects.some(id => {
      const subject = subjects.find(s => s.id === id);
      return subject?.professor === professorToCheck;
    });
  };

  const toggleSubject = async (subjectId: string) => {
    if (isLoading) return;

    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;

    if (selectedSubjects.includes(subjectId)) {
      // Deseleccionar materia
      setSelectedSubjects(prev => prev.filter(id => id !== subjectId));
      
      toast({
        title: "Materia removida",
        description: `${subject.name} ha sido removida de tu selección.`
      });
    } else {
      // Verificar límites
      if (!canSelectMore) {
        toast({
          title: "Límite alcanzado",
          description: "Solo puedes seleccionar hasta 3 materias por semestre.",
          variant: "destructive"
        });
        return;
      }

      // Verificar profesor duplicado
      if (hasDuplicateProfessor(subject.professor)) {
        toast({
          title: "Profesor duplicado",
          description: `Ya tienes una materia con ${getProfessorName(subject.professor)}. No puedes tener el mismo profesor en dos materias.`,
          variant: "destructive"
        });
        return;
      }

      // Verificar límite de créditos
      if (totalSelectedCredits + subject.credits > (student?.maxCredits || 9)) {
        toast({
          title: "Límite de créditos excedido",
          description: `No puedes exceder ${student?.maxCredits || 9} créditos por semestre.`,
          variant: "destructive"
        });
        return;
      }

      // Seleccionar materia
      setSelectedSubjects(prev => [...prev, subjectId]);
      
      toast({
        title: "Materia añadida",
        description: `${subject.name} ha sido añadida a tu selección.`
      });
    }
  };

  // Función para verificar si hay cambios sin guardar
  const hasUnsavedChanges = () => {
    if (!student) return false;
    const currentSubjects = student.subjects || [];
    
    // Crear copias de los arrays antes de ordenarlos
    const sortedCurrentSubjects = [...currentSubjects].sort();
    const sortedSelectedSubjects = [...selectedSubjects].sort();
    
    return JSON.stringify(sortedCurrentSubjects) !== JSON.stringify(sortedSelectedSubjects);
  };

  // Función para refrescar datos del estudiante
  const refreshStudentData = async () => {
    if (student?.id) {
      try {
        setIsLoading(true);
        // Refrescar datos usando Redux
        await dispatch(fetchStudents());
        await dispatch(fetchSubjects());
        
        // También obtener datos actualizados directamente
        const freshData = await FirebaseStudentsService.getStudentById(student.id);
        if (freshData) {
          setStudent(freshData);
          setSelectedSubjects(freshData.subjects || []);
        }
        
        toast({
          title: "Datos actualizados",
          description: "Se han refrescado los datos correctamente.",
          variant: "default"
        });
      } catch (error) {
        console.error('Error al refrescar datos del estudiante:', error);
        toast({
          title: "Error",
          description: "No se pudieron refrescar los datos. Intenta de nuevo.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const saveSelection = async () => {
    if (isLoading) return;
    
    // Validaciones adicionales antes de guardar
    if (selectedSubjects.length === 0) {
      toast({
        title: "Sin materias seleccionadas",
        description: "Debes seleccionar al menos una materia para guardar.",
        variant: "destructive"
      });
      return;
    }

    if (totalSelectedCredits > (student?.maxCredits || 9)) {
      toast({
        title: "Límite de créditos excedido",
        description: `No puedes exceder ${student?.maxCredits || 9} créditos por semestre.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (!student || !currentUser) {
        throw new Error("No hay usuario autenticado");
      }

      console.log('Guardando selección para estudiante:', student.id);
      console.log('Materias seleccionadas:', selectedSubjects);
      console.log('Créditos totales:', totalSelectedCredits);

      // Primero, obtener el estado actual del estudiante desde Firebase
      const currentStudentData = await FirebaseStudentsService.getStudentById(student.id);
      if (!currentStudentData) {
        throw new Error("No se pudo obtener la información actual del estudiante");
      }

      // Calcular las materias que se están agregando y removiendo
      const currentSubjects = currentStudentData.subjects || [];
      const subjectsToAdd = selectedSubjects.filter(id => !currentSubjects.includes(id));
      const subjectsToRemove = currentSubjects.filter(id => !selectedSubjects.includes(id));

      console.log('Materias a agregar:', subjectsToAdd);
      console.log('Materias a remover:', subjectsToRemove);

      // Actualizar materias del estudiante usando Redux
      console.log('Actualizando estudiante con datos:', {
        id: student.id,
        subjects: selectedSubjects,
        credits: totalSelectedCredits,
        professors: selectedSubjects.map(subjectId => {
          const subject = subjects.find(s => s.id === subjectId);
          return subject ? subject.professor : '';
        }).filter(Boolean)
      });
      
      const result = await dispatch(updateStudent({
        id: student.id,
        updates: {
          subjects: selectedSubjects,
          credits: totalSelectedCredits,
          professors: selectedSubjects.map(subjectId => {
            const subject = subjects.find(s => s.id === subjectId);
            return subject ? subject.professor : '';
          }).filter(Boolean)
        }
      })).unwrap();

      console.log('Estudiante actualizado en Redux, resultado:', result);

      // Actualizar enrollment de las materias (agregar estudiantes)
      for (const subjectId of subjectsToAdd) {
        try {
          const subject = subjects.find(s => s.id === subjectId);
          if (subject) {
            console.log(`Incrementando enrollment para materia: ${subject.name}`);
            await dispatch(updateSubject({
              id: subjectId,
              updates: {
                enrolled: subject.enrolled + 1
              }
            })).unwrap();
          }
        } catch (error) {
          console.error(`Error al incrementar enrollment para ${subjectId}:`, error);
        }
      }

      // Actualizar enrollment de las materias (remover estudiantes)
      for (const subjectId of subjectsToRemove) {
        try {
          const subject = subjects.find(s => s.id === subjectId);
          if (subject) {
            console.log(`Decrementando enrollment para materia: ${subject.name}`);
            await dispatch(updateSubject({
              id: subjectId,
              updates: {
                enrolled: Math.max(0, subject.enrolled - 1)
              }
            })).unwrap();
          }
        } catch (error) {
          console.error(`Error al decrementar enrollment para ${subjectId}:`, error);
        }
      }
      
      // Refrescar los datos en Redux
      console.log('Refrescando datos en Redux...');
      await Promise.all([
        dispatch(fetchStudents()),
        dispatch(fetchSubjects())
      ]);

      // Esperar un momento para que Firebase procese los cambios
      await new Promise(resolve => setTimeout(resolve, 500));

      // Refrescar datos del estudiante desde Firebase
      await refreshStudentData();

      toast({
        title: "Selección guardada",
        description: `Se han guardado ${selectedSubjects.length} materias exitosamente.`,
        variant: "default"
      });

      console.log('Selección guardada exitosamente');

    } catch (error) {
      console.error("Error al guardar selección:", error);
      
      let errorMessage = "No se pudo guardar tu selección. Intenta de nuevo.";
      
      if (error instanceof Error) {
        if (error.message.includes('estudiante no encontrado')) {
          errorMessage = "No se pudo encontrar tu información de estudiante.";
        } else if (error.message.includes('materia no encontrada')) {
          errorMessage = "Una de las materias seleccionadas no está disponible.";
        } else if (error.message.includes('ya tienes el máximo')) {
          errorMessage = "Ya tienes el máximo de materias permitidas.";
        } else if (error.message.includes('excedes el límite')) {
          errorMessage = "Excedes el límite de créditos permitidos.";
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      toast({
        title: "Error al guardar",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailabilityColor = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 90) return "destructive";
    if (percentage >= 70) return "secondary";
    return "default";
  };

  const getAvailabilityText = (enrolled: number, capacity: number) => {
    const available = capacity - enrolled;
    return `${available} cupos disponibles`;
  };

  if (!student) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando datos del estudiante...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Selección de Materias</h1>
          <p className="text-muted-foreground mt-1">
            Elige hasta 3 materias para este semestre
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline"
            onClick={refreshStudentData}
            disabled={isLoading || subjectsLoading}
            size="sm"
          >
            {isLoading || subjectsLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refrescar
          </Button>
          <Button 
            onClick={saveSelection} 
            disabled={isLoading || selectedSubjects.length === 0 || !hasUnsavedChanges()}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Guardando...
              </>
            ) : (
              "Guardar Selección"
            )}
          </Button>
        </div>
      </div>

      {/* Summary Alert */}
      <Alert className={`border-primary/20 ${hasUnsavedChanges() ? 'bg-yellow-50 border-yellow-300' : 'bg-primary/5'}`}>
        <CheckCircle2 className={`h-4 w-4 ${hasUnsavedChanges() ? 'text-yellow-600' : ''}`} />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span>
              <strong>{selectedSubjects.length}/3</strong> materias seleccionadas • 
              <strong> {totalSelectedCredits}</strong>/{student.maxCredits} créditos totales
              {hasUnsavedChanges() && (
                <span className="ml-2 text-yellow-700 font-medium">
                  • Cambios sin guardar
                </span>
              )}
            </span>
            <div className="flex items-center space-x-2">
              {selectedSubjects.length === 3 && (
                <Badge variant="secondary">Límite alcanzado</Badge>
              )}
              {totalSelectedCredits >= student.maxCredits && (
                <Badge variant="destructive">Límite de créditos alcanzado</Badge>
              )}
              {hasUnsavedChanges() && (
                <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                  Sin guardar
                </Badge>
              )}
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Selected Subjects Summary */}
      {selectedSubjects.length > 0 && (
        <Card className="shadow-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span>Materias Seleccionadas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedSubjects.map(id => {
                const subject = subjects.find(s => s.id === id);
                if (!subject) return null;
                
                return (
                  <div key={id} className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
                    <div>
                      <h4 className="font-medium text-success">{subject.name}</h4>
                      <p className="text-sm text-muted-foreground">{subject.credits} créditos</p>
                      <p className="text-xs text-muted-foreground">{getProfessorName(subject.professor)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSubject(id)}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.filter(s => s.isActive).map((subject) => {
          const isSelected = selectedSubjects.includes(subject.id);
          const canSelect = canSelectMore || isSelected;
          const hasDuplicate = !isSelected && hasDuplicateProfessor(subject.professor);
          const availabilityVariant = getAvailabilityColor(subject.enrolled, subject.capacity);
          const wouldExceedCredits = totalSelectedCredits + subject.credits > student.maxCredits;
          
          return (
            <Card 
              key={subject.id} 
              className={`shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer ${
                isSelected 
                  ? 'ring-2 ring-success bg-success/5' 
                  : !canSelect || hasDuplicate || wouldExceedCredits
                  ? 'opacity-60' 
                  : 'hover:ring-1 hover:ring-primary/30'
              }`}
              onClick={() => (canSelect && !hasDuplicate && !wouldExceedCredits) && toggleSubject(subject.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-2 mt-1">
                      <Users className="h-3 w-3" />
                      <span>{getProfessorName(subject.professor)}</span>
                    </CardDescription>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {subject.credits} créditos
                  </Badge>
                  <Badge variant={availabilityVariant}>
                    {getAvailabilityText(subject.enrolled, subject.capacity)}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{subject.schedule}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {subject.description}
                  </p>
                  
                  {subject.prerequisites.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      <strong>Prerrequisitos:</strong> {subject.prerequisites.join(", ")}
                    </div>
                  )}
                </div>

                {hasDuplicate && (
                  <Alert variant="destructive" className="mt-3">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Ya tienes una materia con este profesor
                    </AlertDescription>
                  </Alert>
                )}

                {wouldExceedCredits && !isSelected && (
                  <Alert variant="destructive" className="mt-3">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Excedería tu límite de créditos
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  variant={isSelected ? "destructive" : "default"}
                  className="w-full"
                  disabled={!canSelect || hasDuplicate || wouldExceedCredits}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSubject(subject.id);
                  }}
                >
                  {isSelected ? "Remover" : "Seleccionar"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};