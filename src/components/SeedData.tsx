// src/components/SeedData.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/services/firebase';
import {
    addDoc,
    collection,
    doc,
    setDoc
} from 'firebase/firestore';
import React, { useState } from 'react';

// Datos de prueba
const testProfessors = [
  {
    name: 'Dr. Rodríguez',
    email: 'rodriguez@universidad.edu',
    subjects: [],
    maxSubjects: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Dra. López',
    email: 'lopez@universidad.edu',
    subjects: [],
    maxSubjects: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Prof. García',
    email: 'garcia@universidad.edu',
    subjects: [],
    maxSubjects: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Dr. Martínez',
    email: 'martinez@universidad.edu',
    subjects: [],
    maxSubjects: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Dra. Herrera',
    email: 'herrera@universidad.edu',
    subjects: [],
    maxSubjects: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const testSubjects = [
  {
    name: 'Cálculo I',
    credits: 3,
    professor: '',
    schedule: 'Lun-Mié-Vie 8:00-10:00',
    capacity: 30,
    enrolled: 0,
    description: 'Introducción al cálculo diferencial e integral',
    prerequisites: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Física General',
    credits: 3,
    professor: '',
    schedule: 'Mar-Jue 10:00-12:00',
    capacity: 25,
    enrolled: 0,
    description: 'Conceptos fundamentales de mecánica y termodinámica',
    prerequisites: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Química Orgánica',
    credits: 3,
    professor: '',
    schedule: 'Lun-Mié 14:00-17:00',
    capacity: 20,
    enrolled: 0,
    description: 'Estudio de compuestos orgánicos y sus reacciones',
    prerequisites: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Programación I',
    credits: 3,
    professor: '',
    schedule: 'Mar-Jue 8:00-10:00',
    capacity: 35,
    enrolled: 0,
    description: 'Fundamentos de programación con Python',
    prerequisites: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Estadística',
    credits: 3,
    professor: '',
    schedule: 'Vie 9:00-12:00',
    capacity: 40,
    enrolled: 0,
    description: 'Conceptos básicos de estadística descriptiva e inferencial',
    prerequisites: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Historia del Arte',
    credits: 3,
    professor: '',
    schedule: 'Mié 16:00-18:00',
    capacity: 50,
    enrolled: 0,
    description: 'Recorrido por los principales movimientos artísticos',
    prerequisites: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Microbiología',
    credits: 3,
    professor: '',
    schedule: 'Lun-Mar-Mié 10:00-12:00',
    capacity: 15,
    enrolled: 0,
    description: 'Estudio de microorganismos y su impacto',
    prerequisites: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Psicología Social',
    credits: 3,
    professor: '',
    schedule: 'Jue-Vie 14:00-16:00',
    capacity: 30,
    enrolled: 0,
    description: 'Análisis del comportamiento humano en grupos',
    prerequisites: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Economía Internacional',
    credits: 3,
    professor: '',
    schedule: 'Mar-Mié-Jue 16:00-17:30',
    capacity: 25,
    enrolled: 0,
    description: 'Principios de comercio y finanzas internacionales',
    prerequisites: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Diseño Gráfico',
    credits: 3,
    professor: '',
    schedule: 'Lun-Vie 18:00-20:00',
    capacity: 20,
    enrolled: 0,
    description: 'Fundamentos del diseño visual y comunicación',
    prerequisites: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const SeedData: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const { toast } = useToast();

  const seedProfessors = async () => {
    setLoading(true);
    setStatus('Creando profesores...');
    
    try {
      const professorIds: string[] = [];
      
      for (const professor of testProfessors) {
        const docRef = await addDoc(collection(db, 'professors'), professor);
        professorIds.push(docRef.id);
        console.log('✅ Profesor creado:', professor.name, 'ID:', docRef.id);
      }
      
      setStatus(`✅ ${professorIds.length} profesores creados exitosamente`);
      toast({
        title: "¡Éxito!",
        description: `${professorIds.length} profesores creados`,
      });
      
      return professorIds;
    } catch (error) {
      console.error('❌ Error creando profesores:', error);
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      toast({
        title: "Error",
        description: "Error al crear profesores",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const seedSubjects = async (professorIds: string[]) => {
    setLoading(true);
    setStatus('Creando materias...');
    
    try {
      const subjectIds: string[] = [];
      
      for (let i = 0; i < testSubjects.length; i++) {
        const subject = { ...testSubjects[i] };
        // Asignar profesor (cada profesor dicta 2 materias)
        const professorIndex = Math.floor(i / 2);
        if (professorIndex < professorIds.length) {
          subject.professor = professorIds[professorIndex];
        }
        
        const docRef = await addDoc(collection(db, 'subjects'), subject);
        subjectIds.push(docRef.id);
        console.log('✅ Materia creada:', subject.name, 'ID:', docRef.id);
      }
      
      setStatus(`✅ ${subjectIds.length} materias creadas exitosamente`);
      toast({
        title: "¡Éxito!",
        description: `${subjectIds.length} materias creadas`,
      });
      
      return subjectIds;
    } catch (error) {
      console.error('❌ Error creando materias:', error);
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      toast({
        title: "Error",
        description: "Error al crear materias",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const seedAllData = async () => {
    setLoading(true);
    setStatus('Iniciando creación de datos...');
    
    try {
      // 1. Crear profesores
      const professorIds = await seedProfessors();
      if (professorIds.length === 0) return;
      
      // 2. Crear materias
      const subjectIds = await seedSubjects(professorIds);
      if (subjectIds.length === 0) return;
      
      // 3. Actualizar profesores con sus materias
      setStatus('Actualizando profesores...');
      for (let i = 0; i < professorIds.length; i++) {
        const professorId = professorIds[i];
        const professorSubjects = subjectIds.slice(i * 2, (i + 1) * 2);
        
        await setDoc(doc(db, 'professors', professorId), {
          subjects: professorSubjects,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
      
      setStatus('✅ Todos los datos creados exitosamente');
      toast({
        title: "¡Completado!",
        description: "Base de datos poblada con datos de prueba",
      });
      
    } catch (error) {
      console.error('❌ Error general:', error);
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      toast({
        title: "Error",
        description: "Error al crear datos de prueba",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearAllData = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
      return;
    }
    
    setLoading(true);
    setStatus('Eliminando datos...');
    
    try {
      // Nota: En producción, esto debería usar batch operations
      // Por ahora, solo mostramos un mensaje
      setStatus('⚠️ Función de limpieza no implementada por seguridad');
      toast({
        title: "Información",
        description: "Para limpiar datos, usa Firebase Console",
      });
    } catch (error) {
      console.error('❌ Error limpiando datos:', error);
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🌱 Poblar Base de Datos</h1>
        <p className="text-muted-foreground">
          Crea datos de prueba para probar el sistema académico
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>📚 Datos de Prueba</CardTitle>
            <CardDescription>
              Crea profesores, materias y asigna materias a profesores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Profesores:</span>
                <Badge variant="secondary">{testProfessors.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Materias:</span>
                <Badge variant="secondary">{testSubjects.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Materias por profesor:</span>
                <Badge variant="outline">2</Badge>
              </div>
            </div>
            
            <Button 
              onClick={seedAllData} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creando...' : '🌱 Crear Todos los Datos'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🧹 Limpiar Datos</CardTitle>
            <CardDescription>
              Elimina todos los datos de prueba (usar con precaución)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={clearAllData} 
              disabled={loading}
              variant="destructive"
              className="w-full"
            >
              🗑️ Limpiar Todos los Datos
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Estado */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Estado de la Operación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-mono">{status || 'Listo para crear datos'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Información */}
      <Card>
        <CardHeader>
          <CardTitle>ℹ️ Información</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>• Se crearán <strong>5 profesores</strong> con máximo 2 materias cada uno</p>
          <p>• Se crearán <strong>10 materias</strong> de 3 créditos cada una</p>
          <p>• Cada materia se asignará automáticamente a un profesor</p>
          <p>• Los datos se guardarán en Firestore en tiempo real</p>
          <p>• Después de crear los datos, el dashboard mostrará estadísticas reales</p>
        </CardContent>
      </Card>
    </div>
  );
};
