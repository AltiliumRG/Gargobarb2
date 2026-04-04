# Especificación de Requisitos (SRS) - Gargobarb

## 🔑 Funcionalidades del Sistema

### 🛒 Rol: Dueño de Barbería
1. **Registro e Inicio de Sesión:** Autenticación local y Google OAuth.
2. **Asistente (Wizard):** Registro de negocio con nombre, dirección (Google Places) y geolocalización automática.
3. **Gestión de Servicios:** Crear, editar y eliminar cortes de cabello, precios y duraciones.
4. **Editor Visual (Site Builder):** Personalización de plantillas web, colores de marca y tipografías.
5. **Panel de Estadísticas:** Visualización selectiva de visitas y citas agendadas.
6. **Gestión de Agenda:** Visualización clara de citas diarias y estado del negocio.

### 👤 Rol: Cliente
1. **Búsqueda de Barberías:** Listado dinámico de locales cercanos.
2. **Perfil del Local:** Ver servicios disponibles, galería de fotos y contacto.
3. **Citas Offline/Online:** Posibilidad de contactar vía WhatsApp o agendar directamente en la plataforma.
4. **Seguridad de Cuenta:** Cambio de contraseña y gestión de perfil personal.

## ⚙️ Requisitos No Funcionales
- **Seguridad (Auth):** Protección de rutas privadas mediante middleware de JWT.
- **Rendimiento:** Carga diferida de imágenes y optimización de assets con Vite.
- **Disponibilidad:** Base de datos SQL con integridad referencial.
- **UI/UX:** Diseño responsivo para pantallas móviles y tablets.
- **Escalabilidad:** Estructura modular de modelos para añadir nuevas tablas (Reseñas, Pagos, etc.) sin romper el sistema actual.
