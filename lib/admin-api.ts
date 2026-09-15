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
export type AdminGroup = {
  id: string; createdAt: string; name: string; description: string; public: boolean;
  photoUrl: string; adminId: string; adminName: string; memberCount: number;
};
export type AdminGroupPage = { groups: AdminGroup[]; total: number; newLast30Days: number; offset: number; limit: number };
export type AdminOverview = {
  periodDays: number; activePremium: number; premiumExpiringSevenDays: number; expiredPremium: number; godPlans: number;
  activeGroups: number; previousActiveGroups: number; records: number; expenses: number; turns: number; plans: number; turnGroups: number;
  collaborationChart: { start: string; value: number }[];
  recentActivity: { id: string; title: string; type: "expense" | "turn" | "plan"; groupId: string; groupName: string; createdAt: string }[];
};
export type AdminSystem = {
  api: { status: string };
  database: { status: string; latencyMs: number };
  system: {
    collectedAt: string; hostname: string; os: string; arch: string; goVersion: string;
    uptimeSeconds: number; processUptimeSeconds: number; goroutines: number;
    cpu: { cores: number; usagePercent: number };
    memory: { totalBytes: number; usedBytes: number; processBytes: number; usagePercent: number };
    disk: { path: string; totalBytes: number; usedBytes: number; usagePercent: number };
  };
};

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

export async function getAdminGroups(token: string): Promise<AdminGroupPage | null> {
  const response = await adminFetch("/groups?limit=50", token);
  return response.ok ? response.json() : null;
}

export async function getAdminOverview(token: string, days = 30): Promise<AdminOverview | null> {
  const response = await adminFetch(`/overview?days=${days}`, token);
  return response.ok ? response.json() : null;
}

export async function getAdminSystem(token: string): Promise<AdminSystem | null> {
  const response = await adminFetch("/system", token);
  return response.ok ? response.json() : null;
}
