import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState } from "react";

interface LoginFormProps {
  onLogin: (credentials: { email: string; password: string }) => void;
  onRegister: (userData: { name: string; email: string; phone: string; password: string; semester: number }) => void;
}

export const LoginForm = ({ onLogin, onRegister }: LoginFormProps) => {
  const { isLoading, error } = useAppSelector(state => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    semester: "1"
  });

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      isValid: minLength && hasUpper && hasLower && hasNumber
    };
  };

  const passwordStrength = validatePassword(registerForm.password);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await onLogin(loginForm);
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al iniciar sesión.",
        variant: "destructive"
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordStrength.isValid) {
      toast({
        title: "Contraseña inválida",
        description: "La contraseña debe cumplir todos los requisitos.",
        variant: "destructive"
      });
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive"
      });
      return;
    }

    try {
      await onRegister({
        name: registerForm.name,
        email: registerForm.email,
        phone: registerForm.phone,
        password: registerForm.password,
        semester: parseInt(registerForm.semester)
      });
      
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada correctamente."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al registrar usuario.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-24">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Sistema Académico</CardTitle>
        <CardDescription>
          Inicia sesión o crea una nueva cuenta
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Iniciando..." : "Iniciar Sesión"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Nombre completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Tu nombre completo"
                    className="pl-10"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-phone">Teléfono (opcional)</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="pl-10"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-semester">Semestre</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-semester"
                    type="number"
                    min="1"
                    max="10"
                    placeholder="1"
                    className="pl-10"
                    value={registerForm.semester}
                    onChange={(e) => setRegisterForm({...registerForm, semester: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                
                {/* Password Strength Indicator */}
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <div className={`h-2 flex-1 rounded ${passwordStrength.minLength ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className={`h-2 flex-1 rounded ${passwordStrength.hasUpper ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className={`h-2 flex-1 rounded ${passwordStrength.hasLower ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className={`h-2 flex-1 rounded ${passwordStrength.hasNumber ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className={passwordStrength.minLength ? 'text-green-600' : 'text-gray-500'}>
                      ✓ Mínimo 8 caracteres
                    </div>
                    <div className={passwordStrength.hasUpper ? 'text-green-600' : 'text-gray-500'}>
                      ✓ Al menos una mayúscula
                    </div>
                    <div className={passwordStrength.hasLower ? 'text-green-600' : 'text-gray-500'}>
                      ✓ Al menos una minúscula
                    </div>
                    <div className={passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}>
                      ✓ Al menos un número
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-confirm-password">Confirmar Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Registrarse"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};