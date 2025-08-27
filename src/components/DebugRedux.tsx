// src/components/DebugRedux.tsx

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProfessors } from "@/store/slices/professorsSlice";
import {
  createStudent,
  fetchStudents,
  removeSubject
} from "@/store/slices/studentsSlice";
import {
  createSubject,
  fetchSubjects
} from "@/store/slices/subjectsSlice";
import { useState } from "react";

export const DebugRedux = () => {
  const dispatch = useAppDispatch();
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  
  // Estados de Redux
  const students = useAppSelector(state => state.students);
  const subjects = useAppSelector(state => state.subjects);
  const professors = useAppSelector(state => state.professors);

  // Funciones de prueba


  const handleFetchStudents = () => {
    dispatch(fetchStudents());
  };

  const handleFetchSubjects = () => {
    dispatch(fetchSubjects());
  };

  const handleFetchProfessors = () => {
    dispatch(fetchProfessors());
  };

  const handleCreateStudent = () => {
    if (newStudentName && newStudentEmail) {
      dispatch(createStudent({
        name: newStudentName,
        email: newStudentEmail,
        phone: "",
        semester: 1
      }));
      setNewStudentName("");
      setNewStudentEmail("");
    }
  };


  const handleRemoveSubject = (studentId: string, subjectId: string) => {
    dispatch(removeSubject({ studentId, subjectId }));
  };

  const handleCreateSubject = () => {
    dispatch(createSubject({
      name: "Nueva Materia",
      credits: 3,
      professor: "1",
      schedule: "Lun-Mié 10:00-12:00",
      capacity: 25,
      enrolled: 0,
      description: "Descripción de la nueva materia",
      prerequisites: [],
      isActive: true
    }));
  };


  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Administrador de Datos</h1>
      
         {/* Estado de Estudiantes */}
      <Card>
        <CardHeader>
          <CardTitle>👥 Estado de Estudiantes</CardTitle>
          <CardDescription>Prueba las funciones de estudiantes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Badge variant="outline">
              Total: {students.students.length}
            </Badge>
            <Badge variant={students.isLoading ? "secondary" : "default"}>
              {students.isLoading ? "Cargando..." : "Listo"}
            </Badge>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={handleFetchStudents} disabled={students.isLoading}>
              Cargar Estudiantes
            </Button>
            <Button onClick={handleCreateStudent} variant="outline">
              Crear Estudiante
            </Button>
          </div>

          {/* Formulario para crear estudiante */}
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Nombre"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              className="px-3 py-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={newStudentEmail}
              onChange={(e) => setNewStudentEmail(e.target.value)}
              className="px-3 py-2 border rounded"
            />
          </div>

          {/* Lista de estudiantes */}
          <div className="space-y-2">
            <h4 className="font-medium">Estudiantes:</h4>
            {students.students.map(student => (
              <div key={student.id} className="p-3 border rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <strong>{student.name}</strong> - {student.email}
                    <div className="text-sm text-gray-600">
                      Créditos: {student.credits}/{student.maxCredits} | 
                      Materias: {student.subjects.length}/3
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {student.subjects.map(subjectId => (
                      <Badge 
                        key={subjectId} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-red-100"
                        onClick={() => handleRemoveSubject(student.id, subjectId)}
                      >
                        {subjectId}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {students.error && (
            <div className="text-red-500 text-sm">Error: {students.error}</div>
          )}
        </CardContent>
      </Card>

      {/* Estado de Materias */}
      <Card>
        <CardHeader>
          <CardTitle>📚 Estado de Materias</CardTitle>
          <CardDescription>Prueba las funciones de materias</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Badge variant="outline">
              Total: {subjects.subjects.length}
            </Badge>
            <Badge variant={subjects.isLoading ? "secondary" : "default"}>
              {subjects.isLoading ? "Cargando..." : "Listo"}
            </Badge>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={handleFetchSubjects} disabled={subjects.isLoading}>
              Cargar Materias
            </Button>
            <Button onClick={handleCreateSubject} variant="outline">
              Crear Materia
            </Button>
          </div>

          {/* Lista de materias */}
          <div className="space-y-2">
            <h4 className="font-medium">Materias:</h4>
            {subjects.subjects.map(subject => (
              <div key={subject.id} className="p-3 border rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <strong>{subject.name}</strong> - {subject.credits} créditos
                    <div className="text-sm text-gray-600">
                      Profesor: {subject.professor} | 
                      Cupos: {subject.enrolled}/{subject.capacity}
                    </div>
                  </div>
                  <Badge variant={subject.isActive ? "default" : "secondary"}>
                    {subject.isActive ? "Activa" : "Inactiva"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {subjects.error && (
            <div className="text-red-500 text-sm">Error: {subjects.error}</div>
          )}
        </CardContent>
      </Card>

      {/* Estado de Profesores */}
      <Card>
        <CardHeader>
          <CardTitle>👨‍🏫 Estado de Profesores</CardTitle>
          <CardDescription>Prueba las funciones de profesores</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Badge variant="outline">
              Total: {professors.professors.length}
            </Badge>
            <Badge variant={professors.isLoading ? "secondary" : "default"}>
              {professors.isLoading ? "Cargando..." : "Listo"}
            </Badge>
          </div>
          
          <Button onClick={handleFetchProfessors} disabled={professors.isLoading}>
            Cargar Profesores
          </Button>

          {/* Lista de profesores */}
          <div className="space-y-2">
            <h4 className="font-medium">Profesores:</h4>
            {professors.professors.map(professor => (
              <div key={professor.id} className="p-3 border rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <strong>{professor.name}</strong> - {professor.email}
                    <div className="text-sm text-gray-600">
                      Materias: {professor.subjects.length}/{professor.maxSubjects}
                    </div>
                  </div>
                  <Badge variant={professor.isActive ? "default" : "secondary"}>
                    {professor.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {professors.error && (
            <div className="text-red-500 text-sm">Error: {professors.error}</div>
          )}
        </CardContent>
      </Card>

      
    </div>
  );
};
