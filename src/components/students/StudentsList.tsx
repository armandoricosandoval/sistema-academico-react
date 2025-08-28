import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProfessors } from "@/store/slices/professorsSlice";
import { fetchStudents } from "@/store/slices/studentsSlice";
import { fetchSubjects } from "@/store/slices/subjectsSlice";
import { BookOpen, Filter, Loader2, Mail, Phone, Search, User, Users } from "lucide-react";
import { useEffect, useState } from "react";

export const StudentsList = () => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedProfessor, setSelectedProfessor] = useState<string>("all");
  
  // Obtener datos de Redux
  const { students, isLoading: studentsLoading } = useAppSelector(state => state.students);
  const { subjects, isLoading: subjectsLoading } = useAppSelector(state => state.subjects);
  const { professors, isLoading: professorsLoading } = useAppSelector(state => state.professors);
  
  // Cargar datos al montar el componente
  useEffect(() => {
    if (students.length === 0) {
      dispatch(fetchStudents());
    }
    if (subjects.length === 0) {
      dispatch(fetchSubjects());
    }
    if (professors.length === 0) {
      dispatch(fetchProfessors());
    }
  }, [dispatch, students.length, subjects.length, professors.length]);
  
  // Mapear nombres de materias y profesores
  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : subjectId;
  };
  
  const getProfessorName = (professorId: string) => {
    const professor = professors.find(p => p.id === professorId);
    return professor ? professor.name : professorId;
  };
  
  // Mapear estudiantes con nombres de materias y profesores
  const mappedStudents = students.map(student => ({
    ...student,
    subjectNames: (student.subjects || []).map(getSubjectName),
    professorNames: (student.professors || []).map(getProfessorName)
  }));

  // Get unique subjects and professors for filters
  const allSubjects = Array.from(new Set(subjects.map(s => s.name))).sort();
  const allProfessors = Array.from(new Set(professors.map(p => p.name))).sort();

  // Filter students based on search and selections
  const filteredStudents = mappedStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === "all" || student.subjectNames.includes(selectedSubject);
    const matchesProfessor = selectedProfessor === "all" || student.professorNames.includes(selectedProfessor);
    
    return matchesSearch && matchesSubject && matchesProfessor;
  });


  const getGpaBadgeVariant = (gpa: number) => {
    if (gpa >= 9.0) return "default";
    if (gpa >= 8.0) return "secondary";
    return "destructive";
  };

  // Estado de carga
  const isLoading = studentsLoading || subjectsLoading || professorsLoading;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando datos de estudiantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lista de Estudiantes</h1>
          <p className="text-muted-foreground mt-1">
            Encuentra a tus compañeros de clase y profesores
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              registrados en el sistema
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materias Disponibles</CardTitle>
            <BookOpen className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{allSubjects.length}</div>
            <p className="text-xs text-muted-foreground">
              diferentes opciones
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resultados</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredStudents.length}</div>
            <p className="text-xs text-muted-foreground">
              estudiantes encontrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-primary" />
            <span>Filtros de Búsqueda</span>
          </CardTitle>
          <CardDescription>
            Busca estudiantes por nombre, materia o profesor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar por nombre</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nombre del estudiante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Filtrar por materia</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una materia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las materias</SelectItem>
                  {allSubjects.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Filtrar por profesor</label>
              <Select value={selectedProfessor} onValueChange={setSelectedProfessor}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un profesor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los profesores</SelectItem>
                  {allProfessors.map(professor => (
                    <SelectItem key={professor} value={professor}>
                      {professor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {(searchTerm || selectedSubject !== "all" || selectedProfessor !== "all") && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Filtros activos:</span>
                {searchTerm && <Badge variant="secondary">Nombre: {searchTerm}</Badge>}
                {selectedSubject !== "all" && <Badge variant="secondary">Materia: {selectedSubject}</Badge>}
                {selectedProfessor !== "all" && <Badge variant="secondary">Profesor: {selectedProfessor}</Badge>}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSubject("all");
                  setSelectedProfessor("all");
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Estudiantes Encontrados</CardTitle>
          <CardDescription>
            {filteredStudents.length} de {students.length} estudiantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Materias</TableHead>
                  <TableHead>Profesores</TableHead>
                  <TableHead>Semestre</TableHead>
                  <TableHead>Promedio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {student.id.toString().padStart(4, '0')}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{student.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{student.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {student.subjectNames.map((subject, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {student.professorNames.map((professor, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {professor}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {student.semester}º Semestre
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getGpaBadgeVariant(student.gpa)}>
                        {student.gpa.toFixed(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No se encontraron estudiantes
              </h3>
              <p className="text-sm text-muted-foreground">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};