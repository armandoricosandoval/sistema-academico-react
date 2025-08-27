import { useState } from "react";
import { Search, Filter, Users, BookOpen, User, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  professors: string[];
  semester: number;
  gpa: number;
}

export const StudentsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedProfessor, setSelectedProfessor] = useState<string>("all");

  const students: Student[] = [
    {
      id: 1,
      name: "María González",
      email: "maria.gonzalez@universidad.edu",
      phone: "+1 (555) 123-4567",
      subjects: ["Cálculo I", "Física General", "Química Orgánica"],
      professors: ["Dr. Rodríguez", "Dra. López", "Prof. García"],
      semester: 3,
      gpa: 8.7
    },
    {
      id: 2,
      name: "Carlos Mendoza",
      email: "carlos.mendoza@universidad.edu",
      phone: "+1 (555) 234-5678",
      subjects: ["Cálculo I", "Programación I", "Estadística"],
      professors: ["Dr. Rodríguez", "Dr. Martínez", "Dra. Herrera"],
      semester: 2,
      gpa: 9.1
    },
    {
      id: 3,
      name: "Ana Rodríguez",
      email: "ana.rodriguez@universidad.edu",
      phone: "+1 (555) 345-6789",
      subjects: ["Física General", "Microbiología", "Química Orgánica"],
      professors: ["Dra. López", "Dra. Fernández", "Prof. García"],
      semester: 4,
      gpa: 8.9
    },
    {
      id: 4,
      name: "Luis Herrera",
      email: "luis.herrera@universidad.edu",
      phone: "+1 (555) 456-7890",
      subjects: ["Programación I", "Estadística", "Economía Internacional"],
      professors: ["Dr. Martínez", "Dra. Herrera", "Prof. Silva"],
      semester: 3,
      gpa: 8.4
    },
    {
      id: 5,
      name: "Sofia Castillo",
      email: "sofia.castillo@universidad.edu",
      phone: "+1 (555) 567-8901",
      subjects: ["Historia del Arte", "Psicología Social", "Diseño Gráfico"],
      professors: ["Prof. Morales", "Dr. Castillo", "Dra. Vega"],
      semester: 5,
      gpa: 9.3
    },
    {
      id: 6,
      name: "Diego Morales",
      email: "diego.morales@universidad.edu",
      phone: "+1 (555) 678-9012",
      subjects: ["Cálculo I", "Física General", "Estadística"],
      professors: ["Dr. Rodríguez", "Dra. López", "Dra. Herrera"],
      semester: 2,
      gpa: 7.8
    },
    {
      id: 7,
      name: "Valentina López",
      email: "valentina.lopez@universidad.edu",
      phone: "+1 (555) 789-0123",
      subjects: ["Microbiología", "Química Orgánica", "Psicología Social"],
      professors: ["Dra. Fernández", "Prof. García", "Dr. Castillo"],
      semester: 4,
      gpa: 8.6
    },
    {
      id: 8,
      name: "Roberto Silva",
      email: "roberto.silva@universidad.edu",
      phone: "+1 (555) 890-1234",
      subjects: ["Economía Internacional", "Historia del Arte", "Programación I"],
      professors: ["Prof. Silva", "Prof. Morales", "Dr. Martínez"],
      semester: 3,
      gpa: 8.2
    }
  ];

  // Get unique subjects and professors for filters
  const allSubjects = Array.from(new Set(students.flatMap(s => s.subjects))).sort();
  const allProfessors = Array.from(new Set(students.flatMap(s => s.professors))).sort();

  // Filter students based on search and selections
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === "all" || student.subjects.includes(selectedSubject);
    const matchesProfessor = selectedProfessor === "all" || student.professors.includes(selectedProfessor);
    
    return matchesSearch && matchesSubject && matchesProfessor;
  });

  const getGpaColor = (gpa: number) => {
    if (gpa >= 9.0) return "text-success";
    if (gpa >= 8.0) return "text-warning";
    return "text-destructive";
  };

  const getGpaBadgeVariant = (gpa: number) => {
    if (gpa >= 9.0) return "default";
    if (gpa >= 8.0) return "secondary";
    return "destructive";
  };

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
                        {student.subjects.map((subject, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {student.professors.map((professor, index) => (
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