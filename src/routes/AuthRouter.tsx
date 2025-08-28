import { LoginForm } from "@/components/auth/LoginForm";
import { useAppDispatch } from "@/store/hooks";
import { loginUser, registerUser } from "@/store/slices/authSlice";
import { Navigate, Route, Routes } from "react-router-dom";

interface AuthRouterProps {
  isAuthenticated: boolean;
}

export const AuthRouter = ({ isAuthenticated }: AuthRouterProps) => {
  const dispatch = useAppDispatch();

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      await dispatch(loginUser(credentials)).unwrap();
    } catch (error) {
      console.error('Error en login:', error);
    }
  };

  const handleRegister = async (userData: { name: string; email: string; semester: number; password: string; phone?: string }) => {
    try {
      await dispatch(registerUser({
        ...userData,
        phone: userData.phone || ''
      })).unwrap();
    } catch (error) {
      console.error('Error en registro:', error);
    }
  };

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginForm onLogin={handleLogin} onRegister={handleRegister} />} />
      <Route path="/" element={<LoginForm onLogin={handleLogin} onRegister={handleRegister} />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
