# Estructura del Proyecto React con React Router y Redux

## Estructura de Carpetas

```
src/
├── components/         # Componentes de la aplicación
│   ├── auth/           # Componentes de autenticación
│   ├── dashboard/      # Componentes del dashboard
│   ├── layout/         # Componentes de layout
│   ├── students/       # Componentes relacionados con estudiantes
│   ├── subjects/       # Componentes relacionados con materias
│   └── ui/             # Componentes de UI reutilizables
├── hooks/              # Custom hooks
├── layouts/            # Layouts de la aplicación
├── lib/                # Utilidades y funciones
├── pages/              # Páginas principales
├── routes/             # Configuración de rutas
├── services/           # Servicios de API/Firebase
├── store/              # Configuración de Redux
│   ├── hooks.ts        # Hooks para Redux
│   ├── index.ts        # Configuración del store
│   ├── Provider.tsx    # Provider de Redux
│   └── slices/         # Slices de Redux
├── types/              # Tipos TypeScript
└── utils/              # Utilidades generales
```

## Navegación y Enrutamiento

La aplicación utiliza React Router v6 para la navegación. La estructura de enrutamiento está organizada de la siguiente manera:

1. **AppRouter.tsx**: Maneja las rutas autenticadas de la aplicación.
2. **AuthRouter.tsx**: Maneja las rutas de autenticación (login/registro).
3. **MainLayout.tsx**: Layout principal para las páginas autenticadas.

## Flujo de Navegación

1. El usuario accede a la aplicación.
2. Si no está autenticado, se muestra el `AuthRouter` con la página de login.
3. Al autenticarse, se redirige al `AppRouter` dentro del `MainLayout`.
4. El usuario puede navegar entre las diferentes secciones usando los enlaces del sidebar o los botones de navegación.

## Mejores Prácticas Implementadas

1. **Separación de Responsabilidades**: 
   - Componentes para UI
   - Layouts para estructura
   - Routers para navegación
   - Servicios para lógica de negocio

2. **Navegación Declarativa**:
   - Uso de `useNavigate` en lugar de funciones de navegación imperativas
   - Redirecciones con `<Navigate>` para casos especiales

3. **Protección de Rutas**:
   - Verificación de autenticación en los routers
   - Redirección automática para usuarios no autenticados

4. **Estado Global**:
   - Redux para estado global de la aplicación
   - Estado local para componentes específicos

5. **Carga de Datos**:
   - Carga de datos al montar componentes
   - Actualización en tiempo real con suscripciones a Firebase

## Uso de React Router

### Navegación Programática

```jsx
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/ruta-destino');
  };
  
  return <button onClick={handleClick}>Ir a Destino</button>;
};
```

### Navegación Declarativa

```jsx
import { Link } from 'react-router-dom';

const MyComponent = () => {
  return <Link to="/ruta-destino">Ir a Destino</Link>;
};
```

### Parámetros de Ruta

```jsx
// Definición de ruta
<Route path="/estudiante/:id" element={<StudentDetail />} />

// Uso en componente
import { useParams } from 'react-router-dom';

const StudentDetail = () => {
  const { id } = useParams();
  // Usar el ID para cargar datos
};
```

## Mantenimiento

Para mantener este proyecto:

1. **Agregar Nuevas Rutas**:
   - Añadir la ruta en el router correspondiente (AppRouter o AuthRouter)
   - Crear el componente en la carpeta adecuada

2. **Agregar Nuevas Funcionalidades**:
   - Crear los componentes necesarios
   - Actualizar los slices de Redux si es necesario
   - Implementar los servicios correspondientes

3. **Modificar el Layout**:
   - Editar MainLayout.tsx para cambios en el layout principal
   - Actualizar AppSidebar.tsx para cambios en la barra lateral
