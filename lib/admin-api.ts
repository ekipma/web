import "server-only";

import { cookies } from "next/headers";

const apiBaseUrl = process.env.EKIPMA_API_URL ?? "http://127.0.0.1:8086";
const apiVersion = "v0.8.1";

export type AdminUser = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  mobile: string;
  role: number;
  plan: { type: string; expiresAt: string | null };
  photoUrl: string;
};

export type AdminUserPage = { users: AdminUser[]; total: number; offset: number; limit: number };

export function adminApiUrl(path: string) {
  return `${apiBaseUrl}/api/v1/admin${path}`;
}

export async function adminFetch(path: string, token: string) {
  return fetch(adminApiUrl(path), {
    headers: { Authorization: `Bearer ${token}`, "X-Version": apiVersion },
    cache: "no-store",
  });
}

export async function getAdminSession(): Promise<{ user: AdminUser; token: string } | null> {
  const token = (await cookies()).get("ekipma_admin_access")?.value;
  if (!token) return null;
  const response = await adminFetch("/me", token);
  if (!response.ok) return null;
  return { user: await response.json(), token };
}

export async function getAdminUsers(token: string): Promise<AdminUserPage | null> {
  const response = await adminFetch("/users?limit=50", token);
  return response.ok ? response.json() : null;
}
