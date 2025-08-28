import { Dashboard } from "@/components/dashboard/Dashboard";
import { DebugRedux } from "@/components/DebugRedux";
import { MyProfile } from "@/components/MyProfile";
import { SeedData } from "@/components/SeedData";
import { StudentsList } from "@/components/students/StudentsList";
import { StudentSubjects } from "@/components/students/StudentSubjects";
import { SubjectSelection } from "@/components/subjects/SubjectSelection";
import NotFound from "@/pages/NotFound";
import { Navigate, Route, Routes } from "react-router-dom";

interface AppRouterProps {
  isAuthenticated: boolean;
}

export const AppRouter = ({ isAuthenticated }: AppRouterProps) => {
  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/subjects" element={<SubjectSelection />} />
      <Route path="/students" element={<StudentsList />} />
      <Route path="/my-subjects" element={<StudentSubjects />} />
      <Route path="/admin" element={<DebugRedux />} />
      <Route path="/my-profile" element={<MyProfile />} />
      <Route path="/seed-data" element={<SeedData />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
