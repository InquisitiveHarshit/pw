import request from "./client";

export type Locality = {
  _id: string;
  name: string;
  city?: string;
  state?: string;
  pincode?: string;
  activeProjects: number;
  activeGroups: number;
  image?: string;   // Cloudinary URL — set via Locality Content admin
  content?: Record<string, unknown>; // stub for future SEO/text fields
  createdAt: string;
};

/** Get all localities (optionally filtered by search) */
export const getLocalities = (search?: string) => {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return request<{ success: boolean; data: Locality[] }>(`/localities${query}`);
};

/** Create a locality */
export const createLocality = (data: {
  name: string;
  city?: string;
  state?: string;
  pincode?: string;
  activeProjects?: number;
  activeGroups?: number;
}) =>
  request<{ success: boolean; data: Locality }>("/localities", {
    method: "POST",
    body: data,
    auth: true,
  });

/** Update a locality (image, content, etc.) */
export const updateLocality = (id: string, data: Partial<Locality>) =>
  request<{ success: boolean; data: Locality }>(`/localities/${id}`, {
    method: "PUT",
    body: data,
    auth: true,
  });

/** Delete a locality */
export const deleteLocality = (id: string) =>
  request<{ success: boolean; data: unknown }>(`/localities/${id}`, {
    method: "DELETE",
    auth: true,
  });
