// src/components/MyProfile.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateProfile } from "@/store/slices/authSlice";
import { BookOpen, GraduationCap, User } from "lucide-react";
import { useState } from "react";

export const MyProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector(state => state.auth);
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    semester: user?.semester || 1,
  });

  // Solo mostrar si hay usuario autenticado
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Debes iniciar sesión para ver tu perfil</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEdit = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      semester: user.semester,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      semester: user.semester,
    });
  };

  const handleSave = async () => {
    try {
      await dispatch(updateProfile({
        name: formData.name,
        phone: formData.phone,
        semester: formData.semester,
      })).unwrap();

      toast({
        title: "¡Perfil actualizado!",
        description: "Tu perfil se ha actualizado correctamente",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Error al actualizar perfil: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y académica
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
            <CardDescription>
              Tus datos básicos y de contacto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Tu nombre completo"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    El email no se puede modificar por seguridad
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="semester">Semestre</Label>
                  <Input
                    id="semester"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.semester}
                    onChange={(e) => handleInputChange('semester', parseInt(e.target.value))}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Nombre Completo</Label>
                  <p className="text-sm font-medium">{user.name}</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Email</Label>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <p className="text-sm font-medium">{user.phone || 'No especificado'}</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Semestre</Label>
                  <p className="text-sm font-medium">{user.semester}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Información Académica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Información Académica
            </CardTitle>
            <CardDescription>
              Tu progreso y estado académico
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>GPA Actual</Label>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-primary">{user.gpa}</p>
                <Badge variant="outline">de 10.0</Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Créditos Cursando</Label>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-accent">{user.credits}</p>
                <Badge variant="secondary">de {user.maxCredits}</Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Materias Inscritas</Label>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-success">{user.subjects.length}</p>
                <Badge variant="outline">materias</Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Profesores Asignados</Label>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-warning">{user.professors.length}</p>
                <Badge variant="outline">profesores</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Materias Inscritas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Materias Inscritas
          </CardTitle>
          <CardDescription>
            Lista de materias que estás cursando actualmente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user.subjects.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {user.subjects.map((subjectId, index) => (
                <div key={subjectId} className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">Materia {index + 1}</div>
                  <div className="text-sm text-muted-foreground">ID: {subjectId}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No tienes materias inscritas</p>
              <p className="text-sm">Contacta a tu asesor académico</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acciones */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones</CardTitle>
          <CardDescription>
            Gestiona tu perfil y cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={handleEdit}>
                Editar Perfil
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
