import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "../env";
import booksRoutes from "./routes/books_routes";
import seriesRoutes from "./routes/series_routes";
import { notFoundHandler, errorHandler } from "./middleware/error_handler";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "cozy-reading-journal-backend" });
});

app.use("/api/books", booksRoutes);
app.use("/api/series", seriesRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
