import { Router } from "express";
import { getPreview } from "../controllers/public_controller";

const router = Router();

router.get("/preview", getPreview);

export default router;
