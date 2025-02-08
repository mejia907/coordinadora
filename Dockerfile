# Compilar TypeScript a JavaScript
FROM node:22-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /apiCoordinadora

# Copiar package.json y package-lock.json para cachear dependencias
COPY package.json package-lock.json ./

# Instalar dependencias de producción y desarrollo
RUN npm install

# Copiar el código fuente
COPY . .

# Compilar TypeScript a JavaScript
RUN npm run build



# Imagen final
FROM node:22-alpine

# Establecer directorio de trabajo
WORKDIR /apiCoordinadora

# Copiar solo los archivos necesarios desde la etapa de compilación
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "dist/app.js"]
