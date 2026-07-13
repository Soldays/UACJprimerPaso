-- schema.sql
-- Modelo de datos para el Portal UACJ (Etapa 1 + Etapa 2)
-- Ejecutar con: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS uacj_portal
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE uacj_portal;

-- ==========================================
-- ETAPA 1: contenido público informativo
-- ==========================================

CREATE TABLE IF NOT EXISTS fechas_clave (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    categoria ENUM('registro', 'examen', 'resultados') NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NULL,
    descripcion VARCHAR(255) NULL
);

CREATE TABLE IF NOT EXISTS guia_videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paso INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NULL,
    video_url VARCHAR(255) NULL,
    requisitos_json JSON NULL,
    orden INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS requisitos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    info VARCHAR(255) NULL,
    obligatorio BOOLEAN NOT NULL DEFAULT TRUE
);

-- ==========================================
-- ETAPA 2: portal de aspirantes ya aceptados
-- ==========================================

CREATE TABLE IF NOT EXISTS salon (
    id INT AUTO_INCREMENT PRIMARY KEY,
    edificio VARCHAR(50) NULL, -- ej. "Edificio V" (esto identifica al salón, NUNCA se pone en id)
    planta VARCHAR(50) NULL,
    foto MEDIUMBLOB NULL -- la foto se sube directo en phpMyAdmin (botón "Examinar")
);

CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    matricula VARCHAR(50) NOT NULL UNIQUE,
    contrasena_hash VARCHAR(255) NOT NULL,
    numero_creditos INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS materia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    horario VARCHAR(100) NOT NULL,
    maestro VARCHAR(150) NOT NULL,
    salon_id INT NULL,
    FOREIGN KEY (salon_id) REFERENCES salon(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS usuario_materia (
    usuario_id INT NOT NULL,
    materia_id INT NOT NULL,
    PRIMARY KEY (usuario_id, materia_id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (materia_id) REFERENCES materia(id) ON DELETE CASCADE
);

-- Día y hora exactos en los que da clase una materia (una fila por cada
-- día que se reúne, así una materia que es Lunes/Miércoles/Viernes
-- tiene 3 filas aquí). Esto es lo que se usa para llenar la plantilla
-- de horario en la celda correcta (día + hora).
CREATE TABLE IF NOT EXISTS materia_horario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    materia_id INT NOT NULL,
    dia ENUM('LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB') NOT NULL,
    hora_inicio VARCHAR(10) NOT NULL, -- debe ser el inicio exacto de una franja, ej. '7:00'
    FOREIGN KEY (materia_id) REFERENCES materia(id) ON DELETE CASCADE
);

-- Contenido de la pantalla "¿Cómo elegir tus materias?" (tabs Guía / Tips / Videos)
CREATE TABLE IF NOT EXISTS materias_tips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('guia', 'tip', 'video') NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descripcion VARCHAR(255) NULL,
    video_url VARCHAR(255) NULL,
    duracion VARCHAR(20) NULL,
    orden INT NOT NULL DEFAULT 0
);

-- Tips que se muestran junto a la plantilla de horario (pantalla "Organiza tu horario")
CREATE TABLE IF NOT EXISTS horarios_tips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    texto VARCHAR(255) NOT NULL,
    orden INT NOT NULL DEFAULT 0
);

-- ==========================================
-- DATOS DE EJEMPLO (Etapa 1)
-- ==========================================

INSERT INTO fechas_clave (titulo, categoria, fecha_inicio, fecha_fin, descripcion) VALUES
('Registro de aspirantes', 'registro', '2026-05-20', '2026-06-15', 'Del 20 de mayo al 15 de junio'),
('Examen de admisión', 'examen', '2026-06-25', NULL, '25 de junio, sede principal'),
('Publicación de resultados', 'resultados', '2026-07-10', NULL, '10 de julio en el portal');

INSERT INTO guia_videos (paso, titulo, descripcion, video_url, requisitos_json, orden) VALUES
(1, 'Registro', 'Crea tu cuenta en el portal de aspirantes y llena tus datos personales.', NULL, '["Correo electrónico vigente", "CURP"]', 1),
(2, 'Documentos', 'Sube la documentación requerida en formato PDF.', NULL, '["Acta de nacimiento", "Certificado de bachillerato"]', 2),
(3, 'Pago', 'Realiza el pago de la ficha de admisión.', NULL, '["Referencia bancaria", "Comprobante de pago"]', 3);

INSERT INTO requisitos (nombre, info, obligatorio) VALUES
('Acta de nacimiento', 'Documento original', TRUE),
('CURP', 'Ver ejemplo', TRUE),
('Certificado de bachillerato', 'Con promedio mínimo requerido', TRUE);

-- ==========================================
-- USUARIO DE PRUEBA (Etapa 2)
-- Matrícula: 12345678
-- Contraseña: alumno123   (guardada aquí ya encriptada, nunca en texto plano)
-- ==========================================

INSERT INTO usuario (nombre, matricula, contrasena_hash, numero_creditos) VALUES
('Ana García Pérez', '12345678', '$2a$10$t3Ja9ts5JOZhAO6SwBc9buYAJPMvSkREdmagxuKbpv1oklByX7sUq', 48);

INSERT INTO salon (edificio, planta) VALUES
('Edificio V', 'Planta alta');

INSERT INTO materia (nombre, horario, maestro, salon_id) VALUES
('Cálculo I', 'Lun-Mie-Vie 8:00-9:00', 'Juan Pérez', LAST_INSERT_ID());

SET @materia_calculo = LAST_INSERT_ID();

INSERT INTO materia_horario (materia_id, dia, hora_inicio) VALUES
(@materia_calculo, 'LUN', '8:00'),
(@materia_calculo, 'MIE', '8:00'),
(@materia_calculo, 'VIE', '8:00');

INSERT INTO usuario_materia (usuario_id, materia_id) VALUES
(1, @materia_calculo);

INSERT INTO materias_tips (tipo, titulo, descripcion, video_url, duracion, orden) VALUES
('video', 'Cómo leer el mapa curricular de tu carrera', NULL, NULL, '2:45 min', 1),
('tip', 'Consulta los posibles horarios en la página de la UACJ antes de inscribirte', NULL, NULL, NULL, 2),
('tip', 'Busca la oferta descriptiva de cada materia para saber qué incluye', NULL, NULL, NULL, 3),
('tip', 'Cuenta con asesorías y apoyo de tutores para dudas académicas', NULL, NULL, NULL, 4);

INSERT INTO horarios_tips (texto, orden) VALUES
('Deja tiempos libres para estudiar.', 1),
('No satures tus días.', 2),
('Considera tiempos de comida y traslado.', 3);
