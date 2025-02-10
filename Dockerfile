# Compilar TypeScript a JavaScript
FROM node:22

# Establecer el directorio de trabajo
WORKDIR /apiCoordinadora

# Instala pnpm globalmente
RUN npm install -g pnpm

# Copiar package.json y package-lock.json para cachear dependencias
COPY package.json pnpm-lock.yaml ./

# Instala las dependencias con pnpm
RUN pnpm install

# Copiar el código fuente
COPY . .

# Compilar TypeScript a JavaScript
RUN pnpm run build

# Exponer el puerto donde corre la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["pnpm", "start"]
