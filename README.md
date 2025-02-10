##DOCKER

#Construir la imagen
Docker compose up

#Ejecutar el contenedor
docker run -p 3000:3000 apiCoordinadora

#Eliminar contenedor e imagen si es necesario
docker rm -f apiCoordinadora
docker rmi apiCoordinadora