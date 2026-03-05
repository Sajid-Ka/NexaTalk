import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NexaTalk API",
      version: "1.0.0",
    },
  },
  apis: ["./src/interfaces/**/*.ts"],
});



//....  use this top in app.ts 
// import swaggerUi from "swagger-ui-express";
// import { swaggerSpec } from "../shared/docs/swagger";

//.... this use route section in app.ts
// app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));