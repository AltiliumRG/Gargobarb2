-- ============================================================
-- 🚀 GargoBarb - Script de Migración Completa de Base de Datos
-- ============================================================
-- Versión: 2.0 (con módulo e-commerce y logística)
-- Fecha:   2025-04
--
-- INSTRUCCIONES:
--   1. Crea la base de datos manualmente o usa el CREATE DATABASE de abajo.
--   2. Ejecuta este script completo en MySQL Workbench o con:
--        mysql -u root -p gargobarb < migration.sql
--   3. Configura tu .env con las credenciales correctas.
-- ============================================================

-- -------------------------------------------
-- 1. BASE DE DATOS
-- -------------------------------------------
CREATE DATABASE IF NOT EXISTS gargobarb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gargobarb;

-- -------------------------------------------
-- 2. USUARIOS
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id              INT             NOT NULL AUTO_INCREMENT,
  username        VARCHAR(255)    NOT NULL UNIQUE,
  full_name       VARCHAR(255)    NULL,
  phone           VARCHAR(20)     NULL,
  email           VARCHAR(255)    NOT NULL UNIQUE,
  password_hash   VARCHAR(255)    NULL,
  role_id         INT             NOT NULL DEFAULT 3,   -- 1=admin, 2=barbero, 3=cliente
  avatar_url      VARCHAR(255)    NULL,
  refresh_token_hash VARCHAR(64)  NULL,
  reset_code      VARCHAR(6)      NULL,
  reset_code_expires DATETIME     NULL,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- 3. BARBERÍAS
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS barbershops (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED NOT NULL,
  name        VARCHAR(150)    NOT NULL,
  slug        VARCHAR(160)    NOT NULL UNIQUE,
  country     VARCHAR(100)    NOT NULL DEFAULT 'Colombia',
  department  VARCHAR(100)    NULL,
  city        VARCHAR(100)    NOT NULL,
  address     VARCHAR(255)    NOT NULL,
  latitude    DECIMAL(10,8)   NULL,
  longitude   DECIMAL(11,8)   NULL,
  is_active   TINYINT(1)      NOT NULL DEFAULT 1,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_barbershops_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- 4. SERVICIOS
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  barbershop_id   BIGINT UNSIGNED NOT NULL,
  name            VARCHAR(100)    NOT NULL,
  description     TEXT            NULL,
  price           DECIMAL(10,2)   NOT NULL,
  image           VARCHAR(255)    NULL,
  duration_minutes INT            NOT NULL,
  is_active       TINYINT(1)      NOT NULL DEFAULT 1,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_services_barbershop
    FOREIGN KEY (barbershop_id) REFERENCES barbershops(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- 5. CITAS
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS appointments (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id         BIGINT UNSIGNED NOT NULL,
  barbershop_id   BIGINT UNSIGNED NOT NULL,
  service_id      BIGINT UNSIGNED NOT NULL,
  date            DATE            NOT NULL,
  time            TIME            NOT NULL,
  status          ENUM('pendiente','confirmada','cancelada','completada') NOT NULL DEFAULT 'pendiente',
  notes           VARCHAR(255)    NULL,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_appts_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_appts_barbershop
    FOREIGN KEY (barbershop_id) REFERENCES barbershops(id) ON DELETE CASCADE,
  CONSTRAINT fk_appts_service
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- 6. VENTAS (Registro POS del barbero)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS sales (
  id              BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  barbershop_id   BIGINT UNSIGNED  NOT NULL,
  service_id      BIGINT UNSIGNED  NOT NULL,
  barber_id       INT              NOT NULL,
  client_name     VARCHAR(255)     NOT NULL,
  date            DATE             NOT NULL,
  time            TIME             NOT NULL,
  price           DECIMAL(10,2)    NOT NULL,
  payment_method  ENUM('efectivo','tarjeta','transferencia') NOT NULL DEFAULT 'efectivo',
  status          ENUM('completada','cancelada','reembolsada') NOT NULL DEFAULT 'completada',
  created_at      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_sales_barbershop
    FOREIGN KEY (barbershop_id) REFERENCES barbershops(id) ON DELETE CASCADE,
  CONSTRAINT fk_sales_service
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  CONSTRAINT fk_sales_barber
    FOREIGN KEY (barber_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- 7. HORARIOS DE BARBERÍA
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS barber_schedules (
  id              INT             NOT NULL AUTO_INCREMENT,
  barbershop_id   BIGINT UNSIGNED NOT NULL,
  day             VARCHAR(20)     NOT NULL,  -- monday, tuesday, etc
  open_time       TIME            NOT NULL,
  close_time      TIME            NOT NULL,
  is_closed       TINYINT(1)      NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  CONSTRAINT fk_schedule_barbershop
    FOREIGN KEY (barbershop_id) REFERENCES barbershops(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- 8. PRODUCTOS (Tienda del barbero)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS carrito_de_compras (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  barbershop_id   BIGINT UNSIGNED NOT NULL,
  name            VARCHAR(150)    NOT NULL,
  price           DECIMAL(10,2)   NOT NULL,
  description     TEXT            NULL,
  image           VARCHAR(255)    NULL,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_products_barbershop
    FOREIGN KEY (barbershop_id) REFERENCES barbershops(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- 9. CARRITOS (Sesiones de compra temporales)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS shopping_carts (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  site_id         BIGINT UNSIGNED NOT NULL,
  client_name     VARCHAR(255)    NOT NULL,
  client_phone    VARCHAR(50)     NULL,
  items           JSON            NOT NULL,
  total           DECIMAL(10,2)   NOT NULL,
  status          ENUM('pending','completed','cancelled') NOT NULL DEFAULT 'pending',
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- 10. ÓRDENES (Compras completadas - E-Commerce)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  site_id             BIGINT UNSIGNED NOT NULL,
  client_name         VARCHAR(255)    NOT NULL,
  client_email        VARCHAR(255)    NULL,
  client_phone        VARCHAR(50)     NULL,
  items               JSON            NOT NULL,
  total               DECIMAL(12,2)   NOT NULL,
  payment_method      ENUM('card','transfer','nequi','efectivo') NOT NULL,
  transaction_ref     VARCHAR(100)    NULL,
  status              ENUM('pending','completed','cancelled','refunded') NOT NULL DEFAULT 'completed',
  shipping_address    TEXT            NULL,
  shipping_status     ENUM('pending','processing','shipped','delivered') NOT NULL DEFAULT 'pending',
  customer_report     TEXT            NULL,
  report_status       ENUM('none','reported','resolved') NOT NULL DEFAULT 'none',
  notes               TEXT            NULL,
  created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_orders_site
    FOREIGN KEY (site_id) REFERENCES barbershop_sites(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- 11. SITIOS WEB (Builder visual del barbero)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS barbershop_sites (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  barbershop_id   BIGINT UNSIGNED NOT NULL,
  slug            VARCHAR(150)    NOT NULL UNIQUE,
  template        VARCHAR(100)    NOT NULL,
  primary_color   VARCHAR(20)     NOT NULL DEFAULT '#000000',
  secondary_color VARCHAR(20)     NOT NULL DEFAULT '#ffffff',
  font_family     VARCHAR(100)    NOT NULL DEFAULT 'Roboto',
  status          ENUM('draft','published') NOT NULL DEFAULT 'draft',
  is_visible      TINYINT(1)      NOT NULL DEFAULT 1,
  is_published    TINYINT(1)      NOT NULL DEFAULT 0,
  payment_method  ENUM('card','transfer','nequi','efectivo') NULL DEFAULT NULL,
  payment_data    JSON            NULL,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_sites_barbershop
    FOREIGN KEY (barbershop_id) REFERENCES barbershops(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- 12. PÁGINAS DEL SITIO
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS site_pages (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  site_id     BIGINT UNSIGNED NOT NULL,
  title       VARCHAR(150)    NOT NULL,
  slug        VARCHAR(150)    NOT NULL,
  order_index INT             NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  CONSTRAINT fk_pages_site
    FOREIGN KEY (site_id) REFERENCES barbershop_sites(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- 13. SECCIONES DEL SITIO
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS site_sections (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  page_id     BIGINT UNSIGNED NOT NULL,
  type        ENUM('hero','services','gallery','about','testimonials','contact','carrito','custom') NOT NULL,
  order_index INT             NOT NULL DEFAULT 0,
  content     JSON            NOT NULL,
  styles      JSON            NULL,
  is_visible  TINYINT(1)      NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  CONSTRAINT fk_sections_page
    FOREIGN KEY (page_id) REFERENCES site_pages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- ✅ FIN DE MIGRACIÓN
-- Todas las tablas fueron creadas exitosamente.
-- ============================================================
