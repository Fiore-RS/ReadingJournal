import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// backend/uploads/covers — created on boot if it doesn't exist yet.
// This folder is gitignored; images live only on the machine running the API.
export const UPLOADS_ROOT = path.join(__dirname, "..", "..", "uploads");
export const COVERS_DIR = path.join(UPLOADS_ROOT, "covers");

fs.mkdirSync(COVERS_DIR, { recursive: true });

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, COVERS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    cb(null, `${randomUUID()}${ext}`);
  },
});

export const uploadCoverImage = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new Error("Only JPG, PNG, WEBP, or GIF images are allowed"));
      return;
    }
    cb(null, true);
  },
});

// Deletes a previously uploaded cover image given its relative URL
// (e.g. "/uploads/covers/xyz.jpg"). Safe by construction: we only ever use
// the filename portion, so this can never escape COVERS_DIR regardless of
// what's passed in. Best-effort — a missing file is not an error.
export function deleteUploadedFile(relativeUrl: string | null | undefined) {
  if (!relativeUrl) return;
  const filename = path.basename(relativeUrl);
  const filePath = path.join(COVERS_DIR, filename);
  fs.unlink(filePath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Failed to delete cover image:", filePath, err);
    }
  });
}
