# Configuración de Docker y Variables de Entorno

Este documento describe los pasos para instalar y configurar un contenedor Docker para la aplicación, junto con la definición del archivo `.env`.

## Instalación y Configuración del Contenedor Docker

### 1. Requisitos Previos
- Tener instalado **Docker** y **Docker Compose** en tu sistema.

- Clonar el repositorio del proyecto:
```sh
git clone https://github.com/mejia907/coordinadora.git
cd proyecto
```

### 2. Configurar Variables de Entorno
Antes de iniciar los contenedores, es necesario definir las variables de entorno en un archivo `.env`. Crea un archivo `.env` en la raíz del proyecto y agrega lo siguiente:

#Configuración de MYSQL
MYSQL_PORT=3306
MYSQL_DOCKER_PORT=3306
MYSQL_HOST='localhost'
MYSQL_DOCKER_HOST='mysql'
MYSQL_ROOT_PASSWORD='root'
MYSQL_USER='coordinadora'
MYSQL_PASSWORD='coordinadora'
MYSQL_DATABASE='coordinadora'

#Configuración del servidor
SERVER_PORT=3000
SERVER_DOCKER_PORT=3000

#JWT Token de acceso
JWT_SECRET=/*coordinadora*/

#Configuración de Redis
REDIS_HOST='localhost'
REDIS_PORT=6379
REDIS_DOCKER_HOST='redis'
REDIS_DOCKER_PORT=6379

### 3. Levantar los Contenedores
Para iniciar los contenedores, ejecuta el siguiente comando:

```sh
docker-compose up -d --build
```