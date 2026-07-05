import { Router } from "express";
import { uploadCoverImage } from "../middleware/upload";
import { uploadCover, deleteCover } from "../controllers/uploads_controller";

const router = Router();

router.post("/cover", uploadCoverImage.single("cover"), uploadCover);
router.delete("/cover", deleteCover);

export default router;
