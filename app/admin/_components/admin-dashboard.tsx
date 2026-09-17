"use client";

import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronsUpDown,
  Clock3,
  CreditCard,
  Crown,
  Cpu,
  Database,
  Download,
  Ellipsis,
  EyeOff,
  FolderKanban,
  Gauge,
  Gem,
  Grid2X2,
  Globe2,
  HardDrive,
  LifeBuoy,
  LockKeyhole,
  LogOut,
  Menu,
  MemoryStick,
  PanelLeft,
  Search,
  Server,
  Settings2,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  ReceiptText,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AdminActivityPage, AdminGroup, AdminMembershipPage, AdminOverview, AdminSystem, AdminUser } from "@/lib/admin-api";

type Section = "Overview" | "Users" | "Groups" | "Activity" | "Memberships" | "System" | "Audit log";
export type User = { id: string; initials: string; name: string; email: string; phone: string; joined: string; plan: "Premium" | "Free"; role: number; status: "Active"; groups: number; color: string };

const navigation: { label: Section; href: string; icon: typeof Grid2X2 }[] = [
  { label: "Overview", href: "/admin", icon: Grid2X2 },
  { label: "Users", href: "/admin/users", icon: UsersRound },
  { label: "Groups", href: "/admin/groups", icon: FolderKanban },
  { label: "Activity", href: "/admin/activity", icon: Activity },
  { label: "Memberships", href: "/admin/memberships", icon: Gem },
  { label: "System", href: "/admin/system", icon: Gauge },
  { label: "Audit log", href: "/admin/audit", icon: ShieldCheck },
];

const avatarColors = ["violet", "cyan", "rose", "amber", "lime"];
export function toDashboardUser(user: AdminUser, index: number): User {
  const initials =
    user.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?";
  return {
    id: user.id,
    initials,
    name: user.name || "Unnamed user",
    email: user.email,
    phone: user.mobile,
    joined: new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(user.createdAt)),
    plan: user.plan.type === "UserPlanPremium" || user.plan.type === "UserPlanGod" ? "Premium" : "Free",
    role: user.role,
    status: "Active",
    groups: 0,
    color: avatarColors[index % avatarColors.length],
  };
}

function Avatar({ user, small = false }: { user: User; small?: boolean }) {
  return <span className={cn(`grid h-7 w-7 place-items-center rounded-full text-[8px] font-bold admin-avatar-${user.color} ${small ? "h-[25px] w-[25px] text-[7px]" : ""}`)}>{user.initials}</span>;
}

