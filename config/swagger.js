const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "BudgetTracker API",
      version: "1.0.0",
      description: "Production-ready API documentation",
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Local",
      },
      {
        url: "https://budgettrackerapi-muxo.onrender.com/api/v1",
        description: "Production",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },

  apis: ["./routes/*.js"], // important
};

module.exports = swaggerJSDoc(options);