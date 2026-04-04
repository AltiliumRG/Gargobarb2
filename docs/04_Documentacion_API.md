# Documentación de API - Gargobarb 

## 🌐 Endpoints RESTful
El backend de Gargobarb utiliza una API REST modularizada por recursos para mayor claridad y sencillez.

### 🔐 Autenticación
- **POST `/api/auth/register`:** Registro de nuevos usuarios (Barberos/Clientes).
- **POST `/api/auth/login`:** Acceso local con correo y contraseña.
- **POST `/api/auth/google`:** Acceso mediante Google OAuth.
- **POST `/api/auth/logout`:** Cierre de sesión (invalidación de cookies).

### ✂️ Barberías y Gestión
- **GET `/api/barbershops`:** Obtener listado público de barberías.
- **POST `/api/barbershops`:** Registro de una nueva barbería (Uso del Wizard).
- **GET `/api/barbershops/:id`:** Información detallada de un local.
- **GET `/api/barbershops/public/:slug`:** Cargar sitio dinámico por URL amigable.

### 📅 Citas y Servicios
- **GET `/api/services/barbershop/:id`:** Listado de servicios de una barbería.
- **POST `/api/appointments`:** Crear una nueva reserva de cita.
- **PATCH `/api/appointments/:id`:** Cancelar o reprogramar citas.

### 🖼️ Editor Visual (Site Builder)
- **POST `/api/sites`:** Guardar cambios en el diseño web.
- **POST `/api/upload`:** Subir imágenes de galería y logos (Multer).
- **GET `/api/templates`:** Obtener diseños predefinidos.

### 🗺 Geografía (Geo)
- **GET `/api/geo/departments`:** Lista de departamentos para el registro de ubicación.
- **GET `/api/geo/cities/:id`:** Lista de ciudades por departamento.
