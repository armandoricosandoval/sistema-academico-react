// src/components/students/StudentSubjects.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";
import { BookOpen, Clock, GraduationCap, Users } from "lucide-react";
import { useState } from "react";

export const StudentSubjects = () => {
  const { user } = useAppSelector(state => state.auth);
  const { subjects } = useAppSelector(state => state.subjects);
  const { professors } = useAppSelector(state => state.professors);
  
  const [showDetails, setShowDetails] = useState(false);

  // Obtener materias del usuario actual
  const userSubjects = user ? subjects.filter(subject => 
    user.subjects.includes(subject.id)
  ) : [];

  // Obtener profesores del usuario actual
  const userProfessors = user ? professors.filter(professor => 
    user.professors.includes(professor.id)
  ) : [];

  // Calcular estadísticas
  const totalCredits = userSubjects.reduce((sum, subject) => sum + subject.credits, 0);
  const progressPercentage = user ? (totalCredits / user.maxCredits) * 100 : 0;

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Debes iniciar sesión para ver tus materias</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Mis Materias</h1>
        <p className="text-muted-foreground">
          Gestiona tu carga académica y progreso
        </p>
      </div>

      {/* Resumen de Créditos */}
      <Card className="shadow-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Resumen de Créditos
          </CardTitle>
          <CardDescription>
            Tu progreso académico del semestre
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{userSubjects.length}</div>
              <div className="text-sm text-muted-foreground">Materias Inscritas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{totalCredits}</div>
              <div className="text-sm text-muted-foreground">Créditos Cursando</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success">{user.maxCredits - totalCredits}</div>
              <div className="text-sm text-muted-foreground">Créditos Disponibles</div>
            </div>
          </div>
          
          {/* Barra de progreso */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Progreso del semestre</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {totalCredits} de {user.maxCredits} créditos completados
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materias Inscritas */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Materias Inscritas
          </CardTitle>
          <CardDescription>
            Lista detallada de todas tus materias del semestre
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userSubjects.length > 0 ? (
            <div className="space-y-4">
              {userSubjects.map((subject) => {
                const professor = professors.find(p => p.id === subject.professor);
                
                return (
                  <div key={subject.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{subject.name}</h3>
                          <Badge variant="secondary">{subject.credits} créditos</Badge>
                          {subject.isActive ? (
                            <Badge variant="default">Activa</Badge>
                          ) : (
                            <Badge variant="outline">Inactiva</Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{subject.schedule || 'Horario por definir'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{professor?.name || 'Profesor no asignado'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span>{subject.description || 'Sin descripción'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            <span>Capacidad: {subject.enrolled || 0}/{subject.capacity || 30}</span>
                          </div>
                        </div>

                        {/* Prerrequisitos */}
                        {subject.prerequisites && subject.prerequisites.length > 0 && (
                          <div className="mt-3">
                            <div className="text-xs font-medium text-muted-foreground mb-1">
                              Prerrequisitos:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {subject.prerequisites.map((prereqId) => {
                                const prereq = subjects.find(s => s.id === prereqId);
                                return (
                                  <Badge key={prereqId} variant="outline" className="text-xs">
                                    {prereq?.name || prereqId}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No tienes materias inscritas</h3>
              <p className="text-sm mb-4">
                Ve a la sección de "Materias" para seleccionar tus materias del semestre
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/subjects'}>
                <BookOpen className="h-4 w-4 mr-2" />
                Ir a Materias
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profesores Asignados */}
      {userProfessors.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Mis Profesores
            </CardTitle>
            <CardDescription>
              Profesores asignados a tus materias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userProfessors.map((professor) => (
                <div key={professor.id} className="border rounded-lg p-4 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-medium">{professor.name}</h4>
                  <p className="text-sm text-muted-foreground">{professor.email}</p>
                  <div className="mt-2">
                    <Badge variant="outline">
                      {professor.subjects.length} materias
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Acciones */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Acciones</CardTitle>
          <CardDescription>
            Gestiona tu carga académica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="default" 
              onClick={() => window.location.href = '/subjects'}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Seleccionar Materias
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/dashboard'}
              className="flex items-center gap-2"
            >
              <GraduationCap className="h-4 w-4" />
              Volver al Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
