import "express-async-errors";
import express from "express";
import apiRoutes from "./routes";
import helmet from "helmet";
import cors from "cors";
import { env } from "../shared/config/env";
import { requestIdMiddleware } from "./middlewares/requestIdMiddleware";
import cookieParser from "cookie-parser";
import { requestLoggerInterceptor } from "../infrastructure/http/interceptors/request-logger.interceptor";
import { errorInterceptor } from "../infrastructure/http/interceptors/error.interceptor";

const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(cookieParser());

app.use(requestIdMiddleware);

app.use(requestLoggerInterceptor);

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
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
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

app.set("trust proxy", 1);

app.use("/api", apiRoutes);

app.use(errorInterceptor);

export default app;
