// src/components/SeedData.tsx
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FirebaseProfessorsService, FirebaseStudentsService, FirebaseSubjectsService } from "@/services";
import { AlertTriangle, BookOpen, CheckCircle2, GraduationCap, Loader2, Trash2, Users } from "lucide-react";
import { useState } from "react";

export const SeedData = () => {
  const { toast } = useToast();
  const [isClearing, setIsClearing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [clearStatus, setClearStatus] = useState<string>("");
  const [createStatus, setCreateStatus] = useState<string>("");

  // Datos de prueba para profesores
  const testProfessors = [
    {
      name: 'Dr. Carlos Rodríguez',
      email: 'rodriguez@universidad.edu',
      maxSubjects: 3,
      isActive: true,
    },
    {
      name: 'Dra. María López',
      email: 'lopez@universidad.edu',
      maxSubjects: 3,
      isActive: true,
    },
    {
      name: 'Prof. Juan García',
      email: 'garcia@universidad.edu',
      maxSubjects: 2,
      isActive: true,
    },
    {
      name: 'Dr. Ana Martínez',
      email: 'martinez@universidad.edu',
      maxSubjects: 3,
      isActive: true,
    },
    {
      name: 'Dra. Patricia Herrera',
      email: 'herrera@universidad.edu',
      maxSubjects: 2,
      isActive: true,
    },
    {
      name: 'Prof. Roberto Morales',
      email: 'morales@universidad.edu',
      maxSubjects: 2,
      isActive: true,
    },
    {
      name: 'Dr. Laura Fernández',
      email: 'fernandez@universidad.edu',
      maxSubjects: 2,
      isActive: true,
    },
    {
      name: 'Prof. Carlos Castillo',
      email: 'castillo@universidad.edu',
      maxSubjects: 2,
      isActive: true,
    },
    {
      name: 'Dra. Sofia Silva',
      email: 'silva@universidad.edu',
      maxSubjects: 2,
      isActive: true,
    },
    {
      name: 'Prof. Diego Vega',
      email: 'vega@universidad.edu',
      maxSubjects: 2,
      isActive: true,
    }
  ];

  // Datos de prueba para estudiantes
  const testStudents = [
    {
      name: 'Ana García',
      email: 'ana.garcia@estudiante.edu',
      semester: 3,
    },
    {
      name: 'Carlos López',
      email: 'carlos.lopez@estudiante.edu',
      semester: 2,
    },
    {
      name: 'María Rodríguez',
      email: 'maria.rodriguez@estudiante.edu',
      semester: 4,
    },
    {
      name: 'Juan Pérez',
      email: 'juan.perez@estudiante.edu',
      semester: 1,
    },
    {
      name: 'Laura Torres',
      email: 'laura.torres@estudiante.edu',
      semester: 3,
    },
    {
      name: 'Roberto Silva',
      email: 'roberto.silva@estudiante.edu',
      semester: 2,
    },
    {
      name: 'Patricia Morales',
      email: 'patricia.morales@estudiante.edu',
      semester: 4,
    },
    {
      name: 'Diego Herrera',
      email: 'diego.herrera@estudiante.edu',
      semester: 1,
    }
  ];

  // Datos de prueba para materias
  const testSubjects = [
    {
      name: 'Cálculo I',
      credits: 3,
      schedule: 'Lun-Mié-Vie 8:00-10:00',
      capacity: 30,
      enrolled: 0,
      description: 'Introducción al cálculo diferencial e integral',
      prerequisites: [],
      isActive: true,
      professorIndex: 0, // Dr. Rodríguez
    },
    {
      name: 'Física General',
      credits: 3,
      schedule: 'Mar-Jue 10:00-12:00',
      capacity: 25,
      enrolled: 0,
      description: 'Conceptos fundamentales de mecánica y termodinámica',
      prerequisites: [],
      isActive: true,
      professorIndex: 1, // Dra. López
    },
    {
      name: 'Química Orgánica',
      credits: 3,
      schedule: 'Lun-Mié 14:00-17:00',
      capacity: 20,
      enrolled: 0,
      description: 'Estudio de compuestos orgánicos y sus reacciones',
      prerequisites: [],
      isActive: true,
      professorIndex: 2, // Prof. García
    },
    {
      name: 'Programación I',
      credits: 3,
      schedule: 'Mar-Jue 8:00-10:00',
      capacity: 35,
      enrolled: 0,
      description: 'Fundamentos de programación con Python',
      prerequisites: [],
      isActive: true,
      professorIndex: 3, // Dr. Martínez
    },
    {
      name: 'Estadística',
      credits: 3,
      schedule: 'Vie 9:00-12:00',
      capacity: 40,
      enrolled: 0,
      description: 'Conceptos básicos de estadística descriptiva e inferencial',
      prerequisites: [],
      isActive: true,
      professorIndex: 4, // Dra. Herrera
    },
    {
      name: 'Historia del Arte',
      credits: 3,
      schedule: 'Mié 16:00-18:00',
      capacity: 50,
      enrolled: 0,
      description: 'Recorrido por los principales movimientos artísticos',
      prerequisites: [],
      isActive: true,
      professorIndex: 5, // Prof. Morales
    },
    {
      name: 'Microbiología',
      credits: 3,
      schedule: 'Lun-Mar-Mié 10:00-12:00',
      capacity: 15,
      enrolled: 0,
      description: 'Estudio de microorganismos y su impacto',
      prerequisites: [],
      isActive: true,
      professorIndex: 6, // Dra. Fernández
    },
    {
      name: 'Psicología Social',
      credits: 3,
      schedule: 'Jue-Vie 14:00-16:00',
      capacity: 30,
      enrolled: 0,
      description: 'Análisis del comportamiento humano en grupos',
      prerequisites: [],
      isActive: true,
      professorIndex: 7, // Prof. Castillo
    },
    {
      name: 'Economía Internacional',
      credits: 3,
      schedule: 'Mar-Mié-Jue 16:00-17:30',
      capacity: 25,
      enrolled: 0,
      description: 'Principios de comercio y finanzas internacionales',
      prerequisites: [],
      isActive: true,
      professorIndex: 8, // Dra. Silva
    },
    {
      name: 'Diseño Gráfico',
      credits: 3,
      schedule: 'Lun-Vie 18:00-20:00',
      capacity: 20,
      enrolled: 0,
      description: 'Fundamentos del diseño visual y comunicación',
      prerequisites: [],
      isActive: true,
      professorIndex: 9, // Prof. Vega
    }
  ];

  // Función para limpiar toda la base de datos
  const clearAllData = async () => {
    setIsClearing(true);
    setClearStatus("Iniciando limpieza de base de datos...");

    try {
      // Limpiar materias
      setClearStatus("Limpiando materias...");
      const subjects = await FirebaseSubjectsService.getAllSubjects();
      for (const subject of subjects) {
        await FirebaseSubjectsService.deleteSubject(subject.id);
      }

      // Limpiar profesores
      setClearStatus("Limpiando profesores...");
      const professors = await FirebaseProfessorsService.getAllProfessors();
      for (const professor of professors) {
        await FirebaseProfessorsService.deleteProfessor(professor.id);
      }

      // Limpiar estudiantes
      setClearStatus("Limpiando estudiantes...");
      const students = await FirebaseStudentsService.getAllStudents();
      for (const student of students) {
        await FirebaseStudentsService.deleteStudent(student.id);
      }

      setClearStatus("¡Base de datos limpiada completamente!");
      toast({
        title: "Éxito",
        description: "Toda la base de datos ha sido limpiada",
        variant: "default"
      });

    } catch (error) {
      setClearStatus(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      toast({
        title: "Error",
        description: "Error al limpiar la base de datos",
        variant: "destructive"
      });
    } finally {
      setIsClearing(false);
    }
  };

  // Función para crear toda la base de datos de prueba
  const createAllTestData = async () => {
    setIsCreating(true);
    setCreateStatus("Iniciando creación de datos de prueba...");

    try {
      // 1. Crear profesores
      setCreateStatus("Creando profesores...");
      const professorIds: string[] = [];
      
      for (const professorData of testProfessors) {
        const newProfessor = await FirebaseProfessorsService.createProfessor({
          name: professorData.name,
          email: professorData.email,
          subjects: [], // Inicialmente sin materias
          maxSubjects: professorData.maxSubjects,
          isActive: professorData.isActive,
        });
        professorIds.push(newProfessor.id);
        console.log(`✅ Profesor creado: ${newProfessor.name} (ID: ${newProfessor.id})`);
      }

      // 2. Crear materias asociadas a profesores
      setCreateStatus("Creando materias y asociando profesores...");
      const subjectIds: string[] = [];
      
      for (const subjectData of testSubjects) {
        const professorId = professorIds[subjectData.professorIndex];
        if (!professorId) {
          throw new Error(`Profesor no encontrado para índice ${subjectData.professorIndex}`);
        }

        const newSubject = await FirebaseSubjectsService.createSubject({
          name: subjectData.name,
          credits: subjectData.credits,
          professor: professorId, // Asociar profesor por ID
          schedule: subjectData.schedule,
          capacity: subjectData.capacity,
          enrolled: subjectData.enrolled,
          description: subjectData.description,
          prerequisites: subjectData.prerequisites,
          isActive: subjectData.isActive,
        });
        
        subjectIds.push(newSubject.id);
        console.log(`✅ Materia creada: ${newSubject.name} - Profesor: ${professorId}`);
      }

      // 3. Actualizar profesores con sus materias asignadas
      setCreateStatus("Actualizando profesores con materias asignadas...");
      for (let i = 0; i < professorIds.length; i++) {
        const professorId = professorIds[i];
        const professorSubjects = subjectIds.filter((_, index) => 
          testSubjects[index].professorIndex === i
        );
        
        await FirebaseProfessorsService.updateProfessor(professorId, {
          subjects: professorSubjects,
        });
        console.log(`✅ Profesor ${testProfessors[i].name} actualizado con ${professorSubjects.length} materias`);
      }

      // 4. Crear estudiantes
      setCreateStatus("Creando estudiantes...");
      const studentIds: string[] = [];
      
      for (const studentData of testStudents) {
        const newStudent = await FirebaseStudentsService.createStudent({
          name: studentData.name,
          email: studentData.email,
          phone: '', // Teléfono vacío por defecto
          semester: studentData.semester,
        });
        studentIds.push(newStudent.id);
        console.log(`✅ Estudiante creado: ${newStudent.name} (ID: ${newStudent.id})`);
      }

      // 5. Asignar algunas materias a estudiantes (simular selección)
      setCreateStatus("Asignando materias a estudiantes...");
      
      // Estudiante 1: 2 materias
      await FirebaseStudentsService.selectSubject(studentIds[0], subjectIds[0]); // Cálculo I
      await FirebaseStudentsService.selectSubject(studentIds[0], subjectIds[1]); // Física General
      
      // Estudiante 2: 1 materia
      await FirebaseStudentsService.selectSubject(studentIds[1], subjectIds[2]); // Química Orgánica
      
      // Estudiante 3: 3 materias
      await FirebaseStudentsService.selectSubject(studentIds[2], subjectIds[3]); // Programación I
      await FirebaseStudentsService.selectSubject(studentIds[2], subjectIds[4]); // Estadística
      await FirebaseStudentsService.selectSubject(studentIds[2], subjectIds[5]); // Historia del Arte

      setCreateStatus("¡Base de datos poblada completamente!");
      toast({
        title: "¡Éxito!",
        description: `Base de datos poblada con ${testProfessors.length} profesores, ${testSubjects.length} materias y ${testStudents.length} estudiantes`,
        variant: "default"
      });

    } catch (error) {
      setCreateStatus(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      toast({
        title: "Error",
        description: "Error al crear datos de prueba",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">🌱 Poblar Base de Datos</h1>
        <p className="text-muted-foreground mt-1">
          Crea datos de prueba completos para el sistema académico
        </p>
      </div>

      {/* Información de datos a crear */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-700">
            <BookOpen className="h-5 w-5" />
            <span>Datos que se crearán</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-100 rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="font-bold text-blue-700">{testProfessors.length}</div>
              <div className="text-sm text-blue-600">Profesores</div>
            </div>
            <div className="text-center p-3 bg-blue-100 rounded-lg">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="font-bold text-blue-700">{testSubjects.length}</div>
              <div className="text-sm text-blue-600">Materias</div>
            </div>
            <div className="text-center p-3 bg-blue-100 rounded-lg">
              <GraduationCap className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="font-bold text-blue-700">{testStudents.length}</div>
              <div className="text-sm text-blue-600">Estudiantes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón para crear datos */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-700">
            <CheckCircle2 className="h-5 w-5" />
            <span>Crear Datos de Prueba</span>
          </CardTitle>
          <CardDescription>
            Crea profesores, materias y estudiantes con asociaciones correctas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={createAllTestData}
            disabled={isCreating}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creando...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                🌱 CREAR TODOS LOS DATOS DE PRUEBA
              </>
            )}
          </Button>

          {createStatus && (
            <div className="mt-4 p-3 rounded-lg bg-green-100">
              <p className="text-sm font-medium text-green-700">{createStatus}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botón para limpiar datos */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            <span>Limpiar Base de Datos</span>
          </CardTitle>
          <CardDescription>
            ⚠️ ADVERTENCIA: Esta acción eliminará TODOS los datos de Firestore
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>¡CUIDADO!</strong> Esta operación eliminará permanentemente:
              <ul className="list-disc list-inside mt-2">
                <li>Todas las materias</li>
                <li>Todos los profesores</li>
                <li>Todos los estudiantes</li>
                <li>Todas las relaciones entre entidades</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Button 
            variant="destructive" 
            size="lg"
            onClick={clearAllData}
            disabled={isClearing}
            className="w-full"
          >
            {isClearing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Limpiando...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                🗑️ LIMPIAR TODA LA BASE DE DATOS
              </>
            )}
          </Button>

          {clearStatus && (
            <div className="mt-4 p-3 rounded-lg bg-muted">
              <p className="text-sm font-medium">Estado: {clearStatus}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información del proceso */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-700">
            <BookOpen className="h-5 w-5" />
            <span>Proceso de Creación</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-purple-700">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-purple-100">1</Badge>
              <span>Crear <strong>10 profesores</strong> con emails únicos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-purple-100">2</Badge>
              <span>Crear <strong>10 materias</strong> de 3 créditos cada una</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-purple-100">3</Badge>
              <span><strong>Asociar materias a profesores</strong> por ID</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-purple-100">4</Badge>
              <span>Crear <strong>8 estudiantes</strong> en diferentes semestres</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-purple-100">5</Badge>
              <span><strong>Asignar materias a estudiantes</strong> (simulación de selección)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
