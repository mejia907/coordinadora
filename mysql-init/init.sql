USE coordinadora;

-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del rol',
    name VARCHAR(50) NOT NULL UNIQUE COMMENT 'Nombre único del rol (ejemplo: Administrador, Cliente, Transportista)',
    status BOOLEAN DEFAULT true COMMENT 'Estado del rol (activo/inactivo)',
    description TEXT NULL COMMENT 'Descripción opcional sobre el rol y sus permisos',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de creación del rol',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha y hora de última actualización del rol'
) COMMENT='Tabla que almacena los diferentes roles de los usuario del sistema';


-- Tabla de usuarios 
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del usuario',
    type_document ENUM('NIT', 'CC', 'TI', 'CE') NOT NULL COMMENT 'Tipo de documento de identidad (NIT, Cédula de Ciudadanía, Tarjeta de Identidad, Cédula de Extranjería)',
    document VARCHAR(20) UNIQUE NOT NULL COMMENT 'Número de documento de identidad, debe ser único',
    name VARCHAR(100) NOT NULL COMMENT 'Nombre completo del usuario',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT 'Correo electrónico único del usuario',
    phone VARCHAR(20) COMMENT 'Número de teléfono de contacto del usuario',
    address TEXT COMMENT 'Dirección de residencia o contacto del usuario',
    role_id INT NOT NULL COMMENT 'Rol asignado al usuario (relación con la tabla roles)',
    status BOOLEAN DEFAULT true COMMENT 'Estado de la cuenta del usuario (activo/inactivo)',
    password VARCHAR(255) NOT NULL COMMENT 'Contraseña cifrada del usuario',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de creación del usuario',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha y hora de última actualización del usuario',
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) COMMENT='Tabla que almacena la información de los usuarios del sistema';

-- Tabla de estados de ordenes
CREATE TABLE IF NOT EXISTS status_order (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del estado del pedido',
    name VARCHAR(50) NOT NULL UNIQUE COMMENT 'Nombre del estado del pedido',
    status BOOLEAN DEFAULT true COMMENT 'Estado activo o inactivo',
    description TEXT NULL COMMENT 'Descripción del estado del pedido',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha y hora de la última actualización'
) COMMENT='Tabla que almacena los diferentes estados de un pedido';

-- Tabla de transportista (conductores que llevan los pedidos)
CREATE TABLE IF NOT EXISTS carriers (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del mensajero',
    user_id INT NOT NULL COMMENT 'Identificador del usuario que es mensajero',   
    availability BOOLEAN DEFAULT TRUE COMMENT 'Indica si el mensajero está disponible para asignaciones',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
) COMMENT='Tabla que almacena información de los mensajeros';

-- Tabla de los vehiculos
CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del vehículo',
    licence_plate VARCHAR(50) UNIQUE NOT NULL COMMENT 'Placa del vehículo',
    model VARCHAR(50) NOT NULL COMMENT 'Modelo del vehículo',
    type ENUM('Moto', 'Carro', 'Camioneta', 'Camion') NOT NULL COMMENT 'Tipo de vehículo',
    capacity_kg DECIMAL(10,2) NOT NULL COMMENT 'Capacidad de carga en kilogramos',    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
) COMMENT='Tabla que almacena los vehículos disponibles para los transportistas';

-- Tabla realación transportista vehiculo 
CREATE TABLE IF NOT EXISTS carriers_vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único de la relación',
    carrier_id INT NOT NULL COMMENT 'Identificador del transportista',
    vehicle_id INT NOT NULL COMMENT 'Identificador del vehículo',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de asignación del vehículo',
    FOREIGN KEY (carrier_id) REFERENCES carriers(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
) COMMENT='Tabla que relaciona los transportistas con los vehículos que pueden manejar';

-- Tabla para las rutas
CREATE TABLE IF NOT EXISTS routes (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único de la ruta',
    name VARCHAR(100) NOT NULL COMMENT 'Nombre de la ruta',
    origin VARCHAR(100) NOT NULL COMMENT 'Origen de la ruta',
    destination VARCHAR(100) NOT NULL COMMENT 'Destino de la ruta',
    distance_km DECIMAL(10,2) NOT NULL COMMENT 'Distancia en kilometros',
    estimated_time DECIMAL(10,2) NOT NULL COMMENT 'Tiempo estimado en horas',
    status BOOLEAN DEFAULT true COMMENT 'Estado activa o inactiva',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización'
) COMMENT='Tabla que almacena información de las rutas';


-- Tabla para relacionar transportistas con rutas
CREATE TABLE IF NOT EXISTS carriers_routes (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único de la relación',
    carrier_id INT NOT NULL COMMENT 'Identificador del transportista',
    route_id INT NOT NULL COMMENT 'Identificador de la ruta asignada',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de asignación de la ruta',
    FOREIGN KEY (carrier_id) REFERENCES carriers(id) ON DELETE CASCADE,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
) COMMENT='Tabla que relaciona los transportistas con las rutas que cubren';


