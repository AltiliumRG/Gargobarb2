# Modelo de Base de Datos - Gargobarb 

## 📊 Arquitectura de Datos (ERD Simple)
Gargobarb utiliza una base de datos relacional **MySQL** gestionada mediante **Sequelize ORM**. El esquema está diseñado para integridad referencial y alto desempeño.

### 🗄 Tablas Principales

| Tabla | Propósito | Campos Clave |
| :--- | :--- | :--- |
| **Users** | Datos de acceso y perfiles | `id`, `full_name`, `email`, `role_id`, `password` |
| **Barbershops** | Identidad del negocio | `id`, `owner_id`, `name`, `city`, `address`, `lat`, `lng` |
| **BarbershopSchedules** | Horarios de atención | `id`, `barbershop_id`, `day_of_week`, `start_time`, `end_time` |
| **BarbershopSites** | Configuración del editor | `id`, `barbershop_id`, `slug`, `theme`, `template`, `colors` |
| **SiteSections** | Bloques dinámicos web | `id`, `site_id`, `type`, `order`, `content_json` |
| **Services** | Catálogo de barbería | `id`, `barbershop_id`, `name`, `price`, `duration` |
| **Appointments** | El corazón operativo | `id`, `client_id`, `barbershop_id`, `service_id`, `date`, `status` |
| **Products** | Tienda integrada | `id`, `barbershop_id`, `name`, `stock`, `price`, `image_url` |
| **Sales** | Histórico financiero | `id`, `barbershop_id`, `total`, `payment_method`, `date` |

### 🔗 Relaciones Críticas
- **Barbershop - Site:** Una barbería tiene un único sitio web personalizado (1:1).
- **Barbershop - Sections:** Un sitio web tiene múltiples secciones dinámicas (1:N).
- **User - Appointments:** Un usuario puede agendar múltiples citas (1:N).
- **Barbershop - Services:** Una barbería ofrece múltiples servicios (1:N).
