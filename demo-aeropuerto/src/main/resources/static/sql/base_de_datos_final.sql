-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-06-2025 a las 15:43:18
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `aeropuerto`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_estadisticas_sistema` ()   BEGIN
    SELECT 
        'Aerolíneas' as entidad, 
        COUNT(*) as total 
    FROM aerolineas
    UNION ALL
    SELECT 
        'Aviones' as entidad, 
        COUNT(*) as total 
    FROM aviones
    UNION ALL
    SELECT 
        'Vuelos' as entidad, 
        COUNT(*) as total 
    FROM vuelos
    UNION ALL
    SELECT 
        'Pasajeros' as entidad, 
        COUNT(*) as total 
    FROM pasajeros
    UNION ALL
    SELECT 
        'Reservas' as entidad, 
        COUNT(*) as total 
    FROM reservas
    UNION ALL
    SELECT 
        'Puertas' as entidad, 
        COUNT(*) as total 
    FROM puertas;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_verificar_integridad` ()   BEGIN
    -- Verificar reservas sin pasajero
    SELECT 'Reservas huérfanas (sin pasajero)' as problema, COUNT(*) as cantidad
    FROM reservas r
    LEFT JOIN pasajeros p ON r.id_pasajero = p.id
    WHERE p.id IS NULL
    
    UNION ALL
    
    -- Verificar reservas sin vuelo
    SELECT 'Reservas huérfanas (sin vuelo)' as problema, COUNT(*) as cantidad
    FROM reservas r
    LEFT JOIN vuelos v ON r.id_vuelo = v.id
    WHERE v.id IS NULL
    
    UNION ALL
    
    -- Verificar aviones sin aerolínea
    SELECT 'Aviones sin aerolínea' as problema, COUNT(*) as cantidad
    FROM aviones av
    LEFT JOIN aerolineas a ON av.id_aerolinea = a.id
    WHERE a.id IS NULL
    
    UNION ALL
    
    -- Verificar equipajes sin pasajero
    SELECT 'Equipajes huérfanos' as problema, COUNT(*) as cantidad
    FROM equipajes e
    LEFT JOIN pasajeros p ON e.id_pasajero = p.id
    WHERE p.id IS NULL;
END$$

--
-- Funciones
--
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_calcular_edad` (`fecha_nacimiento` DATE) RETURNS INT(11) DETERMINISTIC READS SQL DATA BEGIN
    RETURN TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE());
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_nombre_completo_pasajero` (`pasajero_id` INT) RETURNS VARCHAR(101) CHARSET utf8mb4 COLLATE utf8mb4_general_ci DETERMINISTIC READS SQL DATA BEGIN
    DECLARE nombre_completo VARCHAR(101);
    
    SELECT CONCAT(nombre, ' ', apellido) 
    INTO nombre_completo
    FROM pasajeros 
    WHERE id = pasajero_id;
    
    RETURN COALESCE(nombre_completo, 'Pasajero no encontrado');
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aerolineas`
--

CREATE TABLE `aerolineas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `pais_origen` varchar(50) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_modificacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Volcado de datos para la tabla `aerolineas`
--

INSERT INTO `aerolineas` (`id`, `nombre`, `pais_origen`, `fecha_creacion`, `fecha_modificacion`) VALUES
(3, 'Iberia', 'España', '2025-06-19 15:14:36', '2025-06-19 15:14:36'),
(4, 'Air Europa', 'España', '2025-06-19 15:14:36', '2025-06-19 15:14:36'),
(5, 'Ryanair', 'Irlanda', '2025-06-19 15:14:36', '2025-06-19 15:14:36'),
(6, 'Air France', 'Francia', '2025-06-19 15:14:36', '2025-06-19 15:14:36'),
(7, 'Lufthansa', 'Alemania', '2025-06-19 15:14:36', '2025-06-19 15:14:36'),
(8, 'British Airways', 'Reino Unido', '2025-06-19 15:14:36', '2025-06-19 15:14:36'),
(9, 'KLM', 'Países Bajos', '2025-06-19 15:14:36', '2025-06-19 15:14:36'),
(10, 'Alitalia', 'Italia', '2025-06-19 15:14:36', '2025-06-19 15:14:36'),
(11, 'TAP Portugal', 'Portugal', '2025-06-19 15:14:36', '2025-06-19 15:14:36'),
(12, 'Swiss International', 'Suiza', '2025-06-19 15:14:36', '2025-06-19 15:14:36');

