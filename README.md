# Configuración de Docker y Variables de Entorno

Este documento describe los pasos para instalar y configurar un contenedor Docker para la aplicación, junto con la definición del archivo `.env`.

## Instalación y Configuración del Contenedor Docker

### 1. Requisitos Previos
- Tener instalado **Docker** y **Docker Compose** en tu sistema.

- Clonar el repositorio del proyecto:
```sh
git clone https://github.com/mejia907/coordinadora.git
cd coordinadora
```

### 2. Configurar Variables de Entorno
Antes de iniciar los contenedores, es necesario definir las variables de entorno en un archivo `.env`. 

- Crea un archivo `.env` en la raíz del proyecto y agrega lo siguiente:

#### Configuración de MYSQL
MYSQL_PORT=3306<br>
MYSQL_DOCKER_PORT=3306<br>
MYSQL_HOST='localhost'<br>
MYSQL_DOCKER_HOST='mysql'<br>
MYSQL_ROOT_PASSWORD='root'<br>
MYSQL_USER='coordinadora'<br>
MYSQL_PASSWORD='coordinadora'<br>
MYSQL_DATABASE='coordinadora'<br>

#### Configuración del servidor
SERVER_PORT=3000<br>
SERVER_DOCKER_PORT=3000<br>

#### JWT Token de acceso
JWT_SECRET=/#coordinadora#/

#### Configuración de Redis
REDIS_HOST='localhost'<br>
REDIS_PORT=6379<br>
REDIS_DOCKER_HOST='redis'<br>
REDIS_DOCKER_PORT=6379<br>

### 3. Levantar los Contenedores
Para iniciar los contenedores, ejecuta el siguiente comando:

```sh
docker-compose up -d --build
```

### Archivo SQL
Se encuentra en la ruta `/mysql-init/init.sql`, el cual contiene las estructuras de las tablas y registro de datos iniciales para poder ejecutar API