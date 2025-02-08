##DOCKER

#Construir la imagen
docker build -t apiCoordinadora .

#Ejecutar el contenedor
docker run -p 3000:3000 apiCoordinadora

#Eliminar contenedor e imagen si es necesario
docker rm -f mi-app
docker rmi apiCoordinadora