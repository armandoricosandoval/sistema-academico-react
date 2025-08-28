# Sistema Académico Universitario

## Descripción

Sistema de gestión académica universitaria desarrollado como prueba técnica para la posición de Ingeniero Master Web. Permite a estudiantes seleccionar materias, visualizar información académica y gestionar su progreso, implementando validaciones de negocio y actualizaciones en tiempo real.

## Especificaciones Técnicas

### Frontend
- **Framework**: React 18
- **Lenguaje**: TypeScript 4.9+
- **Gestión de Estado**: Redux Toolkit
- **Persistencia**: Redux Persist
- **Enrutamiento**: React Router DOM v6
- **Estilos**: Tailwind CSS + Shadcn/ui
- **Build Tool**: Vite

### Backend
- **Plataforma**: Firebase
- **Autenticación**: Firebase Authentication
- **Base de Datos**: Firestore
- **Hosting**: Firebase Hosting

### Patrones y Arquitectura
- **Arquitectura**: Flux (implementada con Redux)
- **Patrón de Componentes**: Container/Presentational
- **Estructura de Estado**: Slice Pattern
- **Comunicación con API**: Repository Pattern
- **Tiempo Real**: Observer Pattern (Firestore subscriptions)

## Requerimientos Implementados

1. **Autenticación de Usuarios**
   - Registro e inicio de sesión con email/contraseña
   - Persistencia de sesión entre recargas

2. **Gestión de Materias**
   - Selección de hasta 3 materias por estudiante
   - Límite de 9 créditos por semestre
   - Validación de profesor único por estudiante
   - Control de cupos disponibles

3. **Gestión de Profesores**
   - Asignación de materias a profesores
   - Límite de 2 materias por profesor

4. **Visualización de Datos**
   - Dashboard con estadísticas en tiempo real
   - Lista de estudiantes con filtros
   - Perfil de usuario editable

## Instalación y Ejecución

```bash
# Clonar repositorio
git clone https://github.com/armandoricosandoval@gamil.com/sistema-academico.git
cd sistema-academico

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── auth/            # Autenticación
│   ├── dashboard/       # Dashboard principal
│   ├── layout/          # Componentes de layout
│   ├── students/        # Gestión de estudiantes
│   ├── subjects/        # Gestión de materias
│   └── ui/              # Componentes UI reutilizables
├── routes/              # Configuración de rutas
├── layouts/             # Layouts de aplicación
├── store/               # Redux store y slices
├── services/            # Servicios de Firebase
├── types/               # Tipos TypeScript
└── utils/               # Utilidades generales
```

## Características Técnicas Destacadas

1. **Tiempo Real**
   - Suscripciones a Firestore para actualización en tiempo real
   - Sincronización entre múltiples clientes

2. **Optimización de Rendimiento**
   - Memoización de componentes y selectores
   - Lazy loading de rutas
   - Code splitting

3. **Manejo de Estado**
   - Estado global con Redux Toolkit
   - Estado local con React Hooks
   - Persistencia con Redux Persist

4. **Validaciones**
   - Validación de formularios con Zod
   - Validaciones de negocio en tiempo real
   - Feedback visual de errores

5. **Seguridad**
   - Reglas de seguridad en Firestore
   - Autenticación segura con Firebase
   - Protección de rutas en frontend

## Implementaciones Técnicas Avanzadas

### Enrutamiento y Navegación
- Implementación de React Router v6 con rutas protegidas
- Navegación programática con `useNavigate`
- Layouts anidados para estructura consistente

### Gestión de Estado Global
- Slices de Redux para modularidad
- Thunks para operaciones asíncronas
- Selectores memoizados para rendimiento

### Integración con Firebase
- Servicios modulares para cada entidad
- Suscripciones en tiempo real
- Manejo de errores y reintentos

### Componentes Reutilizables
- Implementación de Shadcn/ui para consistencia
- Componentes de UI personalizados
- Patrones de composición

## Despliegue

Para instrucciones detalladas sobre cómo desplegar la aplicación, consulta la [Guía de Despliegue](./DEPLOYMENT.md).

Opciones disponibles:
- Firebase Hosting (recomendado para producción)
- GitHub Pages (recomendado para demo)

## Contacto

**Armando Rico** - [armandoricosandoval@gmail.com](mailto:armandoricosandoval@gmail.com)