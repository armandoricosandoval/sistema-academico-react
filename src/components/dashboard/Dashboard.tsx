import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FirebaseStudentsService, FirebaseSubjectsService, FirebaseProfessorsService } from "@/services";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateUser } from "@/store/slices/authSlice";
import { fetchProfessors, updateProfessorsFromRealtime } from "@/store/slices/professorsSlice";
import { fetchStudents, updateStudentsFromRealtime } from "@/store/slices/studentsSlice";
import { fetchSubjects, updateSubjectsFromRealtime } from "@/store/slices/subjectsSlice";
import { BookOpen, GraduationCap, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const { students, isLoading: studentsLoading } = useAppSelector(state => state.students);
  const { subjects, isLoading: subjectsLoading } = useAppSelector(state => state.subjects);
  const { professors, isLoading: professorsLoading } = useAppSelector(state => state.professors);
  
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSubjects: 0,
    totalProfessors: 0,
    activeSubjects: 0,
    averageGPA: 0,
    totalCredits: 0
  });

  // Cargar datos al montar el componente (solo una vez)
  useEffect(() => {
    // Solo cargar si no hay datos ya cargados
    if (students.length === 0) {
      dispatch(fetchStudents());
    }
    if (subjects.length === 0) {
      dispatch(fetchSubjects());
    }
    if (professors.length === 0) {
      dispatch(fetchProfessors());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subscripciones en tiempo real para mantener datos actualizados
  useEffect(() => {
    // Suscripción a estudiantes
    const unsubscribeStudents = FirebaseStudentsService.subscribeToStudents(
      (updatedStudents) => {
        dispatch(updateStudentsFromRealtime(updatedStudents));
        
        // Actualizar usuario actual si está en la lista
        if (user) {
          const currentUserData = updatedStudents.find(s => s.id === user.id);
          if (currentUserData) {
            dispatch(updateUser(currentUserData));
          }
        }
      }
    );

    // Suscripción a materias
    const unsubscribeSubjects = FirebaseSubjectsService.subscribeToSubjects(
      (updatedSubjects) => {
        dispatch(updateSubjectsFromRealtime(updatedSubjects));
      }
    );

    // Suscripción a profesores
    const unsubscribeProfessors = FirebaseProfessorsService.subscribeToAll(
      (updatedProfessors) => {
        dispatch(updateProfessorsFromRealtime(updatedProfessors));
      }
    );

    return () => {
      unsubscribeStudents();
      unsubscribeSubjects();
      unsubscribeProfessors();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calcular estadísticas cuando cambien los datos
  useEffect(() => {
    // Solo calcular si hay datos y no están en loading
    if (!studentsLoading && !subjectsLoading && !professorsLoading) {
      const totalStudents = students.length;
      const totalSubjects = subjects.length;
      const totalProfessors = professors.length;
      const activeSubjects = subjects.filter(s => s.isActive).length;
      
      const totalGPA = students.reduce((sum, student) => sum + student.gpa, 0);
      const averageGPA = totalStudents > 0 ? totalGPA / totalStudents : 0;
      
      const totalCredits = students.reduce((sum, student) => sum + student.credits, 0);

      setStats({
        totalStudents,
        totalSubjects,
        totalProfessors,
        activeSubjects,
        averageGPA: Math.round(averageGPA * 100) / 100,
        totalCredits
      });
    }
  }, [students, subjects, professors, studentsLoading, subjectsLoading, professorsLoading, user]);

  // Obtener materias del usuario actual
  const userSubjects = user ? subjects.filter(subject => 
    user.subjects.includes(subject.id)
  ) : [];

  const isLoading = studentsLoading || subjectsLoading || professorsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = user ? (user.credits / user.maxCredits) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            ¡Hola, {user?.name || 'Estudiante'}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Aquí tienes un resumen de tu progreso académico
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            Semestre {user?.semester || 'N/A'}
          </Badge>
          <Badge variant="outline">
            GPA: {user?.gpa || '0.0'}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créditos Actuales</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{user?.credits || 0}</div>
            <p className="text-xs text-muted-foreground">
              de {user?.maxCredits || 9} máximos
            </p>
            <Progress value={progressPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materias Inscritas</CardTitle>
            <GraduationCap className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{userSubjects.length}</div>
            <p className="text-xs text-muted-foreground">
              este semestre
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              registrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current Subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Materias Inscritas</CardTitle>
            <CardDescription>
              Materias que estás cursando este semestre
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userSubjects.length > 0 ? (
              <div className="space-y-3">
                {userSubjects.map(subject => (
                  <div key={subject.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">{subject.name}</div>
                      <div className="text-sm text-muted-foreground">{subject.schedule}</div>
                    </div>
                    <Badge variant="outline">{subject.credits} créditos</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No tienes materias asignadas</p>
                <p className="text-sm">Contacta a tu asesor académico</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Estadísticas Generales</CardTitle>
            <CardDescription>
              Resumen del sistema académico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Materias Activas</span>
                <Badge variant="secondary">{stats.activeSubjects}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Profesores</span>
                <Badge variant="outline">{stats.totalProfessors}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Créditos Totales</span>
                <Badge variant="default">{stats.totalCredits}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Accede rápidamente a las funciones principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate('/subjects')}
            >
              <BookOpen className="h-4 w-4" />
              Ver Materias
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate('/students')}
            >
              <Users className="h-4 w-4" />
              Ver Estudiantes
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate('/my-subjects')}
            >
              <BookOpen className="h-4 w-4" />
              Mis Materias
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};