--
-- Disparadores `aerolineas`
--
DELIMITER $$
CREATE TRIGGER `tr_aerolineas_audit` AFTER UPDATE ON `aerolineas` FOR EACH ROW BEGIN
    INSERT INTO log_aerolineas (aerolinea_id, accion, usuario, datos_anteriores, datos_nuevos)
    VALUES (
        NEW.id,
        'UPDATE',
        USER(),
        JSON_OBJECT('nombre', OLD.nombre, 'pais_origen', OLD.pais_origen),
        JSON_OBJECT('nombre', NEW.nombre, 'pais_origen', NEW.pais_origen)
    );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aviones`
--

CREATE TABLE `aviones` (
  `id` int(11) NOT NULL,
  `modelo` varchar(100) NOT NULL,
  `capacidad_asientos` int(11) NOT NULL,
  `id_aerolinea` int(11) DEFAULT NULL,
  `id_vuelo` int(11) DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `aviones`
--

INSERT INTO `aviones` (`id`, `modelo`, `capacidad_asientos`, `id_aerolinea`, `id_vuelo`) VALUES
(1, 'asd', 111, 5, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipajes`
--

CREATE TABLE `equipajes` (
  `id` int(11) NOT NULL,
  `id_pasajero` int(11) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `peso` decimal(5,2) DEFAULT NULL
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `log_aerolineas`
--

CREATE TABLE `log_aerolineas` (
  `id` int(11) NOT NULL,
  `aerolinea_id` int(11) DEFAULT NULL,
  `accion` varchar(10) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `usuario` varchar(100) DEFAULT NULL,
  `datos_anteriores` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`datos_anteriores`)),
  `datos_nuevos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`datos_nuevos`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pasajeros`
--

CREATE TABLE `pasajeros` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `dni` varchar(9) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `email` varchar(50) NOT NULL
) ;

--
-- Volcado de datos para la tabla `pasajeros`
--

