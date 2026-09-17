import "server-only";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { apiBaseUrl } from "@/lib/api-config";
const apiVersion = "v0.8.1";
const accessCookie = "ekipma_admin_access";
const refreshCookie = "ekipma_admin_refresh";

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
  id: string;
  createdAt: string;
  name: string;
  description: string;
  public: boolean;
  photoUrl: string;
  adminId: string;
  adminName: string;
  memberCount: number;
};
export type AdminGroupPage = { groups: AdminGroup[]; total: number; newLast30Days: number; offset: number; limit: number };
export type AdminOverview = {
  periodDays: number;
  activePremium: number;
  premiumExpiringSevenDays: number;
  expiredPremium: number;
  godPlans: number;
  activeGroups: number;
  previousActiveGroups: number;
  records: number;
  expenses: number;
  turns: number;
  plans: number;
  turnGroups: number;
  collaborationChart: { start: string; value: number }[];
  recentActivity: { id: string; title: string; type: "expense" | "turn" | "plan"; groupId: string; groupName: string; createdAt: string }[];
};
export type AdminActivity = {
  id: string;
  createdAt: string;
  type: "expense" | "turn" | "plan";
  title: string;
  private: boolean;
  groupId: string;
  groupName: string;
  authorId: string;
  authorName: string;
  assigneeId: string;
  assigneeName: string;
  amount?: number;
  turn?: number;
  dueAt?: string;
};
export type AdminActivityPage = { activity: AdminActivity[]; total: number; offset: number; limit: number };
export type AdminMembershipPage = { memberships: AdminUser[]; total: number; active: number; expiring: number; expired: number; god: number; offset: number; limit: number };
export type AdminSystem = {
  api: { status: string };
  database: { status: string; latencyMs: number };
  system: {
    collectedAt: string;
    hostname: string;
    os: string;
    arch: string;
    goVersion: string;
    uptimeSeconds: number;
    processUptimeSeconds: number;
    goroutines: number;
    cpu: { cores: number; usagePercent: number };
    memory: { totalBytes: number; usedBytes: number; processBytes: number; usagePercent: number };
    disk: { path: string; totalBytes: number; usedBytes: number; usagePercent: number };
  };
};

export function adminApiUrl(path: string) {
  return `${apiBaseUrl}/api/v1/admin${path}`;
}

function authApiUrl(path: string) {
  return `${apiBaseUrl}/api/v1/auth${path}`;
}

export async function adminFetch(path: string, token: string) {
  return fetch(adminApiUrl(path), {
    headers: { Authorization: `Bearer ${token}`, "X-Version": apiVersion },
    cache: "no-store",
  });
}

type AuthPair = { accessToken: string; refreshToken: string };

export function setAdminAuthCookies(response: NextResponse, auth: AuthPair) {
  const secure = process.env.NODE_ENV === "production";
  response.cookies.set(accessCookie, auth.accessToken, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 60 * 30 });
  response.cookies.set(refreshCookie, auth.refreshToken, { httpOnly: true, sameSite: "lax", secure, path: "/api/admin", maxAge: 60 * 60 * 24 * 30 });
}

export function clearAdminAuthCookies(response: NextResponse) {
  response.cookies.set(accessCookie, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  response.cookies.set(refreshCookie, "", { httpOnly: true, sameSite: "lax", path: "/api/admin", maxAge: 0 });
}

export async function refreshAdminAuth(refreshToken: string): Promise<AuthPair | null> {
  const refreshed = await fetch(authApiUrl("/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Version": apiVersion },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  }).catch(() => null);
  if (!refreshed?.ok) return null;
  const auth = (await refreshed.json().catch(() => null)) as AuthPair | null;
  if (!auth?.accessToken || !auth.refreshToken) return null;
  const admin = await adminFetch("/me", auth.accessToken);
  return admin.ok ? auth : null;
}

export async function adminProxy(path: string, fallbackError: string) {
  const jar = await cookies();
  let accessToken = jar.get(accessCookie)?.value;
  let upstream = accessToken ? await adminFetch(path, accessToken) : null;
  let refreshed: AuthPair | null = null;
  if (!upstream || upstream.status === 401) {
    const refreshToken = jar.get(refreshCookie)?.value;
    refreshed = refreshToken ? await refreshAdminAuth(refreshToken) : null;
    if (refreshed) {
      accessToken = refreshed.accessToken;
      upstream = await adminFetch(path, accessToken);
    }
  }

  const data = (await upstream?.json().catch(() => ({ error: fallbackError }))) ?? { error: "Unauthenticated" };
  const response = NextResponse.json(data, { status: upstream?.status ?? 401 });
  if (refreshed && upstream?.status !== 401) setAdminAuthCookies(response, refreshed);
  if (!upstream || upstream.status === 401) clearAdminAuthCookies(response);
  return response;
}

export async function getAdminSession(): Promise<{ user: AdminUser; token: string } | null> {
  const token = (await cookies()).get(accessCookie)?.value;
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

export async function getAdminActivity(token: string): Promise<AdminActivityPage | null> {
  const response = await adminFetch("/activity?limit=50", token);
  return response.ok ? response.json() : null;
}

export async function getAdminMemberships(token: string): Promise<AdminMembershipPage | null> {
  const response = await adminFetch("/memberships?limit=50", token);
  return response.ok ? response.json() : null;
}

export async function getAdminSystem(token: string): Promise<AdminSystem | null> {
  const response = await adminFetch("/system", token);
  return response.ok ? response.json() : null;
}
