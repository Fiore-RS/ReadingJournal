import { Router } from "express";
import { listSeries, createSeries } from "../controllers/series_controller";

const router = Router();

router.get("/", listSeries);
router.post("/", createSeries);

export default router;
