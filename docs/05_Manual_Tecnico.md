# Manual Técnico - Gargobarb 

## 🏗 Arquitectura del Sistema
Gargobarb utiliza una arquitectura de **Cliente-Servidor** moderna basada en componentes y microservicios.

### 🛡 Capas de Aplicación
1. **Frontend (React/Vite):** Gestión de interfaces con **Tailwind CSS** para un diseño responsivo.
2. **Backend (Node.js/Express):** Servidor API que gestiona la lógica de negocio.
3. **Persistencia (MySQL):** Base de datos para almacenamiento robusto.

## ⚙️ Configuración del Entorno (.env)
Es vital contar con los archivos `.env` en las carpetas respectivas:

### Backend
- `DB_HOST`: Host de la base de datos (localhost).
- `DB_USER`: Usuario (root).
- `DB_PASS`: Contraseña de base de datos.
- `DB_NAME`: gargobarb_db.
- `JWT_SECRET`: Llave secreta para tokens.

### Frontend
- `VITE_API_BASE_URL`: URL del servidor backend.
- `VITE_GOOGLE_MAPS_API_KEY`: Llave de Google Cloud Console.

## 🚀 Despliegue en Local
1. **Instalación:** Ejecutar `npm install` tanto en el directorio `backend` como en `frontend`.
2. **Preparación DB:** Importar el archivo `gargobarb_db.sql` en MySQL (XAMPP/MySQL Workbench).
3. **Arranque:**
   - Backend: `npm run dev` (Puerto 4000).
   - Frontend: `npm run dev` (Puerto 5173).

## 📂 Organización de Carpetas
- `src/context/`: Estados globalescompartidos (Auth, Wizard, Builder).
- `src/components/`: Piezas de UI reutilizables y modulares.
- `src/routes/`: Definición de navegación y navegación protegida (PrivateRoutes).
- `src/api/`: Configuración centralizada de llamadas Axios.
