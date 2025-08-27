// src/components/AppContent.tsx

import { Dashboard } from "@/components/dashboard/Dashboard";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { StudentsList } from "@/components/students/StudentsList";
import { SubjectSelection } from "@/components/subjects/SubjectSelection";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NotFound from "@/pages/NotFound";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, logoutUser, registerUser } from "@/store/slices/authSlice";
import { fetchProfessors } from "@/store/slices/professorsSlice";
import { fetchStudents } from "@/store/slices/studentsSlice";
import { fetchSubjects } from "@/store/slices/subjectsSlice";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginForm } from "./auth/LoginForm";
import { DebugRedux } from "./DebugRedux";
import { MyProfile } from "./MyProfile";
import { SeedData } from "./SeedData";
import { StudentSubjects } from "./students/StudentSubjects";


const AppContent = () => {
  const [, setCurrentSection] = useState("dashboard");
  const dispatch = useAppDispatch();
  
  // Estados de Redux
  const { isAuthenticated, user, isLoading: authLoading } = useAppSelector(state => state.auth);
  const { isLoading: studentsLoading } = useAppSelector(state => state.students);
  const { isLoading: subjectsLoading } = useAppSelector(state => state.subjects);
  const { isLoading: professorsLoading } = useAppSelector(state => state.professors);

  // Cargar datos iniciales cuando se autentica
  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchStudents());
      dispatch(fetchSubjects());
      dispatch(fetchProfessors());
    }
  }, [isAuthenticated, user, dispatch]);

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

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      setCurrentSection("dashboard");
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
  };

  // Si no está autenticado, mostrar LoginForm
  if (!isAuthenticated) {
    return (
      <LoginForm 
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  // Si está cargando, mostrar loading
  if (authLoading || studentsLoading || subjectsLoading || professorsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando aplicación...</p>
        </div>
      </div>
    );
  }


  return (
    <BrowserRouter>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar onLogout={handleLogout} />
          
          <div className="flex-1 flex flex-col">
            <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
              <div className="flex items-center h-full px-4">
                <SidebarTrigger className="mr-4" />
                <div className="flex-1" />
                {user && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      Bienvenido, {user.name}
                    </span>
                  </div>
                )}
              </div>
            </header>

                            <main className="flex-1 p-6">
                  <Routes>
                    <Route path="/" element={<Dashboard onNavigate={handleNavigate} />} />
                      <Route path="/dashboard" element={<Dashboard onNavigate={handleNavigate} />} />
                      <Route path="/subjects" element={<SubjectSelection />} />
                      <Route path="/students" element={<StudentsList />} />
                      <Route path="/my-subjects" element={<StudentSubjects />} />
                      <Route path="/admin" element={<DebugRedux />} />
                      <Route path="/my-profile" element={<MyProfile />} />
                      <Route path="/seed-data" element={<SeedData />} />

                      <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
          </div>
        </div>
      </SidebarProvider>
    </BrowserRouter>
  );
};

export default AppContent;