-- Tabla de pedidos (relacionados con los clientes y transportistas)
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único de la orden de envío',
    user_id INT NOT NULL COMMENT 'ID del usuario que realiza el pedido',    
	guide_order VARCHAR(10) NOT NULL UNIQUE COMMENT 'Número de guia del pedido', 
    type_product ENUM('Paquetes', 'Documentos') NOT NULL COMMENT 'Tipo de producto enviado',
    weight DECIMAL(10,2) NOT NULL COMMENT 'Peso del paquete en kilogramos',
    dimension_long DECIMAL(10,2) NOT NULL COMMENT 'Longitud del paquete en centímetros',
    dimension_tall DECIMAL(10,2) NOT NULL COMMENT 'Altura del paquete en centímetros',
    dimension_width DECIMAL(10,2) NOT NULL COMMENT 'Ancho del paquete en centímetros',
    amount INT NOT NULL COMMENT 'Cantidad de productos en el pedido',    
    destination_address VARCHAR(60) NOT NULL COMMENT 'Dirección de entrega del pedido', 
    contact_receive VARCHAR(80) NOT NULL COMMENT 'Nombre de quien recibe del pedido', 
    contact_phone VARCHAR(20) COMMENT 'Número de teléfono de contacto de quien recibe el pedido',
    description_content VARCHAR(80) NOT NULL COMMENT 'Descripción del contenido del pedido', 
    declared_value DECIMAL(10,2) NOT NULL COMMENT 'Valor declarado del paquete',
    notes_delivery TEXT COMMENT 'Notas o instrucciones especiales para la entrega',
    status_order_id INT DEFAULT 1 COMMENT 'Estado actual del pedido (relación con status_order)',
    estimated_delivery DATE COMMENT 'Fecha estimada de entrega',
    actual_delivery DATE DEFAULT NULL COMMENT 'Fecha real de entrega (se actualiza cuando se completa)',
    carrier_id INT DEFAULT NULL COMMENT 'ID del transportista asignado para la entrega',
    route_id INT DEFAULT NULL COMMENT 'ID de la ruta asignada para la entrega',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de creación del pedido',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha y hora de la última actualización del pedido',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (status_order_id) REFERENCES status_order(id) ON DELETE RESTRICT,
    FOREIGN KEY (carrier_id) REFERENCES carriers(id) ON DELETE SET NULL,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE SET NULL
) COMMENT='Tabla que almacena los pedidos realizados por los usuarios';


-- Consultas inciales
INSERT INTO coordinadora.roles (name, status) VALUES ('Administrador', 1);
INSERT INTO coordinadora.roles (name, status) VALUES ('Cliente', 1);
INSERT INTO coordinadora.roles (name, status) VALUES ('Transportista', 1);

INSERT INTO coordinadora.users
(type_document, document, name, email, phone, address, role_id, status, password)
VALUES('CC', '78454656', 'Andres Felipe Mejia', 'admin@coordinadora.com', '88898797', 'calle 34 #54-87', 1, 1, '$2a$10$ynDHSgjLf29F3fqesqXKZOEb9fl39.6jGXmiLxDwrZNHXrHZFg.MW');

INSERT INTO coordinadora.users
(type_document, document, name, email, phone, address, role_id, status, password)
VALUES('CC', '7796411', 'Ramiro gonzales', 'ramiro@coordinadora.com', '16546644', 'calle 3 #4-7', 3, 1, '$2a$10$ynDHSgjLf29F3fqesqXKZOEb9fl39.6jGXmiLxDwrZNHXrHZFg.MW');

INSERT INTO coordinadora.users
(type_document, document, name, email, phone, address, role_id, status, password)
VALUES('CC', '15464658', 'Alonso zaapata', 'alonso@coordinadora.com', '165463475', 'carrera 47 #5-2', 3, 1, '$2a$10$ynDHSgjLf29F3fqesqXKZOEb9fl39.6jGXmiLxDwrZNHXrHZFg.MW');

INSERT INTO coordinadora.carriers (user_id, availability) VALUES (2,1);
INSERT INTO coordinadora.carriers (user_id, availability) VALUES (3,1);

INSERT INTO coordinadora.vehicles
(licence_plate, model, `type`, capacity_kg)
VALUES('ABC123', 'Honda CB125', 'Moto', 20.00);

INSERT INTO coordinadora.vehicles
(licence_plate, model, `type`, capacity_kg)
VALUES('XYZ789', 'Nissan NP300', 'Camioneta', 1000.00);

INSERT INTO coordinadora.routes (name, origin, destination, distance_km, estimated_time, status) VALUES
('Ruta Bogota - Medellin', 'Bogota, Colombia', 'Medellin, Colombia', 416.0, 8.5, true),
('Ruta Medellin - Cali', 'Medellin, Colombia', 'Cali, Colombia', 417.0, 9.0, true),
('Ruta Cali - Barranquilla', 'Cali, Colombia', 'Barranquilla, Colombia', 1080.0, 20.0, true);

-- Transportista 5 maneja la moto Honda CB125
INSERT INTO coordinadora.carriers_vehicles (carrier_id, vehicle_id, assigned_at) VALUES (2, 1, '2025-02-10 10:00:00');
-- Transportista 7 maneja la camioneta Nissan NP300
INSERT INTO coordinadora.carriers_vehicles (carrier_id, vehicle_id, assigned_at) VALUES (1, 2, '2025-02-10 10:05:00'); 

-- Transportista 1 está asignado a la ruta 2
INSERT INTO coordinadora.carriers_routes (carrier_id, route_id, assigned_at) VALUES (1, 2, '2025-02-10 10:10:00');
-- Transportista 2 está asignado a la ruta 3
INSERT INTO coordinadora.carriers_routes (carrier_id, route_id, assigned_at) VALUES (2, 3, '2025-02-10 10:15:00'); 

INSERT INTO coordinadora.status_order (name, status)VALUES('En Espera', 1);
INSERT INTO coordinadora.status_order (name, status)VALUES('En Ruta', 1);
INSERT INTO coordinadora.status_order (name, status)VALUES('Entregado', 1);