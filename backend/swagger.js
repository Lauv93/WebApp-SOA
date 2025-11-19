// swagger.js
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PetCare API",
      version: "1.0.0",
      description: "Documentación de la API del proyecto de Cuidado de Mascotas"
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Servidor local"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },

  // 👇 Swagger va a leer TODAS las rutas automáticamente
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
