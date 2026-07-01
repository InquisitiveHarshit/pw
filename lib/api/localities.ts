import request from "./client";

export type Locality = {
  _id: string;
  name: string;
  activeProjects: number;
  activeGroups: number;
  createdAt: string;
};

/** Get all localities */
export const getLocalities = () => {
  return request<{ success: boolean; data: Locality[] }>("/localities");
};

/** Create a locality */
export const createLocality = (data: { name: string; activeProjects?: number; activeGroups?: number }) =>
  request<{ success: boolean; data: Locality }>("/localities", {
    method: "POST",
    body: data,
    auth: true,
  });

/** Delete a locality */
export const deleteLocality = (id: string) =>
  request<{ success: boolean; data: unknown }>(`/localities/${id}`, {
    method: "DELETE",
    auth: true,
  });
