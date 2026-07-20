import { API_URL, getAuthToken } from "./api.js";

export interface UploadCoverResponse {
  url: string;
}

export const uploadsService = {
  // Note: this deliberately does NOT go through apiFetch, since that helper
  // always sets Content-Type: application/json — multipart uploads need the
  // browser to set their own Content-Type with the form boundary. Since we
  // bypass apiFetch, we still need to attach the auth header ourselves —
  // these routes sit behind requireAuth.
  uploadCover: async (file: File): Promise<UploadCoverResponse> => {
    const formData = new FormData();
    formData.append("cover", file);

    const token = getAuthToken();
    const res = await fetch(`${API_URL}/uploads/cover`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
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
    const token = getAuthToken();
    await fetch(`${API_URL}/uploads/cover`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ url }),
    });
  },
};
