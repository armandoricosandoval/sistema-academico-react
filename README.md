# 🎓 Sistema Académico - Prueba Técnica

Un sistema completo de gestión académica desarrollado con **React**, **TypeScript**, **Redux Toolkit** y **Firebase**.

## ✨ Características Principales

### 🔐 Autenticación y Usuarios
- **Registro e inicio de sesión** con Firebase Authentication
- **Perfiles de estudiantes** personalizables
- **Gestión de sesiones** persistente con Redux Persist

### 📚 Gestión de Materias
- **Selección de materias** con validaciones de negocio
- **Límite de 3 materias** por semestre
- **Límite de 15 créditos** por semestre
- **Validación de profesores** (no duplicados)
- **Persistencia en Firebase** en tiempo real

### 👨‍🏫 Gestión de Profesores
- **Asignación de materias** a profesores
- **Límite de 2 materias** por profesor
- **Validaciones de capacidad** y disponibilidad

### 📊 Dashboard Inteligente
- **Estadísticas en tiempo real** desde Firebase
- **Progreso académico** del estudiante
- **Navegación fluida** entre componentes
- **Información actualizada** automáticamente

## 🚀 Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Estado**: Redux Toolkit + Redux Persist
- **UI**: Shadcn/ui + Tailwind CSS
- **Backend**: Firebase (Auth + Firestore)
- **Rutas**: React Router DOM
- **Build**: Vite

## 📋 Requisitos del Sistema

### Funcionalidades Implementadas
1. ✅ **CRUD de registro en línea** para usuarios
2. ✅ **Programa de créditos** con límites estrictos
3. ✅ **10 materias** disponibles (3 créditos cada una)
4. ✅ **Límite de 3 materias** por estudiante
5. ✅ **5 profesores** con máximo 2 materias cada uno
6. ✅ **Validación de profesores** únicos por estudiante
7. ✅ **Visualización de registros** de otros estudiantes
8. ✅ **Información de compañeros** por materia

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio-github>
cd pruebatecnica_master_inter
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Firebase
Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

### 5. Construir para producción
```bash
npm run build
```

## 🔧 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── auth/           # Autenticación
│   ├── dashboard/      # Panel principal
│   ├── layout/         # Layout y navegación
│   ├── students/       # Gestión de estudiantes
│   └── subjects/       # Gestión de materias
├── store/              # Redux Store
│   ├── slices/         # Slices de Redux
│   └── hooks.ts        # Hooks personalizados
├── services/           # Servicios de Firebase
├── types/              # Tipos TypeScript
└── utils/              # Utilidades
```

## 📱 Funcionalidades del Usuario

### 🎯 Dashboard Principal
- **Resumen académico** personalizado
- **Estadísticas del sistema** en tiempo real
- **Acceso rápido** a todas las funciones

### 📚 Selección de Materias
- **Catálogo completo** de materias disponibles
- **Validaciones automáticas** de límites
- **Persistencia inmediata** en Firebase
- **Feedback visual** de estado y errores

### 👤 Mi Perfil
- **Información personal** editable
- **Progreso académico** actualizado
- **Historial de materias** y profesores

### 📖 Mis Materias
- **Lista detallada** de materias inscritas
- **Información de profesores** asignados
- **Prerrequisitos** y horarios
- **Estadísticas de créditos** con progreso

## 🔒 Validaciones de Negocio

### 📊 Límites Académicos
- **Máximo 3 materias** por semestre
- **Máximo 15 créditos** por semestre
- **No profesor duplicado** en materias
- **Capacidad disponible** en materias

### ✅ Reglas de Validación
- **Verificación de prerrequisitos** antes de inscripción
- **Validación de capacidad** de materias
- **Control de profesores** disponibles
- **Sincronización automática** con Firebase

## 🌐 Despliegue

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Netlify
```bash
npm run build
# Subir carpeta dist/ a Netlify
```

### Vercel
```bash
npm install -g vercel
vercel
```

## 📊 Estado del Proyecto

- **✅ Completado**: 100%
- **🔧 Funcional**: Sistema completo
- **📱 Responsive**: Diseño adaptativo
- **🔒 Seguro**: Validaciones robustas
- **⚡ Rápido**: Optimizado con Vite

## 🤝 Contribución

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Tu Nombre** - [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com)

## 🙏 Agradecimientos

- **Shadcn/ui** por los componentes de UI
- **Firebase** por el backend robusto
- **Redux Toolkit** por el manejo de estado
- **Vite** por la herramienta de build rápida

---

⭐ **Si te gusta este proyecto, dale una estrella en GitHub!**
