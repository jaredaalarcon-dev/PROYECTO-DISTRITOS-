-- ============================================================
--  Script SQL - Base de Datos: ventas_db
--  Tabla: distritos
-- ============================================================

CREATE DATABASE IF NOT EXISTS ventas_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ventas_db;

-- Crear tabla distritos
CREATE TABLE IF NOT EXISTS distritos (
  id_dis     INT          NOT NULL AUTO_INCREMENT,
  nom_dis    VARCHAR(120) NOT NULL,
  cod_postal VARCHAR(10)  NOT NULL,
  PRIMARY KEY (id_dis)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos de prueba (30 registros para probar paginación)
INSERT INTO distritos (nom_dis, cod_postal) VALUES
  ('Miraflores',         'LIM15'),
  ('San Isidro',         'LIM27'),
  ('Barranco',           'LIM04'),
  ('Surco',              'LIM33'),
  ('La Molina',          'LIM12'),
  ('Jesús María',        'LIM11'),
  ('Lince',              'LIM14'),
  ('Pueblo Libre',       'LIM21'),
  ('Magdalena del Mar',  'LIM17'),
  ('San Miguel',         'LIM32'),
  ('Breña',              'LIM05'),
  ('Rímac',              'LIM25'),
  ('El Agustino',        'LIM06'),
  ('San Luis',           'LIM30'),
  ('Santa Anita',        'LIM35'),
  ('Ate',                'LIM03'),
  ('Chaclacayo',         'LIM07'),
  ('Lurigancho',         'LIM16'),
  ('San Juan de Lurigancho', 'LIM36'),
  ('Comas',              'LIM08'),
  ('Carabayllo',         'LIM06C'),
  ('Independencia',      'LIM10'),
  ('Los Olivos',         'LIM39'),
  ('San Martín de Porres', 'LIM29'),
  ('Chorrillos',         'LIM09'),
  ('Villa María del Triunfo', 'LIM40'),
  ('Villa El Salvador',  'LIM42'),
  ('San Juan de Miraflores', 'LIM28'),
  ('Surquillo',          'LIM34'),
  ('La Victoria',        'LIM13');
