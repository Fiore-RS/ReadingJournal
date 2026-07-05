import { API_URL } from "./api.js";

export interface UploadCoverResponse {
  url: string;
}

export const uploadsService = {
  // Note: this deliberately does NOT go through apiFetch, since that helper
  // always sets Content-Type: application/json — multipart uploads need the
  // browser to set their own Content-Type with the form boundary.
  uploadCover: async (file: File): Promise<UploadCoverResponse> => {
    const formData = new FormData();
    formData.append("cover", file);

    const res = await fetch(`${API_URL}/uploads/cover`, {
      method: "POST",
      body: formData,
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(body?.error || `Upload failed with ${res.status}`);
    }

    return body as UploadCoverResponse;
  },

  // Deletes an uploaded image that never ended up attached to a saved book
  // (replaced by another upload, removed, or the form was closed without
  // saving). Best-effort — callers can safely ignore failures here.
  deleteCover: async (url: string): Promise<void> => {
    await fetch(`${API_URL}/uploads/cover`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  },
};
