import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { randomUUID } from "node:crypto";
import { env } from "../../env";

// Cover images live on Cloudinary instead of local disk. Render's free tier
// wipes local files on every restart (inactivity spin-down, redeploys),
// which was silently breaking covers after the first restart. Cloudinary
// persists them independently of whatever host runs the API.
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// Kept separate from anything else on the Cloudinary account, in case it's
// ever shared with another project.
const CLOUDINARY_FOLDER = "reading-journal/covers";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = new CloudinaryStorage({
  cloudinary,
  // Cast needed because multer-storage-cloudinary's typings lose named keys
  // (like "folder") when combined with cloudinary's UploadApiOptions index
  // signature — a known quirk of that package's .d.ts, not a real type error.
  params: {
    folder: CLOUDINARY_FOLDER,
    public_id: () => randomUUID(),
    resource_type: "image",
  } as ConstructorParameters<typeof CloudinaryStorage>[0]["params"],
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

// Cloudinary URLs look like:
//   https://res.cloudinary.com/<cloud>/image/upload/v169.../reading-journal/covers/<id>.jpg
// Deleting an asset needs its public_id — the folder + filename portion,
// without the version segment or file extension. We only ever generated
// these URLs ourselves (via uploadCoverImage above), so this parse is safe.
function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+(?:\?.*)?$/);
  return match ? match[1] : null;
}

// Deletes a previously uploaded cover image given its Cloudinary URL.
// Best-effort — a missing/already-deleted asset is not an error, and a URL
// that isn't a Cloudinary URL (e.g. leftover local path from before this
// migration) is just skipped rather than thrown.
export function deleteUploadedFile(url: string | null | undefined) {
  if (!url) return;
  const publicId = extractPublicId(url);
  if (!publicId) return;
  cloudinary.uploader.destroy(publicId).catch((err) => {
    console.error("Failed to delete cover image from Cloudinary:", publicId, err);
  });
}
