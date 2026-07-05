import { Router } from "express";
import {
  listBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  updateStatus,
  updateFavorite,
  updateProgress,
  saveReview,
} from "../controllers/books_controller";

const router = Router();

router.get("/", listBooks);
router.get("/:id", getBook);
router.post("/", createBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

router.patch("/:id/status", updateStatus);
router.patch("/:id/favorite", updateFavorite);
router.patch("/:id/progress", updateProgress);
router.put("/:id/review", saveReview);

export default router;
