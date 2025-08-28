# Guía de Despliegue

## Opción 1: Despliegue en Firebase Hosting

### 1. Preparación Inicial

```bash
# Instalar Firebase CLI globalmente
npm install -g firebase-tools

# Iniciar sesión en Firebase
firebase login
```

### 2. Configurar el Proyecto

```bash
# Inicializar Firebase en el proyecto
firebase init

# Seleccionar las siguientes opciones:
# - Hosting: Configure files for Firebase Hosting
# - Use an existing project (seleccionar tu proyecto)
# - Build directory: dist
# - Single-page app: Yes
# - GitHub Actions: No (por ahora)
```

### 3. Construir y Desplegar

```bash
# Construir el proyecto
npm run build

# Desplegar a Firebase
firebase deploy
```

### 4. Configuración de Firebase.json
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## Opción 2: Despliegue en GitHub Pages

### 1. Preparación del Repositorio

```bash
# Asegurarse de que el repositorio está actualizado
git add .
git commit -m "Preparación para despliegue"
git push origin main
```

### 2. Configurar vite.config.ts
```typescript
export default defineConfig({
  base: '/nombre-del-repositorio/',  // Importante para GitHub Pages
  // ... resto de la configuración
})
```

### 3. Instalar gh-pages

```bash
# Instalar gh-pages como dependencia de desarrollo
npm install --save-dev gh-pages
```

### 4. Agregar Scripts en package.json

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 5. Desplegar

```bash
# Ejecutar el despliegue
npm run deploy
```

### 6. Configurar GitHub Pages

1. Ir a Settings del repositorio
2. Navegar a Pages
3. Seleccionar branch gh-pages
4. Guardar cambios

## Consideraciones Importantes

### Para Firebase Hosting:

1. **Variables de Entorno**:
   - Crear `.env.production` con las variables necesarias
   - Asegurarse de que las variables estén configuradas en Firebase

2. **Reglas de Seguridad**:
   ```javascript
   // firestore.rules
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

3. **Caché y Performance**:
   ```json
   {
     "hosting": {
       "headers": [
         {
           "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
           "headers": [
             {
               "key": "Cache-Control",
               "value": "max-age=31536000"
             }
           ]
         }
       ]
     }
   }
   ```

### Para GitHub Pages:

1. **Router Base URL**:
   ```typescript
   import { createBrowserRouter } from 'react-router-dom';

   const router = createBrowserRouter(routes, {
     basename: import.meta.env.DEV ? '/' : '/nombre-del-repositorio'
   });
   ```

2. **Assets y Rutas**:
   - Usar rutas relativas para assets
   - Actualizar imports para que funcionen con el base path

3. **404 Handling**:
   - Crear un archivo 404.html en /public
   - Configurar redirección a index.html

## Verificación Post-Despliegue

1. **Verificar Rutas**:
   - Probar navegación
   - Verificar rutas protegidas
   - Comprobar redirecciones

2. **Verificar Funcionalidad**:
   - Probar autenticación
   - Verificar conexión con Firebase
   - Comprobar actualizaciones en tiempo real

3. **Verificar Performance**:
   - Usar Lighthouse para auditar
   - Verificar tiempos de carga
   - Comprobar optimización de assets

## URLs de Acceso

- Firebase: `https://[PROJECT-ID].web.app`
- GitHub Pages: `https://[USERNAME].github.io/[REPO-NAME]`
