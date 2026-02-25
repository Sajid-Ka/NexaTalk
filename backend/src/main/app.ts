import "express-async-errors";
import express from "express";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import helmet from "helmet";
import cors from "cors";
import { env } from "../shared/config/env";
import { requestIdMiddleware } from "./middlewares/requestIdMiddleware";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../shared/docs/swagger";

const app = express();

app.disable("x-powered-by");
app.use(express.json());

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", env.CLIENT_ORIGIN],
      },
    },
  }),
);

app.use(
  cors({
    origin: [env.CLIENT_ORIGIN],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(requestIdMiddleware);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;