export function EmptySection({ name }: { name: Section }) {
  const copy: Record<Exclude<Section, "Overview" | "Users">, string> = {
    Groups: "Search and inspect groups, their memberships, visibility, and activity once the admin API is connected.",
    Activity: "Review logical expense, turn, and plan activity without exposing or changing private record details by default.",
    Memberships: "Manage access history and upcoming Premium expiry once entitlement provenance is stored by the backend.",
    System: "Show API and database readiness, client-version rules, and request-ID diagnostics from live operational sources.",
    "Audit log": "Every future administrative read and change will appear here with actor, target, reason, outcome, and time.",
  };
  return (
    <section className="admin-empty-section max-w-200 pt-12.5 max-mobile:pt-6">
      <div className="admin-section-kicker text-[9px] leading-[normal] font-bold tracking-[1.25px] text-[#888998]">INTERNAL OPERATIONS</div>
      <h1>{name}</h1>
      <p>{copy[name as Exclude<Section, "Overview" | "Users">]}</p>
      <Card>
        <CardContent className="admin-empty-card flex items-center gap-[15px] p-6">
          <ShieldCheck />
          <div>
            <strong>Backend integration is intentionally pending</strong>
            <span>This section is designed but not connected to customer data or administrative actions.</span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export function UsersTable({ users, total }: { users: User[]; total: number }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => users.filter((user) => `${user.name} ${user.phone} ${user.email}`.toLowerCase().includes(query.toLowerCase())), [query, users]);
  return (
    <section className="grid gap-[25px]">
      <div className="admin-page-heading flex items-end justify-between gap-6 max-mobile:grid max-mobile:items-start">
        <div>
          <div className="admin-section-kicker text-[9px] leading-[normal] font-bold tracking-[1.25px] text-[#888998]">CUSTOMER OPERATIONS</div>
          <h1>Users</h1>
          <p>Search people and review their account access.</p>
        </div>
      </div>
      <Card>
        <CardHeader className="admin-table-header flex flex-row items-center justify-between gap-4.5 max-mobile:flex-col max-mobile:items-stretch">
          <div>
            <CardTitle>All users</CardTitle>
            <CardDescription>
              Showing {users.length.toLocaleString()} of {total.toLocaleString()} · newest first
            </CardDescription>
          </div>
          <div className="admin-search flex w-62.5 items-center gap-[7px] rounded-[6px] border border-[var(--input)] pl-[9px] text-[#878996] max-mobile:w-full">
            <Search />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, mobile, or email" aria-label="Search users" />
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto pt-0 pr-[5px] pb-[5px] pl-[5px] max-mobile:px-0">
          <table className="admin-table w-full text-left max-mobile:min-w-165">
            <thead>
              <tr>
                <th>Person</th>
                <th>Membership</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="admin-person flex items-center gap-[9px]">
                      <Avatar user={user} />
                      <div>
                        <strong>{user.name}</strong>
                        <span>{user.email || user.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge variant={user.plan === "Premium" ? "secondary" : "outline"}>{user.plan}</Badge>
                  </td>
                  <td>{user.role === 3 ? "Admin" : user.role === 2 ? "Operator" : "Member"}</td>
                  <td>{user.joined}</td>
                  <td>
                    <Badge variant="success">
                      <i className="admin-status-dot mr-[5px] h-[5px] w-[5px] rounded-full" />
                      {user.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="p-7.5 text-center text-[12px] text-[#858793]">No users match “{query}”.</div>}
        </CardContent>
      </Card>
    </section>
  );
}

export function UsersPanel({ users, total }: { users: AdminUser[]; total: number }) {
  return <UsersTable users={users.map(toDashboardUser)} total={total} />;
}

function GroupMark({ group }: { group: AdminGroup }) {
  const initials =
    group.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "G";
  return <span className="admin-group-mark grid h-7 w-7 flex-none place-items-center rounded-[8px] text-[8px] font-bold text-[#83dfeb]">{initials}</span>;
}

export function GroupsTable({ groups, total }: { groups: AdminGroup[]; total: number }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => groups.filter((group) => `${group.name} ${group.description} ${group.adminName}`.toLowerCase().includes(query.toLowerCase())), [groups, query]);
  return (
    <section className="grid gap-[25px]">
      <div className="admin-page-heading flex items-end justify-between gap-6 max-mobile:grid max-mobile:items-start">
        <div>
          <div className="admin-section-kicker text-[9px] leading-[normal] font-bold tracking-[1.25px] text-[#888998]">COLLABORATION</div>
          <h1>Groups</h1>
          <p>See where people organize expenses, turns, and plans.</p>
        </div>
      </div>
      <Card>
        <CardHeader className="admin-table-header flex flex-row items-center justify-between gap-4.5 max-mobile:flex-col max-mobile:items-stretch">
          <div>
            <CardTitle>All groups</CardTitle>
            <CardDescription>
              Showing {groups.length.toLocaleString()} of {total.toLocaleString()} · newest first
            </CardDescription>
          </div>
          <div className="admin-search flex w-62.5 items-center gap-[7px] rounded-[6px] border border-[var(--input)] pl-[9px] text-[#878996] max-mobile:w-full">
            <Search />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search group, description, or owner" aria-label="Search groups" />
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto pt-0 pr-[5px] pb-[5px] pl-[5px] max-mobile:px-0">
          <table className="admin-table admin-groups-table w-full text-left max-mobile:min-w-165">
            <thead>
              <tr>
                <th>Group</th>
                <th>Owner</th>
                <th>Members</th>
                <th>Visibility</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((group) => (
                <tr key={group.id}>
                  <td>
                    <div className="admin-person flex items-center gap-[9px]">
                      <GroupMark group={group} />
                      <div>
                        <strong>{group.name}</strong>
                        <span>{group.description || "No description"}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong className="text-[11px] font-medium text-[#d8d9de]">{group.adminName || `User ${group.adminId}`}</strong>
                  </td>
                  <td>
                    <span className="admin-member-count inline-flex items-center gap-[5px] text-[#bdbec7]">
                      <UsersRound /> {group.memberCount}
                    </span>
                  </td>
                  <td>
                    <Badge variant={group.public ? "success" : "outline"}>
                      {group.public ? <Globe2 /> : <LockKeyhole />}
                      {group.public ? "Public" : "Private"}
                    </Badge>
                  </td>
                  <td>{new Date(group.createdAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="p-7.5 text-center text-[12px] text-[#858793]">No groups match “{query}”.</div>}
        </CardContent>
      </Card>
    </section>
  );
}

function activityDetail(item: AdminActivityPage["activity"][number]) {
  if (item.type === "expense") return item.amount ? `Amount ${item.amount.toLocaleString()}` : "Expense recorded";
  if (item.type === "turn") return `Rotation ${item.turn || 1}`;
  return item.dueAt ? `Due ${new Date(item.dueAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}` : "Plan created";
}

export function ActivityPanel({ initial }: { initial: AdminActivityPage | null }) {
  const [page, setPage] = useState(initial);
  const [kind, setKind] = useState("all");
  const [pending, setPending] = useState(false);
  async function changeKind(value: string) {
    setKind(value);
    setPending(true);
    const response = await fetch(`/api/admin/activity?limit=50&type=${value}`, { cache: "no-store" });
    if (response.ok) setPage(await response.json());
    setPending(false);
  }
  const icons = { expense: CreditCard, turn: CheckCircle2, plan: CalendarDays };
  return (
    <section className="admin-activity-section grid gap-5">
      <div className="admin-page-heading flex items-end justify-between gap-6 max-mobile:grid max-mobile:items-start">
        <div>
          <div className="admin-section-kicker text-[9px] leading-[normal] font-bold tracking-[1.25px] text-[#888998]">PRODUCT ACTIVITY</div>
          <h1>Activity</h1>
          <p>Recent product events with private titles redacted.</p>
        </div>
        <Button variant="outline" onClick={() => changeKind(kind)} disabled={pending}>
          <RefreshCw className={pending ? "is-spinning" : ""} /> Refresh
        </Button>
      </div>
      <Tabs value={kind} onValueChange={changeKind}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="expense">Expenses</TabsTrigger>
          <TabsTrigger value="turn">Turns</TabsTrigger>
          <TabsTrigger value="plan">Plans</TabsTrigger>
        </TabsList>
      </Tabs>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Recent events</CardTitle>
            <CardDescription>
              Showing {page?.activity.length ?? 0} of {page?.total ?? 0} records · newest first
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto pt-0 pr-[5px] pb-[5px] pl-[5px] max-mobile:px-0">
          <table className="admin-table w-full min-w-215 text-left max-mobile:min-w-165">
            <thead>
              <tr>
                <th>Event</th>
                <th>Group</th>
                <th>People</th>
                <th>Details</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {page?.activity.map((item) => {
                const Icon = icons[item.type];
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="admin-activity-person flex items-center gap-[9px]">
                        <span className={cn(`admin-event-icon grid h-7 w-7 place-items-center rounded-[7px] admin-event-${item.type === "expense" ? "pay" : item.type}`)}>
                          <Icon />
                        </span>
                        <div>
                          <strong>{item.title}</strong>
                          <span>
                            {item.private ? (
                              <>
                                <EyeOff /> Private title hidden
                              </>
                            ) : (
                              item.type
                            )}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>{item.groupName || "Personal"}</td>
                    <td>
                      <div className="admin-activity-people">
                        <strong>{item.authorName || `User ${item.authorId}`}</strong>
                        <span>to {item.assigneeName || `User ${item.assigneeId}`}</span>
                      </div>
                    </td>
                    <td>{activityDetail(item)}</td>
                    <td>{relativeTime(item.createdAt)} ago</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!page?.activity.length && <div className="p-7.5 text-center text-[12px] text-[#858793]">No activity found for this filter.</div>}
        </CardContent>
      </Card>
    </section>
  );
}

function membershipStatus(user: AdminUser) {
  if (user.plan.type === "UserPlanNormal") return { label: "Free", tone: "outline" as const };
  if (!user.plan.expiresAt || new Date(user.plan.expiresAt).getTime() <= Date.now()) return { label: "Expired", tone: "warning" as const };
  if (new Date(user.plan.expiresAt).getTime() <= Date.now() + 7 * 86400000) return { label: "Expiring", tone: "warning" as const };
  return { label: "Active", tone: "success" as const };
}

export function MembershipsPanel({ initial }: { initial: AdminMembershipPage | null }) {
  const [page, setPage] = useState(initial);
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState(false);
  async function load(nextStatus = status) {
    setStatus(nextStatus);
    setPending(true);
    const params = new URLSearchParams({ limit: "50", status: nextStatus });
    if (query.trim()) params.set("q", query.trim());
    const response = await fetch(`/api/admin/memberships?${params}`, { cache: "no-store" });
    if (response.ok) setPage(await response.json());
    setPending(false);
  }
  return (
    <section className="admin-memberships-section grid gap-5">
      <div className="admin-page-heading flex items-end justify-between gap-6 max-mobile:grid max-mobile:items-start">
        <div>
          <div className="admin-section-kicker text-[9px] leading-[normal] font-bold tracking-[1.25px] text-[#888998]">ACCESS & PLANS</div>
          <h1>Memberships</h1>
          <p>Review current Premium access and upcoming expirations.</p>
        </div>
      </div>
      <div className="admin-membership-metrics grid grid-cols-4 gap-[13px] max-admin-tablet:grid-cols-[1fr_1fr] max-mobile:gap-[9px]">
        <MetricCard label="Active Premium" value={(page?.active ?? 0).toLocaleString()} trend="Live" detail="Premium and God" icon={Gem} color="violet" up />
        <MetricCard label="Expiring soon" value={(page?.expiring ?? 0).toLocaleString()} trend="7 days" detail="needs attention" icon={Clock3} color="amber" up />
        <MetricCard label="Expired" value={(page?.expired ?? 0).toLocaleString()} trend="Live" detail="historical access" icon={ReceiptText} color="cyan" up />
        <MetricCard label="God plans" value={(page?.god ?? 0).toLocaleString()} trend="Live" detail="currently active" icon={Crown} color="green" up />
      </div>
      <Card aria-busy={pending}>
        <CardHeader className="admin-memberships-head flex flex-row items-center justify-between gap-[15px] max-mobile:flex-col max-mobile:items-stretch">
          <Tabs value={status} onValueChange={load}>
            <TabsList>
              <TabsTrigger value="all" disabled={pending}>
                All
              </TabsTrigger>
              <TabsTrigger value="active" disabled={pending}>
                Active
              </TabsTrigger>
              <TabsTrigger value="expiring" disabled={pending}>
                Expiring
              </TabsTrigger>
              <TabsTrigger value="expired" disabled={pending}>
                Expired
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <form
            className="admin-search flex w-62.5 items-center gap-[7px] rounded-[6px] border border-[var(--input)] pl-[9px] text-[#878996] max-mobile:w-full"
            onSubmit={(event) => {
              event.preventDefault();
              load();
            }}
          >
            <Search />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, mobile, or email" aria-label="Search memberships" disabled={pending} />
          </form>
        </CardHeader>
        <CardContent className="overflow-x-auto pt-0 pr-[5px] pb-[5px] pl-[5px] max-mobile:px-0">
          <table className="admin-table w-full text-left max-mobile:min-w-165">
            <thead>
              <tr>
                <th>Person</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Expires</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {page?.memberships.map((user, index) => {
                const state = membershipStatus(user);
                const person = toDashboardUser(user, index);
                return (
                  <tr key={user.id}>
                    <td>
                      <div className="admin-person flex items-center gap-[9px]">
                        <Avatar user={person} />
                        <div>
                          <strong>{user.name || "Unnamed user"}</strong>
                          <span>{user.email || user.mobile}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge variant={user.plan.type === "UserPlanGod" ? "secondary" : "outline"}>{user.plan.type === "UserPlanGod" ? "God" : user.plan.type === "UserPlanPremium" ? "Premium" : "Free"}</Badge>
                    </td>
                    <td>
                      <Badge variant={state.tone}>
                        <i className="admin-status-dot mr-[5px] h-[5px] w-[5px] rounded-full" />
                        {state.label}
                      </Badge>
                    </td>
                    <td>{user.plan.expiresAt ? new Date(user.plan.expiresAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" }) : "Never"}</td>
                    <td>{user.role === 3 ? "Admin" : user.role === 2 ? "Operator" : "Member"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!page?.memberships.length && <div className="p-7.5 text-center text-[12px] text-[#858793]">No memberships match this filter.</div>}
        </CardContent>
      </Card>
    </section>
  );
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const unit = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** unit).toFixed(unit > 2 ? 1 : 0)} ${units[unit]}`;
}

function formatUptime(seconds: number) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return days ? `${days}d ${hours}h` : hours ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function relativeTime(value: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

function ResourceCard({ icon: Icon, label, percent, value, detail, tone }: { icon: typeof Cpu; label: string; percent: number; value: string; detail: string; tone: string }) {
  const safePercent = Math.max(0, Math.min(100, percent));
  return (
    <Card className="admin-resource-card">
      <CardContent>
        <div className={cn(`admin-resource-icon grid h-8 w-8 place-items-center rounded-[8px] ${tone}`)}>
          <Icon />
        </div>
        <div className="admin-resource-head mt-4.5 flex items-end justify-between">
          <span>{label}</span>
          <strong>{safePercent.toFixed(1)}%</strong>
        </div>
        <div className="admin-resource-track mt-2.5 mr-0 mb-[15px] ml-0 h-[5px] overflow-hidden rounded-[999px] bg-[#25262d]">
          <i style={{ width: `${safePercent}%` }} />
        </div>
        <b>{value}</b>
        <small>{detail}</small>
      </CardContent>
    </Card>
  );
}

export function SystemPanel({ initial }: { initial: AdminSystem | null }) {
  const [snapshot, setSnapshot] = useState(initial);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function refresh() {
    setPending(true);
    setError("");
    const response = await fetch("/api/admin/system", { cache: "no-store" });
    if (response.ok) setSnapshot(await response.json());
    else setError("Could not refresh the server snapshot.");
    setPending(false);
  }
  if (!snapshot)
    return (
      <section className="admin-system-section grid gap-4.5">
        <div className="admin-page-heading flex items-end justify-between gap-6 max-mobile:grid max-mobile:items-start">
          <div>
            <div className="admin-section-kicker text-[9px] leading-[normal] font-bold tracking-[1.25px] text-[#888998]">INFRASTRUCTURE</div>
            <h1>System</h1>
            <p>The server metrics endpoint is currently unavailable.</p>
          </div>
          <Button onClick={refresh} disabled={pending}>
            <RefreshCw /> Retry
          </Button>
        </div>
      </section>
    );
  const { system } = snapshot;
  return (
    <section className="admin-system-section grid gap-4.5">
      <div className="admin-page-heading flex items-end justify-between gap-6 max-mobile:grid max-mobile:items-start">
        <div>
          <div className="admin-section-kicker text-[9px] leading-[normal] font-bold tracking-[1.25px] text-[#888998]">INFRASTRUCTURE</div>
          <h1>System</h1>
          <p>Live health and capacity from {system.hostname || "the API host"}.</p>
        </div>
        <Button variant="outline" onClick={refresh} disabled={pending}>
          <RefreshCw className={pending ? "is-spinning" : ""} /> {pending ? "Refreshing…" : "Refresh snapshot"}
        </Button>
      </div>
      {error && (
        <p className="rounded-[7px] border border-[#e85c7b45] bg-[#e85c7b10] px-3 py-2.5 text-[10px] text-[#f68ba4]" role="alert">
          {error}
        </p>
      )}
      <div className="admin-status-grid grid grid-cols-[1fr_1fr] gap-[13px] max-mobile:grid-cols-[1fr]">
        <Card>
          <CardContent>
            <span className="admin-system-status ready grid h-9 w-9 flex-none place-items-center rounded-[9px]">
              <Server />
            </span>
            <div>
              <small>API service</small>
              <strong>{snapshot.api.status}</strong>
              <span>Process uptime {formatUptime(system.processUptimeSeconds)}</span>
            </div>
            <Badge variant="success">Healthy</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <span className={cn(`admin-system-status grid h-9 w-9 flex-none place-items-center rounded-[9px] ${snapshot.database.status === "operational" ? "ready" : "warning"}`)}>
              <Database />
            </span>
            <div>
              <small>PostgreSQL</small>
              <strong>{snapshot.database.status}</strong>
              <span>{snapshot.database.latencyMs.toFixed(1)} ms ping</span>
            </div>
            <Badge variant={snapshot.database.status === "operational" ? "success" : "warning"}>{snapshot.database.status === "operational" ? "Healthy" : "Degraded"}</Badge>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-3 gap-[13px] max-admin-tablet:grid-cols-[1fr_1fr] max-mobile:grid-cols-[1fr]">
        <ResourceCard icon={Cpu} label="CPU usage" percent={system.cpu.usagePercent} value={`${system.cpu.cores} logical cores`} detail="Host utilization during the latest sample" tone="violet" />
        <ResourceCard icon={MemoryStick} label="Memory usage" percent={system.memory.usagePercent} value={`${formatBytes(system.memory.usedBytes)} / ${formatBytes(system.memory.totalBytes)}`} detail={`${formatBytes(system.memory.processBytes)} used by the API process`} tone="cyan" />
        <ResourceCard icon={HardDrive} label="Disk usage" percent={system.disk.usagePercent} value={`${formatBytes(system.disk.usedBytes)} / ${formatBytes(system.disk.totalBytes)}`} detail={`Filesystem mounted at ${system.disk.path}`} tone="amber" />
      </div>
      <div className="admin-system-detail-grid grid grid-cols-[1fr_1fr] gap-[13px] max-mobile:grid-cols-[1fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Runtime</CardTitle>
              <CardDescription>Current server process</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="admin-runtime-list grid">
            <div>
              <span>Go version</span>
              <strong>{system.goVersion}</strong>
            </div>
            <div>
              <span>Platform</span>
              <strong>
                {system.os} / {system.arch}
              </strong>
            </div>
            <div>
              <span>Goroutines</span>
              <strong>{system.goroutines.toLocaleString()}</strong>
            </div>
            <div>
              <span>Process uptime</span>
              <strong>{formatUptime(system.processUptimeSeconds)}</strong>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Host</CardTitle>
              <CardDescription>Machine-level context</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="admin-runtime-list grid">
            <div>
              <span>Hostname</span>
              <strong>{system.hostname || "Unavailable"}</strong>
            </div>
            <div>
              <span>Host uptime</span>
              <strong>{formatUptime(system.uptimeSeconds)}</strong>
            </div>
            <div>
              <span>Collected</span>
              <strong>{new Date(system.collectedAt).toLocaleString()}</strong>
            </div>
            <div>
              <span>Refresh mode</span>
              <strong>Manual snapshot</strong>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export function AdminShell({ currentUser, children }: { currentUser: AdminUser; children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const activeItem = navigation.find((item) => item.href === pathname) ?? navigation[0];
  const initials =
    currentUser.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "AD";
  const searchResults = navigation.filter((item) => item.label.toLowerCase().includes(searchQuery.trim().toLowerCase()));

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function openSearch() {
    setSearchQuery("");
    setSearchOpen(true);
  }

  function selectSearchResult(href: string) {
    setSearchOpen(false);
    router.push(href);
  }

  const navItems = (mobile = false) => (
    <nav className={mobile ? "admin-mobile-nav-list max-mobile:mt-[35px] max-mobile:grid max-mobile:gap-1.5 max-mobile:self-start" : "admin-nav-list grid gap-[3px]"} aria-label="Admin sections">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.label} href={item.href} className={activeItem.label === item.label ? "is-active" : ""} onClick={() => setMobileNavOpen(false)}>
            <Icon />
            <span>{item.label}</span>
            {item.label === "Audit log" && <Badge variant="outline">Soon</Badge>}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="admin-app grid min-h-screen grid-cols-[252px_minmax(0,_1fr)] max-admin-tablet:grid-cols-[70px_minmax(0,_1fr)] max-mobile:block">
      <aside className="sticky top-0 flex h-screen flex-col border-r border-r-border bg-[#101116] pt-5 pr-3 pb-[13px] pl-3 max-admin-tablet:items-center max-admin-tablet:px-[9px] max-mobile:hidden">
        <Link className="admin-brand flex items-center gap-[7px] px-[9px] py-0 text-[20px] font-[750] tracking-[-1px] text-[#f7f7fa] max-admin-tablet:p-0" href="/admin" aria-label="Ekipma admin home">
          <Image src="/images/app-logo.svg" width={30} height={30} alt="" />
          <span>
            ekipma<span>.</span>
          </span>
          <em>ADMIN</em>
        </Link>
        <div className="admin-workspace mt-7.5 mr-1 mb-4.5 ml-1 max-admin-tablet:mt-7.5 max-admin-tablet:mr-0 max-admin-tablet:mb-4.5 max-admin-tablet:ml-0">
          <span>WORKSPACE</span>
          <button>
            <span className="admin-workspace-mark grid h-6 w-6 place-items-center rounded-[6px] text-[12px] font-extrabold text-[#201b32]">E</span>
            <strong>Ekipma</strong>
            <ChevronsUpDown />
          </button>
        </div>
        {navItems()}
        <div className="admin-sidebar-bottom mt-auto grid gap-[3px] max-admin-tablet:w-full max-admin-tablet:items-center">
          <a href="/" target="_blank">
            <PanelLeft />
            <span>View landing</span>
            <ArrowUpRight />
          </a>
          <button>
            <LifeBuoy /> Help & docs
          </button>
          <div className="admin-account mt-2.5 flex items-center gap-2 border-t border-t-[#25262d] pt-3 pr-[7px] pb-0 pl-[7px] max-admin-tablet:w-full max-admin-tablet:justify-center max-admin-tablet:px-0">
            <span className="admin-owner-avatar grid h-7 w-7 flex-none place-items-center rounded-full bg-[#41355a] text-[9px] font-bold text-[#ddd2ff] max-admin-tablet:h-7.5 max-admin-tablet:w-7.5">{initials}</span>
            <div>
              <strong>{currentUser.name}</strong>
              <span>Administrator</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" aria-label="Open account menu">
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Administrator account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings2 /> Preferences
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await fetch("/api/admin/logout", { method: "POST" });
                    router.replace("/admin/login");
                    router.refresh();
                  }}
                >
                  <LogOut /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
      <main className="min-w-0">
        <header className="admin-topbar sticky top-0 z-20 flex h-16 items-center justify-between border-b border-b-border bg-[#0c0d10e8] px-8 py-0 max-mobile:h-[57px] max-mobile:px-4 max-mobile:py-0">
          <div className="flex items-center">
            <Button className="hidden max-mobile:inline-flex" variant="ghost" size="icon" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}>
              <Menu />
            </Button>
            <div className="admin-breadcrumb flex items-center gap-2 text-[11px] text-[#777984] max-mobile:text-[10px]">
              <strong>{activeItem?.label}</strong>
            </div>
          </div>
          <div className="admin-topbar-actions flex items-center gap-[7px]">
            <button className="admin-command-button flex h-8 w-52.5 items-center gap-2 rounded-[6px] border border-border bg-[#14151a] px-2 py-0 text-left text-[11px] text-[#858793] max-mobile:hidden" onClick={openSearch}>
              <Search />
              <span>Search</span>
              <kbd>⌘ K</kbd>
            </button>
            <Button size="icon" variant="ghost" aria-label="Notifications">
              <Bell />
            </Button>
            <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-[#41355a] text-[9px] font-bold text-[#ddd2ff] max-mobile:hidden">HG</span>
          </div>
        </header>
        <div className="admin-local-notice mt-4.5 mr-8 mb-0 ml-8 flex items-center gap-[9px] rounded-[8px] border border-[#a99bff26] bg-[#a99bff0b] px-[13px] py-2.5 text-[11px] text-[#b6b3c5] max-mobile:mt-3.5 max-mobile:mr-4 max-mobile:mb-0 max-mobile:ml-4 max-mobile:items-start max-mobile:text-[10px] max-mobile:leading-[1.55]">
          <Sparkles />
          <span>
            <strong>Protected admin session.</strong> Overview, user, group, and system data are live.
          </span>
          <button onClick={() => setNoticeOpen(true)}>
            Data notes <ArrowUpRight />
          </button>
        </div>
        <div className="mx-auto my-0 w-[min(1440px,_100%)] pt-8.5 pr-8 pb-12 pl-8 max-mobile:pt-[27px] max-mobile:pr-4 max-mobile:pb-9 max-mobile:pl-4">{children}</div>
      </main>
      {mobileNavOpen && (
        <div className="hidden max-mobile:fixed max-mobile:inset-0 max-mobile:z-60 max-mobile:grid max-mobile:grid-rows-[auto_1fr] max-mobile:bg-[#111217] max-mobile:p-4.5">
          <div className="max-mobile:flex max-mobile:items-center max-mobile:justify-between">
            <Link className="admin-brand flex items-center gap-[7px] px-[9px] py-0 text-[20px] font-[750] tracking-[-1px] text-[#f7f7fa] max-admin-tablet:p-0" href="/admin">
              <Image src="/images/app-logo.svg" width={30} height={30} alt="" />
              <span>
                ekipma<span>.</span>
              </span>
              <em>ADMIN</em>
            </Link>
            <Button size="icon" variant="ghost" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation">
              <X />
            </Button>
          </div>
          {navItems(true)}
        </div>
      )}
      <Dialog open={noticeOpen} onOpenChange={setNoticeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Live data notes</DialogTitle>
            <DialogDescription>This dashboard reads protected operational summaries from Ekipma’s API.</DialogDescription>
          </DialogHeader>
          <div className="admin-dialog-points grid gap-2.5 rounded-[8px] bg-[#ffffff05] p-3.5 text-[11px] leading-[1.55] text-[#aeb0ba]">
            <div>
              <CheckCircle2 /> Recent activity excludes private records and record descriptions.
            </div>
            <div>
              <CheckCircle2 /> Multi-assignee records are deduplicated in the activity feed.
            </div>
            <div>
              <CheckCircle2 /> Membership changes remain read-only until an audited entitlement workflow is added.
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setNoticeOpen(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search admin</DialogTitle>
            <DialogDescription>Find an area of the operations console.</DialogDescription>
          </DialogHeader>
          <div className="admin-command-search flex items-center gap-2 rounded-[7px] border border-[var(--input)] pl-2.5 text-[#8d8f9a]">
            <Search />
            <Input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search sections…" aria-label="Search admin sections" />
          </div>
          <div className="admin-command-results grid gap-1">
            {searchResults.length ? (
              searchResults.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.href} onClick={() => selectSearchResult(item.href)}>
                    <span>
                      <Icon />
                      {item.label}
                    </span>
                    <ArrowUpRight />
                  </button>
                );
              })
            ) : (
              <p>No admin sections match “{searchQuery}”.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function Overview({ overview: initialOverview, adminName, users, total, groups, newGroups, system }: { overview: AdminOverview | null; adminName: string; users: User[]; total: number; groups: AdminGroup[]; newGroups: number; system: AdminSystem | null }) {
  const router = useRouter();
  const [overview, setOverview] = useState(initialOverview);
  const [loadingPeriod, setLoadingPeriod] = useState(false);
  async function changePeriod(days: number) {
    setLoadingPeriod(true);
    const response = await fetch(`/api/admin/overview?days=${days}`, { cache: "no-store" });
    if (response.ok) setOverview(await response.json());
    setLoadingPeriod(false);
  }
  function exportSnapshot() {
    if (!overview) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify({ generatedAt: new Date().toISOString(), overview, users: users.slice(0, 5), groups: groups.slice(0, 5), system }, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ekipma-admin-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
  const activeTrend = overview && overview.previousActiveGroups > 0 ? ((overview.activeGroups - overview.previousActiveGroups) / overview.previousActiveGroups) * 100 : 0;
  const chartMax = Math.max(1, ...(overview?.collaborationChart.map((point) => point.value) ?? [1]));
  const activityIcons = { expense: CreditCard, turn: CheckCircle2, plan: CalendarDays };
  return (
    <>
      <section className="admin-overview-heading flex items-end justify-between gap-6 max-mobile:grid max-mobile:items-start">
        <div>
          <div className="admin-section-kicker text-[9px] leading-[normal] font-bold tracking-[1.25px] text-[#888998]">{new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date()).toUpperCase()}</div>
          <h1>Welcome back, {adminName.split(/\s+/)[0] || "Admin"}.</h1>
          <p>Here’s the live pulse of Ekipma today.</p>
        </div>
        <div className="admin-heading-actions flex gap-2 max-mobile:w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={loadingPeriod}>
                <CalendarDays /> Last {overview?.periodDays ?? 30} days <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changePeriod(7)}>Last 7 days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changePeriod(30)}>Last 30 days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changePeriod(90)}>Last 90 days</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={exportSnapshot} disabled={!overview}>
            <Download /> Export snapshot
          </Button>
        </div>
      </section>
      <section className="mt-[27px] grid grid-cols-4 gap-[13px] max-mobile:mt-[21px] max-mobile:grid-cols-[1fr_1fr] max-mobile:gap-[9px]" aria-label="Overview metrics">
        <MetricCard label="Total people" value={total.toLocaleString()} trend="Live" detail="registered accounts" icon={UsersRound} color="violet" up />
        <MetricCard label="Collaborating groups" value={(overview?.activeGroups ?? 0).toLocaleString()} trend={`${Math.abs(activeTrend).toFixed(1)}%`} detail={`vs prior ${overview?.periodDays ?? 30} days`} icon={FolderKanban} color="cyan" up={activeTrend >= 0} />
        <MetricCard label="Premium access" value={(overview?.activePremium ?? 0).toLocaleString()} trend="Live" detail="currently active" icon={Gem} color="lavender" up />
        <MetricCard label="New groups" value={newGroups.toLocaleString()} trend="Live" detail="last 30 days" icon={Sparkles} color="green" up />
      </section>
      <section className="admin-overview-entities mt-[13px] grid grid-cols-[1fr_1fr] gap-[13px] max-admin-tablet:grid-cols-[1fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Newest people</CardTitle>
              <CardDescription>Live accounts · latest 5</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {users.length ? (
              <div className="grid">
                {users.slice(0, 5).map((user) => (
                  <div className="admin-overview-user flex items-center gap-2.5 border-b border-b-[#25262d] px-0 py-[9px]" key={user.id}>
                    <Avatar user={user} small />
                    <div>
                      <strong>{user.name}</strong>
                      <span>{user.email || user.phone}</span>
                    </div>
                    <time>{user.joined}</time>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-7.5 text-center text-[12px] text-[#858793]">No accounts found.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Newest groups</CardTitle>
              <CardDescription>Live groups · latest 5</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {groups.length ? (
              <div className="grid">
                {groups.slice(0, 5).map((group) => (
                  <div className="admin-overview-user flex items-center gap-2.5 border-b border-b-[#25262d] px-0 py-[9px]" key={group.id}>
                    <GroupMark group={group} />
                    <div>
                      <strong>{group.name}</strong>
                      <span>
                        {group.memberCount} {group.memberCount === 1 ? "member" : "members"} · {group.public ? "Public" : "Private"}
                      </span>
                    </div>
                    <time>{new Date(group.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" })}</time>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-7.5 text-center text-[12px] text-[#858793]">No groups found.</p>
            )}
          </CardContent>
        </Card>
      </section>
      <section className="admin-overview-grid mt-[13px] grid grid-cols-[minmax(0,_1.65fr)_minmax(275px,_.85fr)] gap-[13px] max-admin-tablet:grid-cols-[1fr] max-mobile:mt-[9px] max-mobile:gap-[9px]">
        <Card className="admin-activity-card">
          <CardHeader>
            <div>
              <CardTitle>Collaboration activity</CardTitle>
              <CardDescription>Distinct groups with records · {overview?.periodDays ?? 30}-day window</CardDescription>
            </div>
            <Badge variant="outline">12 intervals</Badge>
          </CardHeader>
          <CardContent>
            <div className="admin-chart-summary flex items-end justify-between">
              <div>
                <strong>{(overview?.activeGroups ?? 0).toLocaleString()}</strong>
                <span>active groups</span>
              </div>
              <Badge variant={activeTrend >= 0 ? "success" : "warning"}>
                {activeTrend >= 0 ? <ArrowUpRight /> : <ArrowDownRight />} {Math.abs(activeTrend).toFixed(1)}%
              </Badge>
            </div>
            <div className="admin-bar-chart mt-5.5 flex h-40 items-end gap-[5.5%] border-b border-b-[#2a2b33] px-2 py-0 max-mobile:h-30" aria-label="Active groups chart">
              {overview?.collaborationChart.map((point, index) => (
                <span key={point.start} title={`${new Date(point.start).toLocaleDateString()}: ${point.value}`} style={{ height: `${Math.max(4, (point.value / chartMax) * 100)}%` }} className={index === overview.collaborationChart.length - 1 ? "is-latest" : ""}>
                  <i />
                </span>
              ))}
            </div>
            <div className="admin-chart-axis flex justify-between pt-[9px] text-[8px] leading-[normal] font-normal tracking-[.5px] text-[#737581]">
              <span>{overview?.collaborationChart[0] ? new Date(overview.collaborationChart[0].start).toLocaleDateString("en", { month: "short", day: "numeric" }) : "—"}</span>
              <span>{overview?.records.toLocaleString() ?? 0} records</span>
              <span>{overview?.collaborationChart.at(-1) ? new Date(overview.collaborationChart.at(-1)!.start).toLocaleDateString("en", { month: "short", day: "numeric" }) : "—"}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="max-admin-tablet:order-2">
          <CardHeader>
            <div>
              <CardTitle>Service pulse</CardTitle>
              <CardDescription>{system ? `Sampled ${new Date(system.system.collectedAt).toLocaleTimeString()}` : "Live metrics unavailable"}</CardDescription>
            </div>
            <Button size="icon" variant="ghost" aria-label="System status" onClick={() => router.push("/admin/system")}>
              <Gauge />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-1">
              <HealthRow label="API service" status={system ? "Ready" : "Unknown"} tone={system ? "ready" : "unknown"} detail={system ? `Up ${formatUptime(system.system.processUptimeSeconds)}` : "Could not read server metrics"} />
              <HealthRow label="Database" status={system?.database.status === "operational" ? "Ready" : "Degraded"} tone={system?.database.status === "operational" ? "ready" : "unknown"} detail={system ? `${system.database.latencyMs.toFixed(1)} ms ping` : "Readiness unavailable"} />
              <HealthRow label="Admin API" status="Ready" tone="ready" detail="Role-protected operations endpoint" />
            </div>
            <button className="admin-card-link mt-[17px] inline-flex items-center gap-1 border-0 bg-transparent p-0 text-[10px] text-[#b8affb]" onClick={() => router.push("/admin/system")}>
              View system metrics <ArrowUpRight />
            </button>
          </CardContent>
        </Card>
      </section>
      <section className="admin-detail-grid mt-[13px] grid grid-cols-[minmax(0,_1.65fr)_minmax(275px,_.85fr)] gap-[13px] max-admin-tablet:grid-cols-[1fr] max-mobile:mt-[9px] max-mobile:gap-[9px]">
        <Card className="admin-recent-card">
          <CardHeader>
            <div>
              <CardTitle>Recent collaboration</CardTitle>
              <CardDescription>Latest public group activity</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/activity")}>
              View activity <ArrowUpRight />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid">
              {overview?.recentActivity.length ? (
                overview.recentActivity.map((event) => {
                  const Icon = activityIcons[event.type];
                  return (
                    <div key={event.id} className="admin-activity-row grid grid-cols-[30px_minmax(0,_1fr)_auto_23px] items-center gap-2.5 border-b border-b-[#25262d] px-0 py-2.5 max-mobile:grid-cols-[30px_minmax(0,_1fr)_25px]">
                      <span className={cn(`admin-event-icon grid h-7 w-7 place-items-center rounded-[7px] admin-event-${event.type === "expense" ? "pay" : event.type}`)}>
                        <Icon />
                      </span>
                      <div>
                        <strong>{event.title}</strong>
                        <span>{event.groupName}</span>
                      </div>
                      <Badge variant="outline">{event.type}</Badge>
                      <time>{relativeTime(event.createdAt)}</time>
                    </div>
                  );
                })
              ) : (
                <div className="p-7.5 text-center text-[12px] text-[#858793]">No public group activity yet.</div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="admin-insight-card">
          <CardHeader>
            <Badge variant="secondary">
              <Sparkles /> Product signal
            </Badge>
            <CardTitle>
              {(overview?.turns ?? 0).toLocaleString()} turn records across {(overview?.turnGroups ?? 0).toLocaleString()} groups.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Turns account for {overview?.records ? ((overview.turns / overview.records) * 100).toFixed(1) : "0.0"}% of records created in this period.</p>
            <div className="admin-insight-foot mt-4.5 flex items-center justify-between gap-2 border-t border-t-[#ffffff0e] pt-3.5">
              <span>
                <Clock3 /> Last {overview?.periodDays ?? 30} days
              </span>
              <Button variant="outline" size="sm" onClick={() => router.push("/admin/activity")}>
                View activity <ArrowUpRight />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
      <section className="admin-bottom-grid mt-[13px] grid grid-cols-[minmax(0,_1.65fr)_minmax(275px,_.85fr)] gap-[13px] max-admin-tablet:grid-cols-[1fr] max-mobile:mt-[9px] max-mobile:gap-[9px]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Membership watch</CardTitle>
              <CardDescription>Live plan access requiring attention</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/memberships")}>
              View memberships <ArrowUpRight />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid">
              <WatchRow name="Premium access expiring" value={(overview?.premiumExpiringSevenDays ?? 0).toLocaleString()} note="within 7 days" tone="amber" />
              <WatchRow name="Expired Premium records" value={(overview?.expiredPremium ?? 0).toLocaleString()} note="access no longer active" tone="muted" />
              <WatchRow name="God plan access" value={(overview?.godPlans ?? 0).toLocaleString()} note="currently active" tone="muted" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Admin actions</CardTitle>
              <CardDescription>Jump into protected operations</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="admin-action-grid grid grid-cols-[1fr_1fr] gap-2 max-mobile:grid-cols-[1fr]">
            <Button variant="outline" onClick={() => router.push("/admin/memberships")}>
              <Gem /> Manage memberships
            </Button>
            <Button variant="outline" onClick={() => router.push("/admin/users")}>
              <UserRound /> Find a person
            </Button>
            <Button variant="outline" onClick={() => router.push("/admin/audit")}>
              <ShieldCheck /> Review audit log
            </Button>
            <Button variant="outline" onClick={() => router.push("/admin/system")}>
              <Database /> Check system
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
}

export function OverviewPanel({ overview, adminName, users, total, groups, newGroups, system }: { overview: AdminOverview | null; adminName: string; users: AdminUser[]; total: number; groups: AdminGroup[]; newGroups: number; system: AdminSystem | null }) {
  return <Overview overview={overview} adminName={adminName} users={users.map(toDashboardUser)} total={total} groups={groups} newGroups={newGroups} system={system} />;
}

function MetricCard({ label, value, trend, detail, icon: Icon, color, up }: { label: string; value: string; trend: string; detail: string; icon: typeof UsersRound; color: string; up: boolean }) {
  return (
    <Card className="admin-metric-card">
      <CardContent>
        <div className={cn(`admin-metric-icon grid h-7.5 w-7.5 place-items-center rounded-[7px] admin-metric-${color}`)}>
          <Icon />
        </div>
        <div className="mt-4.5 text-[11px] text-[#a5a7b1] max-mobile:mt-[15px]">{label}</div>
        <div className="mt-1 text-[26px] font-semibold tracking-[-1px] text-[#f4f4f6] max-mobile:text-[22px]">{value}</div>
        <div className="admin-metric-trend mt-[7px] flex items-center gap-[7px] max-mobile:mt-[7px] max-mobile:grid max-mobile:gap-0.5">
          <span className={up ? "is-up" : ""}>
            {up ? <ArrowUpRight /> : <ArrowDownRight />}
            {trend}
          </span>
          <small>{detail}</small>
        </div>
      </CardContent>
    </Card>
  );
}
function HealthRow({ label, status, tone, detail }: { label: string; status: string; tone: string; detail: string }) {
  return (
    <div className="admin-health-row flex items-center gap-2.5 border-b border-b-[#25262d] px-0 py-2.5">
      <span className={cn(`admin-health-indicator h-[7px] w-[7px] rounded-full ${tone}`)} />
      <div>
        <strong>{label}</strong>
        <span>{detail}</span>
      </div>
      <Badge variant={tone === "ready" ? "success" : tone === "unknown" ? "warning" : "outline"}>{status}</Badge>
    </div>
  );
}
function WatchRow({ name, value, note, tone }: { name: string; value: string; note: string; tone: string }) {
  return (
    <div className="admin-watch-row flex items-center gap-2.5 border-b border-b-[#25262d] px-0 py-2.5">
      <span className={cn(`admin-watch-icon grid h-7 w-7 place-items-center rounded-[7px] ${tone}`)}>
        <Gem />
      </span>
      <div>
        <strong>{name}</strong>
        <span>{note}</span>
      </div>
      <b>{value}</b>
    </div>
  );
}
