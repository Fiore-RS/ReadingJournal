import { Router } from "express";
import { getPreview, getPublicWishlist } from "../controllers/public_controller";

const router = Router();

router.get("/preview", getPreview);
router.get("/wishlist", getPublicWishlist);

export default router;
