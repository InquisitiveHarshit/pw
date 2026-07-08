import request from "./client";

export type Property = {
  _id: string;
  title: string;
  description: string;
  location: string;
  units: {
    propertyType: string;
    bhk: string;
    bhkCategory?: string;
    image?: string;
    area: string;
    price: string;
    discountPrice: string;
  }[];
  images: string[];
  amenities: string[];
  totalSlots?: number;  // hidden from guests
  filledSlots?: number; // hidden from guests
  status: "open" | "full" | "closed";
  isFeatured: boolean;
  postedBy?: { name: string; email: string };
  developerName?: string;
  aboutDeveloper?: string;
  sector?: string;
  possessionDate?: string;
  locationHighlights?: string;
  promotionalTag?: string;
  reraNumber?: string;
  brochureUrl?: string;
  bhkCategories?: string[];
  price?: number;
  bhk?: string;
  area?: string;
  type?: string;
  createdAt: string;
};

export type PropertyListResponse = {
  success: boolean;
  total: number;
  page: number;
  pages: number;
  data: Property[];
};

export type PropertyFilters = {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  location?: string;
};

/** Get all properties — limited for guests */
export const getProperties = (filters: PropertyFilters = {}) => {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.status) params.set("status", filters.status);
  if (filters.type) params.set("type", filters.type);
  if (filters.location) params.set("location", filters.location);
  const qs = params.toString();
  return request<PropertyListResponse>(`/properties${qs ? `?${qs}` : ""}`);
};

/** Get single property */
export const getProperty = (id: string) =>
  request<{ success: boolean; data: Property }>(`/properties/${id}`);

/** Create property (admin) */
export const createProperty = (data: Partial<Property>) =>
  request<{ success: boolean; data: Property }>("/properties", {
    method: "POST",
    body: data,
    auth: true,
  });

/** Update property (admin) */
export const updateProperty = (id: string, data: Partial<Property>) =>
  request<{ success: boolean; data: Property }>(`/properties/${id}`, {
    method: "PUT",
    body: data,
    auth: true,
  });

/** Delete property (admin) */
export const deleteProperty = (id: string) =>
  request<{ success: boolean; message: string }>(`/properties/${id}`, {
    method: "DELETE",
    auth: true,
  });

/** Get all groups for a property — admin only */
export const getPropertyGroups = (id: string) =>
  request<{ success: boolean; data: unknown[] }>(`/properties/${id}/groups`, {
    auth: true,
  });
