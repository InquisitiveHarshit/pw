import request from "./client";

export type JoinGroupData = {
  propertyId: string;
  interestedBHK?: string;
  budget?: number;
  message?: string;
};

export type GroupMember = {
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  interestedBHK?: string;
  budget?: number;
  message?: string;
  joinedAt: string;
};

export type Group = {
  _id: string;
  property: {
    _id: string;
    title: string;
    location: string;
    price: number;
    status: string;
  };
  members: GroupMember[];
  status: "forming" | "complete";
  createdAt: string;
};

/** Join (or create) a buying group for a property */
export const joinGroup = (data: JoinGroupData) =>
  request<{ success: boolean; message: string; data: Group }>("/groups/join", {
    method: "POST",
    body: data,
    auth: true,
  });

/** Get current user's groups */
export const getMyGroups = () =>
  request<{ success: boolean; data: Group[] }>("/groups/my", { auth: true });

/** Get all groups — admin only */
export const getAllGroups = () =>
  request<{ success: boolean; total: number; data: Group[] }>("/groups", {
    auth: true,
  });

/** Get single group detail — admin only */
export const getGroupById = (id: string) =>
  request<{ success: boolean; data: Group }>(`/groups/${id}`, { auth: true });
