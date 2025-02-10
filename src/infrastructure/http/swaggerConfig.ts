import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from "express";
import { envs } from '../../config/envs';

const isDocker = process.env.IS_DOCKER === 'true';

// Configuración de la documentación
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Coordinadora",
      version: "1.0.0",
      description: "Gestión de envíos y rutas logísticas de Coordinadora",
    },
    servers: [
      {
        url: isDocker ? `http://loclhost:${envs.SERVER_DOCKER_PORT}/api` : `http://localhost:${envs.SERVER_PORT}/api`,
        description: "Servidor de desarrollo",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          title: "Crear usuario",
          type: "object",
          required: ["type_document", "document", "name", "email", "address", "phone", "role_id", "password"],
          properties: {
            type_document: { type: "string", example: "CC", enum: ["CC", "CE", "TI"] },
            document: { type: "string", example: "87897564" },
            name: { type: "string", example: "Andrés Felipe Mejía" },
            email: { type: "string", example: "andres@coordinadora.com" },
            address: { type: "string", example: "calle 34 #54-87" },
            phone: { type: "string", example: "88898797" },
            role_id: { type: "number", example: 1 },
            status: { type: "boolean", example: 1 },
            password: { type: "string", example: "12345678" },
          },
        },
        Auth: {
          title: "Autenticación de usuarios",
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "andres@coordinadora.com" },
            password: { type: "string", example: "12345678" },
          },
        },
        Route: {
          title: "Crear ruta",
          type: "object",
          required: ["name", "origin", "destination", "distance_km", "estimated_time"],
          properties: {
            name: { type: "string", example: "andres@coordinadora.com" },
            origin: { type: "string", example: "calle 34 #54-87" },
            destination: { type: "string", example: "calle 34 #54-87" },
            distance_km: { type: "number", example: 1 },
            estimated_time: { type: "number", example: 1 },
            status: { type: "boolean", example: 1 },
          },
        },
        Role: {
          title: "Crear rol",
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", example: "Transportista" },
            status: { type: "boolean", example: 1 },
          },
        },
        Order: {
          title: "Crear orden",
          type: "object",
          required: ["user_id", "type_product", "weight", "dimension_long", "dimension_tall", "dimension_width", "amount", "destination_address"],
          properties: {
            user_id: { type: "number", example: 1 },
            type_product: { type: "string", example: "PAQUETES", enum: ["PAQUETES", "DOCUMENTOS"] },
            weight: { type: "number", example: 8 },
            dimension_long: { type: "number", example: 12 },
            dimension_tall: { type: "number", example: 21 },
            dimension_width: { type: "number", example: 15 },
            amount: { type: "number", example: 1 },
            destination_address: { type: "string", example: "calle 34 #54-87" },
          },
        },
        AssignOrder: {
          title: "Asignar ruta a orden",
          type: "object",
          required: ["carrier_id", "route_id", "estimated_delivery"],
          properties: {
            carrier_id: { type: "number", example: 1 },
            route_id: { type: "number", example: 1 },
            estimated_delivery: { type: "string", example: "2025-01-01", format: "YYYY-MM-DD" },
          },
        },
        OrderAll: {
          title: "Reporte general de ordenes",
          type: "object",
          required: ["start_date", "end_date"],
          properties: {
            start_date: { type: "string", example: "2025-01-01", format: "YYYY-MM-DD" },
            end_date: { type: "string", example: "2025-02-01", format: "YYYY-MM-DD" },
            limit: { type: "number", example: 10 },
            offset: { type: "number", example: 0 },
            status_order_id: { type: "number", example: 1 },
            carrier_id: { type: "number", example: 1 },
          },
        },
        EndRoute: {
          title: "Terminar ruta",
          type: "object",
          required: ["actual_delivery"],
          properties: {
            actual_delivery: { type: "string", example: "2025-01-01", format: "YYYY-MM-DD" },
          },
        },
        Carrier: {
          title: "Crear transportista",
          type: "object",
          required: ["user_id", "licencePlate"],
          properties: {
            user_id: { type: "number", example: 1 },
            licencePlate: { type: "string", example: "ABC123" },
          },
        }
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./src/infrastructure/http/routes/*.ts"], // Ubicación de los archivos con documentación
};

// Generación de la documentación
const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger Docs disponibles en /api-docs");
};
