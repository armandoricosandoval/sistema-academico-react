import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAppSelector } from "@/store/hooks";
import { BookOpen, Home, LogOut, User, Users } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

interface AppSidebarProps {
  onLogout: () => void;
}

const navigation = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
      { title: "Estudiantes", url: "/students", icon: Users },
    { title: "📚 Materias", url: "/subjects", icon: BookOpen },
    { title: "📖 Mis Materias", url: "/my-subjects", icon: BookOpen },
    { title: "Administrador de Datos", url: "/admin", icon: BookOpen },
    { title: "🌱 Datos de Prueba", url: "/seed-data", icon: BookOpen },

  ];

export function AppSidebar({ onLogout }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAppSelector(state => state.auth);

  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return currentPath === "/" || currentPath === "/dashboard";
    }
    return currentPath === url;
  };

  const getNavClass = (url: string) => {
    return isActive(url) 
      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
      : "hover:bg-muted";
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"}>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center space-x-3 px-3 py-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold">
            AR
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-sidebar-foreground">Sistema Académico InterApp</h2>
              <p className="text-xs text-sidebar-foreground/60">Gestión Estudiantil</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClass(item.url)}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Mi Perfil</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/my-profile" className={getNavClass("/my-profile")}>
                  <User className="h-4 w-4" />
                  {!collapsed && <span>Mi Perfil</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="p-3 space-y-3">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                MG
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.name}
                </p>
                                  <p className="text-xs text-sidebar-foreground/60 truncate">
                    Estudiante
                  </p>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start hover:bg-destructive/10 hover:text-destructive"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Cerrar Sesión</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}