import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "../env";
import authRoutes from "./routes/auth_routes";
import publicRoutes from "./routes/public_routes";
import booksRoutes from "./routes/books_routes";
import seriesRoutes from "./routes/series_routes";
import uploadsRoutes from "./routes/uploads_routes";
import { requireAuth } from "./middleware/auth_middleware";
import { notFoundHandler, errorHandler } from "./middleware/error_handler";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "cozy-reading-journal-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/books", requireAuth, booksRoutes);
app.use("/api/series", requireAuth, seriesRoutes);
app.use("/api/uploads", requireAuth, uploadsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
