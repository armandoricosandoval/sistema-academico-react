// src/components/AppContent.tsx

import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { MainLayout } from "@/layouts/MainLayout";
import { AppRouter } from "@/routes/AppRouter";
import { AuthRouter } from "@/routes/AuthRouter";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProfessors } from "@/store/slices/professorsSlice";
import { fetchStudents } from "@/store/slices/studentsSlice";
import { fetchSubjects } from "@/store/slices/subjectsSlice";
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

const AppContent = () => {
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

  // Si está cargando, mostrar loading
  if (authLoading || studentsLoading || subjectsLoading || professorsLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter basename="/sistema-academico-react">
      {isAuthenticated ? (
        <MainLayout>
          <AppRouter isAuthenticated={isAuthenticated} />
        </MainLayout>
      ) : (
        <AuthRouter isAuthenticated={isAuthenticated} />
      )}
    </BrowserRouter>
  );
};

export default AppContent;