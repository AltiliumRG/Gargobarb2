-- ============================================================
-- 🗄️ SCRIPT DE CREACIÓN DE BASE DE DATOS - GARGOBARB
-- Generado automáticamente basado en los modelos actuales
-- Fecha: 2026-03-13
-- ============================================================

CREATE DATABASE IF NOT EXISTS gargobarb;--crear db
USE gargobarb;

-- Desactivar llaves foráneas para facilitar la creación
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 1. TABLA DE ROLES
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

INSERT INTO roles (id, name) VALUES 
(1, 'admin'), 
(2, 'barber'), 
(3, 'client') 
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ============================================================
-- 2. TABLA DE USUARIOS (users)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    role_id INT NOT NULL DEFAULT 3,
    avatar_url VARCHAR(255),
    refresh_token_hash VARCHAR(255),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 3. TABLA DE BARBERÍAS (barbershops)
-- ============================================================
CREATE TABLE IF NOT EXISTS barbershops (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(160) NOT NULL UNIQUE,
    country VARCHAR(100) NOT NULL DEFAULT 'Colombia',
    department VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 4. TABLA DE SERVICIOS (services)
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    barbershop_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255),
    duration_minutes INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (barbershop_id) REFERENCES barbershops(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 5. TABLA DE CITAS (appointments)
-- ============================================================
CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    barbershop_id BIGINT UNSIGNED NOT NULL,
    service_id BIGINT UNSIGNED NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status ENUM('pendiente', 'confirmada', 'cancelada', 'completada') DEFAULT 'pendiente',
    notes VARCHAR(255),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (barbershop_id) REFERENCES barbershops(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 6. TABLA DE SITIOS WEB (barbershop_sites)
-- ============================================================
CREATE TABLE IF NOT EXISTS barbershop_sites (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    barbershop_id BIGINT UNSIGNED NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    template VARCHAR(100) NOT NULL,
    primary_color VARCHAR(20) DEFAULT '#000000',
    secondary_color VARCHAR(20) DEFAULT '#ffffff',
    font_family VARCHAR(100) DEFAULT 'Roboto',
    status ENUM('draft', 'published') DEFAULT 'draft',
    is_visible BOOLEAN DEFAULT TRUE,
    is_published BOOLEAN DEFAULT FALSE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (barbershop_id) REFERENCES barbershops(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 7. TABLA DE PÁGINAS DE SITIO (site_pages)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_pages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    site_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    order_index INT DEFAULT 0,
    FOREIGN KEY (site_id) REFERENCES barbershop_sites(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 8. TABLA DE SECCIONES DE SITIO (site_sections)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_sections (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    page_id BIGINT UNSIGNED NOT NULL,
    type ENUM('hero', 'services', 'gallery', 'about', 'testimonials', 'contact', 'cart', 'custom') NOT NULL,
    order_index INT DEFAULT 0,
    content JSON NOT NULL,
    styles JSON,
    is_visible BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (page_id) REFERENCES site_pages(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 8.5. TABLA DE CARRITOS DE COMPRA (shopping_carts)
-- ============================================================
CREATE TABLE IF NOT EXISTS shopping_carts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    site_id BIGINT UNSIGNED NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50),
    items JSON NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (site_id) REFERENCES barbershop_sites(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 9. TABLA DE HORARIOS (barber_schedules)
-- ============================================================
CREATE TABLE IF NOT EXISTS barber_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    barbershop_id BIGINT UNSIGNED NOT NULL,
    day VARCHAR(50) NOT NULL,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_closed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (barbershop_id) REFERENCES barbershops(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 10. TABLA DE VENTAS (sales)
-- ============================================================
CREATE TABLE IF NOT EXISTS sales (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    barbershop_id BIGINT UNSIGNED NOT NULL,
    service_id BIGINT UNSIGNED NOT NULL,
    barber_id BIGINT UNSIGNED NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('efectivo', 'tarjeta', 'transferencia') NOT NULL DEFAULT 'efectivo',
    status ENUM('completada', 'cancelada', 'reembolsada') DEFAULT 'completada',
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (barbershop_id) REFERENCES barbershops(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (barber_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Reactivar llaves foráneas
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 🧪 DATOS DE PRUEBA (Test Data)
-- ============================================================

INSERT INTO users (username, full_name, email, password_hash, role_id, created_at, updated_at) VALUES 
('admin_test', 'Administrador de Pruebas', 'admin@gargobarb.com', '$2y$10$YourHashedPasswordHere', 1, NOW(), NOW()),
('barber_test', 'Barbero de Pruebas', 'barber@gargobarb.com', '$2y$10$YourHashedPasswordHere', 2, NOW(), NOW()),
('client_test', 'Cliente de Pruebas', 'client@gargobarb.com', '$2y$10$YourHashedPasswordHere', 3, NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at=NOW();