INSERT INTO `pasajeros` (`id`, `nombre`, `apellido`, `dni`, `fecha_nacimiento`, `email`) VALUES
(10, 'Prueba', 'Prueba', 'Prueba', '2025-06-12', 'asdaf@gasd.com'),
(11, 'Prueba', 'Prueba', 'Prueba2', '2025-06-14', 'asdaf@gasd.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puertas`
--

CREATE TABLE `puertas` (
  `id` int(11) NOT NULL,
  `numero_puerta` varchar(10) NOT NULL,
  `terminal` varchar(10) NOT NULL
) ;

--
-- Volcado de datos para la tabla `puertas`
--

INSERT INTO `puertas` (`id`, `numero_puerta`, `terminal`) VALUES
(6, 'A9', 'T1'),
(7, 'A3', 'T1'),
(8, 'B1', 'T1'),
(9, 'C1', 'T2'),
(10, 'C2', 'T2'),
(11, 'C3', 'T2'),
(12, 'D1', 'T2'),
(13, 'D2', 'T2'),
(16, 'A7', 'T2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `id` int(11) NOT NULL,
  `id_pasajero` int(11) DEFAULT NULL,
  `id_vuelo` int(11) DEFAULT NULL,
  `fecha_reserva` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reservas`
--

INSERT INTO `reservas` (`id`, `id_pasajero`, `id_vuelo`, `fecha_reserva`) VALUES
(1, 10, 2, '2025-06-19 00:00:00'),
(4, 10, 4, '2025-06-20 00:00:00'),
(7, 11, 2, '2025-06-20 00:00:00');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_estadisticas_aerolineas`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_estadisticas_aerolineas` (
`id` int(11)
,`nombre` varchar(100)
,`pais_origen` varchar(50)
,`total_aviones` bigint(21)
,`capacidad_total` decimal(32,0)
,`total_vuelos` bigint(21)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_reservas_completa`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_reservas_completa` (
`reserva_id` int(11)
,`fecha_reserva` datetime
,`pasajero_nombre` varchar(50)
,`pasajero_apellido` varchar(50)
,`pasajero_dni` varchar(9)
,`pasajero_email` varchar(50)
,`numero_vuelo` varchar(10)
,`origen` varchar(50)
,`destino` varchar(50)
,`fecha_salida` date
,`fecha_llegada` date
,`aerolinea_nombre` varchar(100)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_vuelos_detallada`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_vuelos_detallada` (
`id` int(11)
,`numero_vuelo` varchar(10)
,`origen` varchar(50)
,`destino` varchar(50)
,`fecha_salida` date
,`fecha_llegada` date
,`avion_modelo` varchar(100)
,`capacidad_asientos` int(11)
,`aerolinea_nombre` varchar(100)
,`aerolinea_pais` varchar(50)
,`total_reservas` bigint(21)
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vuelos`
--

CREATE TABLE `vuelos` (
  `id` int(11) NOT NULL,
  `numero_vuelo` varchar(10) NOT NULL,
  `origen` varchar(50) NOT NULL,
  `destino` varchar(50) NOT NULL,
  `fecha_salida` date NOT NULL,
  `fecha_llegada` date NOT NULL
) ;

--
-- Volcado de datos para la tabla `vuelos`
--

INSERT INTO `vuelos` (`id`, `numero_vuelo`, `origen`, `destino`, `fecha_salida`, `fecha_llegada`) VALUES
(2, 'ADBSA32', 'España', 'Londres', '2025-06-20', '2025-06-23'),
(4, 'ADBSA33', 'España', 'Londres', '2025-06-18', '2025-06-19'),
(5, 'ADBSA31', 'España', 'Londres', '2025-06-19', '2025-06-20'),
(6, 'ADBSA30', 'España', 'Londres', '2025-06-21', '2025-06-22'),
(7, 'ADBSA29', 'España', 'Londres', '2025-06-20', '2025-06-28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vuelos_puertas`
--

CREATE TABLE `vuelos_puertas` (
  `id_vuelo` int(11) NOT NULL,
  `id_puerta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_estadisticas_aerolineas`
--
DROP TABLE IF EXISTS `vista_estadisticas_aerolineas`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_estadisticas_aerolineas`  AS SELECT `a`.`id` AS `id`, `a`.`nombre` AS `nombre`, `a`.`pais_origen` AS `pais_origen`, count(`av`.`id`) AS `total_aviones`, sum(`av`.`capacidad_asientos`) AS `capacidad_total`, count(distinct `v`.`id`) AS `total_vuelos` FROM ((`aerolineas` `a` left join `aviones` `av` on(`a`.`id` = `av`.`id_aerolinea`)) left join `vuelos` `v` on(`av`.`id_vuelo` = `v`.`id`)) GROUP BY `a`.`id`, `a`.`nombre`, `a`.`pais_origen` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_reservas_completa`
--
DROP TABLE IF EXISTS `vista_reservas_completa`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_reservas_completa`  AS SELECT `r`.`id` AS `reserva_id`, `r`.`fecha_reserva` AS `fecha_reserva`, `p`.`nombre` AS `pasajero_nombre`, `p`.`apellido` AS `pasajero_apellido`, `p`.`dni` AS `pasajero_dni`, `p`.`email` AS `pasajero_email`, `v`.`numero_vuelo` AS `numero_vuelo`, `v`.`origen` AS `origen`, `v`.`destino` AS `destino`, `v`.`fecha_salida` AS `fecha_salida`, `v`.`fecha_llegada` AS `fecha_llegada`, `a`.`nombre` AS `aerolinea_nombre` FROM ((((`reservas` `r` join `pasajeros` `p` on(`r`.`id_pasajero` = `p`.`id`)) join `vuelos` `v` on(`r`.`id_vuelo` = `v`.`id`)) left join `aviones` `av` on(`v`.`id` = `av`.`id_vuelo`)) left join `aerolineas` `a` on(`av`.`id_aerolinea` = `a`.`id`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_vuelos_detallada`
--
DROP TABLE IF EXISTS `vista_vuelos_detallada`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_vuelos_detallada`  AS SELECT `v`.`id` AS `id`, `v`.`numero_vuelo` AS `numero_vuelo`, `v`.`origen` AS `origen`, `v`.`destino` AS `destino`, `v`.`fecha_salida` AS `fecha_salida`, `v`.`fecha_llegada` AS `fecha_llegada`, `av`.`modelo` AS `avion_modelo`, `av`.`capacidad_asientos` AS `capacidad_asientos`, `a`.`nombre` AS `aerolinea_nombre`, `a`.`pais_origen` AS `aerolinea_pais`, count(`r`.`id`) AS `total_reservas` FROM (((`vuelos` `v` left join `aviones` `av` on(`v`.`id` = `av`.`id_vuelo`)) left join `aerolineas` `a` on(`av`.`id_aerolinea` = `a`.`id`)) left join `reservas` `r` on(`v`.`id` = `r`.`id_vuelo`)) GROUP BY `v`.`id`, `v`.`numero_vuelo`, `v`.`origen`, `v`.`destino`, `v`.`fecha_salida`, `v`.`fecha_llegada`, `av`.`modelo`, `av`.`capacidad_asientos`, `a`.`nombre`, `a`.`pais_origen` ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `aerolineas`
--
ALTER TABLE `aerolineas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_aerolineas_nombre` (`nombre`),
  ADD UNIQUE KEY `unique_nombre_aerolinea` (`nombre`),
  ADD KEY `idx_aerolineas_nombre` (`nombre`),
  ADD KEY `idx_aerolineas_pais` (`pais_origen`);

--
-- Indices de la tabla `aviones`
--
ALTER TABLE `aviones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_aviones_modelo_aerolinea` (`modelo`,`id_aerolinea`),
  ADD KEY `id_aerolinea` (`id_aerolinea`),
  ADD KEY `id_vuelo` (`id_vuelo`),
  ADD KEY `idx_aviones_modelo` (`modelo`),
  ADD KEY `idx_aviones_aerolinea` (`id_aerolinea`),
  ADD KEY `idx_aviones_capacidad` (`capacidad_asientos`),
  ADD KEY `idx_aviones_vuelo` (`id_vuelo`),
  ADD KEY `idx_aviones_modelo_aerolinea` (`modelo`,`id_aerolinea`);

--
-- Indices de la tabla `equipajes`
--
ALTER TABLE `equipajes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pasajero` (`id_pasajero`),
  ADD KEY `idx_equipajes_pasajero` (`id_pasajero`),
  ADD KEY `idx_equipajes_peso` (`peso`);

--
-- Indices de la tabla `log_aerolineas`
--
ALTER TABLE `log_aerolineas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pasajeros`
--
ALTER TABLE `pasajeros`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD KEY `idx_pasajeros_dni` (`dni`),
  ADD KEY `idx_pasajeros_nombre` (`nombre`),
  ADD KEY `idx_pasajeros_apellido` (`apellido`),
  ADD KEY `idx_pasajeros_email` (`email`),
  ADD KEY `idx_pasajeros_nombre_completo` (`nombre`,`apellido`);

--
-- Indices de la tabla `puertas`
--
ALTER TABLE `puertas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_numero_puerta` (`numero_puerta`),
  ADD KEY `idx_puertas_numero` (`numero_puerta`),
  ADD KEY `idx_puertas_terminal` (`terminal`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_reservas_pasajero_vuelo` (`id_pasajero`,`id_vuelo`),
  ADD KEY `id_pasajero` (`id_pasajero`),
  ADD KEY `id_vuelo` (`id_vuelo`),
  ADD KEY `idx_reservas_pasajero` (`id_pasajero`),
  ADD KEY `idx_reservas_vuelo` (`id_vuelo`),
  ADD KEY `idx_reservas_fecha` (`fecha_reserva`),
  ADD KEY `idx_reservas_pasajero_vuelo` (`id_pasajero`,`id_vuelo`);

--
-- Indices de la tabla `vuelos`
--
ALTER TABLE `vuelos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_vuelo` (`numero_vuelo`),
  ADD UNIQUE KEY `unique_numero_vuelo` (`numero_vuelo`),
  ADD KEY `idx_vuelos_origen` (`origen`),
  ADD KEY `idx_vuelos_destino` (`destino`),
  ADD KEY `idx_vuelos_fecha_salida` (`fecha_salida`),
  ADD KEY `idx_vuelos_fecha_llegada` (`fecha_llegada`),
  ADD KEY `idx_vuelos_origen_destino` (`origen`,`destino`);

--
-- Indices de la tabla `vuelos_puertas`
--
ALTER TABLE `vuelos_puertas`
  ADD PRIMARY KEY (`id_vuelo`,`id_puerta`),
  ADD KEY `id_puerta` (`id_puerta`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `aerolineas`
--
ALTER TABLE `aerolineas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `aviones`
--
ALTER TABLE `aviones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `equipajes`
--
ALTER TABLE `equipajes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `log_aerolineas`
--
ALTER TABLE `log_aerolineas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pasajeros`
--
ALTER TABLE `pasajeros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `puertas`
--
ALTER TABLE `puertas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `vuelos`
--
ALTER TABLE `vuelos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `aviones`
--
ALTER TABLE `aviones`
  ADD CONSTRAINT `aviones_ibfk_1` FOREIGN KEY (`id_aerolinea`) REFERENCES `aerolineas` (`id`),
  ADD CONSTRAINT `aviones_ibfk_2` FOREIGN KEY (`id_vuelo`) REFERENCES `vuelos` (`id`);

--
-- Filtros para la tabla `equipajes`
--
ALTER TABLE `equipajes`
  ADD CONSTRAINT `equipajes_ibfk_1` FOREIGN KEY (`id_pasajero`) REFERENCES `pasajeros` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`id_pasajero`) REFERENCES `pasajeros` (`id`),
  ADD CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`id_vuelo`) REFERENCES `vuelos` (`id`);

--
-- Filtros para la tabla `vuelos_puertas`
--
ALTER TABLE `vuelos_puertas`
  ADD CONSTRAINT `vuelos_puertas_ibfk_1` FOREIGN KEY (`id_vuelo`) REFERENCES `vuelos` (`id`),
  ADD CONSTRAINT `vuelos_puertas_ibfk_2` FOREIGN KEY (`id_puerta`) REFERENCES `puertas` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
