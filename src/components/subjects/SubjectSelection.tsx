import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProfessors } from "@/store/slices/professorsSlice";
import { enrollStudentInSubject, fetchSubjects, unenrollStudentFromSubject } from "@/store/slices/subjectsSlice";
import { Subject } from "@/types";
import { AlertTriangle, CheckCircle2, Clock, Loader2, Users, X } from "lucide-react";
import { useEffect, useState } from "react";

export const SubjectSelection = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  
  // Estados de Redux
  const { subjects, isLoading: subjectsLoading } = useAppSelector(state => state.subjects);
  const { professors, isLoading: professorsLoading } = useAppSelector(state => state.professors);
  const { user } = useAppSelector(state => state.auth);
  
  // Estado local para materias seleccionadas
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Constantes de validación
  const MAX_SUBJECTS = 3;
  const MAX_CREDITS = 15;

  // Cargar datos al montar el componente
  useEffect(() => {
    if (subjects.length === 0) {
      dispatch(fetchSubjects());
    }
    if (professors.length === 0) {
      dispatch(fetchProfessors());
    }
  }, [dispatch, subjects.length, professors.length]);

  // Sincronizar con el usuario actual
  useEffect(() => {
    if (user && user.subjects) {
      setSelectedSubjects(user.subjects);
    }
  }, [user]);

  // Calcular créditos totales
  const totalSelectedCredits = selectedSubjects.reduce((total, subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return total + (subject?.credits || 0);
  }, 0);

  // Validaciones mejoradas
  const canSelectMore = selectedSubjects.length < MAX_SUBJECTS;
  
  const hasDuplicateProfessor = (professorId: string) => {
    return selectedSubjects.some(subjectId => {
      const subject = subjects.find(s => s.id === subjectId);
      return subject?.professor === professorId;
    });
  };

  // Obtener nombre del profesor
  const getProfessorName = (professorId: string) => {
    const professor = professors.find(p => p.id === professorId);
    return professor?.name || 'Profesor no asignado';
  };

  // Obtener color de disponibilidad
  const getAvailabilityColor = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 90) return "destructive";
    if (percentage >= 70) return "secondary";
    return "default";
  };

  // Obtener texto de disponibilidad
  const getAvailabilityText = (enrolled: number, capacity: number) => {
    const available = capacity - enrolled;
    return `${available} cupos disponibles`;
  };

  // Validar si se puede seleccionar una materia
  const canSelectSubject = (subject: Subject) => {
    if (selectedSubjects.includes(subject.id)) return true; // Ya seleccionada
    if (!canSelectMore) return false; // Límite de materias alcanzado
    
    const newTotalCredits = totalSelectedCredits + subject.credits;
    if (newTotalCredits > MAX_CREDITS) return false; // Límite de créditos excedido
    
    if (hasDuplicateProfessor(subject.professor)) return false; // Profesor duplicado
    
    return true;
  };

  // Manejar selección/deselección de materias
  const toggleSubject = async (subjectId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para seleccionar materias",
        variant: "destructive"
      });
      return;
    }

    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;

    if (selectedSubjects.includes(subjectId)) {
      // Deseleccionar materia
      try {
        setIsUpdating(true);
        await dispatch(unenrollStudentFromSubject({ subjectId, studentId: user.id })).unwrap();
        
        setSelectedSubjects(prev => prev.filter(id => id !== subjectId));
        toast({
          title: "Materia removida",
          description: `${subject.name} ha sido removida de tu selección.`
        });
      } catch (error) {
        toast({
          title: "Error",
          description: `Error al remover materia: ${error instanceof Error ? error.message : 'Error desconocido'}`,
          variant: "destructive"
        });
      } finally {
        setIsUpdating(false);
      }
    } else {
      // Verificar límites antes de seleccionar
      if (!canSelectMore) {
        toast({
          title: "Límite de materias alcanzado",
          description: `Solo puedes seleccionar hasta ${MAX_SUBJECTS} materias por semestre.`,
          variant: "destructive"
        });
        return;
      }

      const newTotalCredits = totalSelectedCredits + subject.credits;
      if (newTotalCredits > MAX_CREDITS) {
        toast({
          title: "Límite de créditos excedido",
          description: `No puedes exceder ${MAX_CREDITS} créditos. Actualmente tienes ${totalSelectedCredits} y esta materia tiene ${subject.credits}.`,
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

      // Seleccionar materia
      try {
        setIsUpdating(true);
        await dispatch(enrollStudentInSubject({ subjectId, studentId: user.id })).unwrap();
        
        setSelectedSubjects(prev => [...prev, subjectId]);
        toast({
          title: "Materia añadida",
          description: `${subject.name} ha sido añadida a tu selección.`
        });
      } catch (error) {
        toast({
          title: "Error",
          description: `Error al seleccionar materia: ${error instanceof Error ? error.message : 'Error desconocido'}`,
          variant: "destructive"
        });
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // Loading state
  if (subjectsLoading || professorsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando materias disponibles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Selección de Materias</h1>
          <p className="text-muted-foreground mt-1">
            Elige hasta {MAX_SUBJECTS} materias para este semestre (máximo {MAX_CREDITS} créditos)
          </p>
        </div>
      </div>

      {/* Summary Alert con validaciones */}
      <Alert className={`border-primary/20 ${selectedSubjects.length === MAX_SUBJECTS || totalSelectedCredits >= MAX_CREDITS ? 'bg-yellow-50 border-yellow-200' : 'bg-primary/5'}`}>
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span>
              <strong>{selectedSubjects.length}/{MAX_SUBJECTS}</strong> materias seleccionadas • 
              <strong> {totalSelectedCredits}/{MAX_CREDITS}</strong> créditos totales
            </span>
            {(selectedSubjects.length === MAX_SUBJECTS || totalSelectedCredits >= MAX_CREDITS) && (
              <Badge variant="secondary">Límite alcanzado</Badge>
            )}
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
              {selectedSubjects.map(subjectId => {
                const subject = subjects.find(s => s.id === subjectId);
                if (!subject) return null;
                
                return (
                  <div key={subjectId} className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
                    <div>
                      <h4 className="font-medium text-success">{subject.name}</h4>
                      <p className="text-sm text-muted-foreground">{subject.credits} créditos</p>
                      <p className="text-xs text-muted-foreground">{getProfessorName(subject.professor)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSubject(subjectId)}
                      disabled={isUpdating}
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
        {subjects.map((subject) => {
          const isSelected = selectedSubjects.includes(subject.id);
          const canSelect = canSelectSubject(subject);
          const hasDuplicate = !isSelected && hasDuplicateProfessor(subject.professor);
          const availabilityVariant = getAvailabilityColor(subject.enrolled || 0, subject.capacity || 30);
          
          return (
            <Card 
              key={subject.id} 
              className={`shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer ${
                isSelected 
                  ? 'ring-2 ring-success bg-success/5' 
                  : !canSelect || hasDuplicate
                  ? 'opacity-60' 
                  : 'hover:ring-1 hover:ring-primary/30'
              }`}
              onClick={() => canSelect && !hasDuplicate && toggleSubject(subject.id)}
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
                    {getAvailabilityText(subject.enrolled || 0, subject.capacity || 30)}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{subject.schedule || 'Horario por definir'}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {subject.description || 'Sin descripción disponible'}
                  </p>
                  
                  {subject.prerequisites && subject.prerequisites.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      <strong>Prerrequisitos:</strong> {subject.prerequisites.join(", ")}
                    </div>
                  )}
                </div>

                {/* Alertas de validación */}
                {hasDuplicate && (
                  <Alert variant="destructive" className="mt-3">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Ya tienes una materia con este profesor
                    </AlertDescription>
                  </Alert>
                )}

                {!isSelected && !canSelect && (
                  <Alert variant="destructive" className="mt-3">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      {!canSelectMore ? 'Límite de materias alcanzado' : 'Límite de créditos excedido'}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  variant={isSelected ? "destructive" : "default"}
                  className="w-full"
                  disabled={!canSelect || hasDuplicate || isUpdating}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSubject(subject.id);
                  }}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {isSelected ? "Removiendo..." : "Seleccionando..."}
                    </>
                  ) : (
                    isSelected ? "Remover" : "Seleccionar"
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};