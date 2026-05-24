import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import createHttpError from "http-errors";
import path from "path";
import pinoHttp from "pino-http";
import { logger } from "./configs/logger";
import { errorMiddleware } from "./middlewares/error.middleware";
import apiRoutes from "./modules/index";

const app = express();

const __dirname = path.resolve();

app.use("/public", express.static(path.join(__dirname, "public")));

// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         imgSrc: ["'self'", "data:", "blob:"],
//       },
//     },
//   })
// );
app.use(helmet());
app.use(cors());
// app.use(cors({
//   origin: ["https://your-frontend.com"],
//   credentials: true,
// }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(pinoHttp({ logger }));

app.get("/", (_req, res) => {
  return res.json({ status: "OK", message: "EduPlatform API is running!!" });
});

app.use("/api", apiRoutes);

app.use((_req, _res, next) => next(createHttpError(404, "Route not found")));

app.use(errorMiddleware);

export default app;
