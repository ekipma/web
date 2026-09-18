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
  ShoppingBag,
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

type Section = "Overview" | "Users" | "Groups" | "Activity" | "Memberships" | "Assets" | "System" | "Audit log";
export type User = { id: string; initials: string; name: string; email: string; phone: string; joined: string; plan: "Premium" | "Free"; role: number; status: "Active"; groups: number; color: string };

const navigation: { label: Section; href: string; icon: typeof Grid2X2 }[] = [
  { label: "Overview", href: "/admin", icon: Grid2X2 },
  { label: "Users", href: "/admin/users", icon: UsersRound },
  { label: "Groups", href: "/admin/groups", icon: FolderKanban },
  { label: "Activity", href: "/admin/activity", icon: Activity },
  { label: "Memberships", href: "/admin/memberships", icon: Gem },
  { label: "Assets", href: "/admin/assets", icon: ShoppingBag },
  { label: "System", href: "/admin/system", icon: Gauge },
  { label: "Audit log", href: "/admin/audit", icon: ShieldCheck },
];

const avatarColors = ["violet", "cyan", "rose", "amber", "lime"] as const;
const avatarTone = {
  violet: "bg-admin-violet-tint text-admin-violet",
  cyan: "bg-admin-cyan-tint text-admin-cyan",
  rose: "bg-admin-rose-tint text-admin-rose",
  amber: "bg-admin-amber-tint text-admin-amber",
  lime: "bg-admin-green-tint text-admin-green",
} satisfies Record<(typeof avatarColors)[number], string>;
const eventTone = {
  pay: "bg-admin-rose-soft text-admin-rose",
  turn: "bg-admin-cyan-soft text-admin-cyan",
  plan: "bg-admin-green-soft text-admin-green",
  neutral: "bg-admin-violet-soft text-admin-violet",
} as const;
const metricTone = {
  violet: "bg-admin-violet-soft text-admin-violet",
  cyan: "bg-admin-cyan-soft text-admin-cyan",
  lavender: "bg-admin-violet-soft text-admin-violet",
  green: "bg-admin-green-soft text-admin-green",
  amber: "bg-admin-amber-soft text-admin-amber",
} as const;
const resourceTone = {
  violet: "bg-admin-violet-soft text-admin-violet",
  cyan: "bg-admin-cyan-soft text-admin-cyan",
  amber: "bg-admin-amber-soft text-admin-amber",
} as const;
const healthTone = {
  ready: "bg-admin-green shadow-[0_0_8px_var(--admin-green)]",
  unknown: "bg-admin-amber",
  planned: "border border-admin-ink-faint",
} as const;
const watchTone = {
  amber: "bg-admin-amber-soft text-admin-amber",
  muted: "bg-white/5 text-admin-ink-muted",
} as const;

function AdminKicker({ children }: { children: React.ReactNode }) {
  return <div className="font-sans text-[0.5625rem] leading-normal font-bold tracking-[0.078rem] text-admin-ink-faint">{children}</div>;
}

function PageHeading({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-end justify-between gap-6 max-mobile:grid max-mobile:items-start [&_h1]:mt-2 [&_h1]:mb-1.5 [&_h1]:text-[1.6875rem] [&_h1]:font-semibold [&_h1]:tracking-[-0.069rem] [&_h1]:text-admin-ink [&_p]:text-xs [&_p]:text-admin-ink-muted", className)}>{children}</div>;
}

function AdminCardHeader({ children, compact = false, className }: { children: React.ReactNode; compact?: boolean; className?: string }) {
  return (
    <CardHeader
      className={cn(
        compact
          ? "flex flex-row items-start justify-between [&_.button]:text-[0.625rem] [&_.card-description]:mt-1 [&_.card-description]:text-[0.625rem] [&_.card-title]:text-[0.8125rem] [&_.card-title]:font-semibold"
          : "flex flex-row items-center justify-between gap-4.5 max-mobile:flex-col max-mobile:items-stretch [&_.card-description]:mt-1 [&_.card-description]:text-[0.625rem] [&_.card-title]:text-sm",
        className
      )}
    >
      {children}
    </CardHeader>
  );
}

function SearchBox({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex w-64 items-center gap-2 rounded-md border border-input pl-2.5 text-admin-ink-faint focus-within:border-admin-violet/50 focus-within:ring-2 focus-within:ring-admin-violet/20 max-mobile:w-full [&_input]:border-0 [&_input]:pl-0 [&_svg]:w-3.5 [&_svg]:flex-none", className)}>{children}</div>
  );
}

function DataTable({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <table
      className={cn(
        "w-full border-collapse text-left max-mobile:min-w-164 [&_.button]:text-admin-ink-muted [&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-admin-panel-soft [&_td]:border-b [&_td]:border-b-admin-line [&_td]:px-4 [&_td]:py-3 [&_td]:text-[0.6875rem] [&_td]:text-admin-ink-soft [&_th]:border-b [&_th]:border-b-admin-line-soft [&_th]:px-4 [&_th]:py-3 [&_th]:font-sans [&_th]:text-[0.5625rem] [&_th]:font-bold [&_th]:tracking-[0.044rem] [&_th]:text-admin-ink-faint [&_tr:last-child_td]:border-b-0",
        className
      )}
    >
      {children}
    </table>
  );
}

function PersonRow({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-2.5 [&_div]:grid [&_div]:gap-1 [&_span]:text-[0.5625rem] [&_span]:text-admin-ink-faint [&_strong]:text-[0.6875rem] [&_strong]:font-medium [&_strong]:text-admin-ink-soft">{children}</div>;
}

function SplitGrid({ children }: { children: React.ReactNode }) {
  return <section className="mt-3.5 grid grid-cols-[minmax(0,_1.65fr)_minmax(17rem,_.85fr)] gap-3.5 max-admin-tablet:grid-cols-1 max-mobile:mt-2.5 max-mobile:gap-2.5">{children}</section>;
}
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
  return <span className={cn("grid h-7 w-7 place-items-center rounded-full text-[0.5rem] font-bold", avatarTone[user.color as keyof typeof avatarTone], small && "h-6 w-6 text-[0.4375rem]")}>{user.initials}</span>;
}

export function EmptySection({ name }: { name: Section }) {
  const copy: Record<Exclude<Section, "Overview" | "Users">, string> = {
    Groups: "Search and inspect groups, their memberships, visibility, and activity once the admin API is connected.",
    Activity: "Review logical expense, turn, and plan activity without exposing or changing private record details by default.",
    Memberships: "Manage access history and upcoming Premium expiry once entitlement provenance is stored by the backend.",
    Assets: "Manage sellable assets, prices, and availability from the catalog.",
    System: "Show API and database readiness, client-version rules, and request-ID diagnostics from live operational sources.",
    "Audit log": "Every future administrative read and change will appear here with actor, target, reason, outcome, and time.",
  };
  return (
    <section className="max-w-200 pt-12.5 max-mobile:pt-6 [&_h1]:mt-2 [&_h1]:mb-1.5 [&_h1]:text-[1.6875rem] [&_h1]:font-semibold [&_h1]:tracking-[-0.069rem] [&_h1]:text-admin-ink [&>p]:mb-6 [&>p]:max-w-xl [&>p]:text-xs [&>p]:leading-7 [&>p]:text-admin-ink-muted">
      <AdminKicker>INTERNAL OPERATIONS</AdminKicker>
      <h1>{name}</h1>
      <p>{copy[name as Exclude<Section, "Overview" | "Users">]}</p>
      <Card>
        <CardContent className="flex items-center gap-4 p-6 [&_div]:grid [&_div]:gap-1 [&_span]:text-[0.6875rem] [&_span]:leading-6 [&_span]:text-admin-ink-muted [&_strong]:text-[0.8125rem] [&_strong]:font-semibold [&>svg]:h-7 [&>svg]:w-7 [&>svg]:text-admin-violet">
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
    <section className="grid gap-6">
      <PageHeading>
        <div>
          <AdminKicker>CUSTOMER OPERATIONS</AdminKicker>
          <h1>Users</h1>
          <p>Search people and review their account access.</p>
        </div>
      </PageHeading>
      <Card>
        <AdminCardHeader>
          <div>
            <CardTitle>All users</CardTitle>
            <CardDescription>
              Showing {users.length.toLocaleString()} of {total.toLocaleString()} · newest first
            </CardDescription>
          </div>
          <SearchBox>
            <Search />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, mobile, or email" aria-label="Search users" />
          </SearchBox>
        </AdminCardHeader>
        <CardContent className="overflow-x-auto p-1 pt-0 max-mobile:px-0">
          <DataTable>
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
                    <PersonRow>
                      <Avatar user={user} />
                      <div>
                        <strong>{user.name}</strong>
                        <span>{user.email || user.phone}</span>
                      </div>
                    </PersonRow>
                  </td>
                  <td>
                    <Badge variant={user.plan === "Premium" ? "secondary" : "outline"}>{user.plan}</Badge>
                  </td>
                  <td>{user.role === 3 ? "Admin" : user.role === 2 ? "Operator" : "Member"}</td>
                  <td>{user.joined}</td>
                  <td>
                    <Badge variant="success">
                      <i className="mr-1 h-1 w-1 rounded-full bg-current" />
                      {user.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
          {filtered.length === 0 && <div className="p-8 text-center text-xs text-admin-ink-faint">No users match “{query}”.</div>}
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
  return <span className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-[linear-gradient(145deg,#273843,#16242d)] text-[0.5rem] font-bold text-admin-cyan">{initials}</span>;
}

export function GroupsTable({ groups, total }: { groups: AdminGroup[]; total: number }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => groups.filter((group) => `${group.name} ${group.description} ${group.adminName}`.toLowerCase().includes(query.toLowerCase())), [groups, query]);
  return (
    <section className="grid gap-6">
      <PageHeading>
        <div>
          <AdminKicker>COLLABORATION</AdminKicker>
          <h1>Groups</h1>
          <p>See where people organize expenses, turns, and plans.</p>
        </div>
      </PageHeading>
      <Card>
        <AdminCardHeader>
          <div>
            <CardTitle>All groups</CardTitle>
            <CardDescription>
              Showing {groups.length.toLocaleString()} of {total.toLocaleString()} · newest first
            </CardDescription>
          </div>
          <SearchBox>
            <Search />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search group, description, or owner" aria-label="Search groups" />
          </SearchBox>
        </AdminCardHeader>
        <CardContent className="overflow-x-auto p-1 pt-0 max-mobile:px-0">
          <DataTable className="[&_.badge]:gap-1 [&_.badge_svg]:h-3 [&_.badge_svg]:w-3 [&_.member-count_svg]:h-3 [&_.member-count_svg]:w-3">
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
                    <PersonRow>
                      <GroupMark group={group} />
                      <div>
                        <strong>{group.name}</strong>
                        <span>{group.description || "No description"}</span>
                      </div>
                    </PersonRow>
                  </td>
                  <td>
                    <strong className="text-[0.6875rem] font-medium text-admin-ink-soft">{group.adminName || `User ${group.adminId}`}</strong>
                  </td>
                  <td>
                    <span className="member-count inline-flex items-center gap-1.5 text-admin-ink-soft">
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
          </DataTable>
          {filtered.length === 0 && <div className="p-8 text-center text-xs text-admin-ink-faint">No groups match “{query}”.</div>}
        </CardContent>
      </Card>
    </section>
  );
}

function activityDetail(item: AdminActivityPage["activity"][number]) {
  if (item.type === "expense") return item.amount ? `Amount ${item.amount.toLocaleString()}` : "Expense recorded";
  if (item.type === "turn") return `Rotation ${item.turn || 1}`;
  return item.scheduledAt ? `Scheduled ${new Date(item.scheduledAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}` : "Event created";
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
  const icons = { expense: CreditCard, turn: CheckCircle2, event: CalendarDays };
  return (
    <section className="grid gap-5">
      <PageHeading>
        <div>
          <AdminKicker>PRODUCT ACTIVITY</AdminKicker>
          <h1>Activity</h1>
          <p>Recent product events with private titles redacted.</p>
        </div>
        <Button variant="outline" onClick={() => changeKind(kind)} disabled={pending}>
          <RefreshCw className={pending ? "animate-spin" : ""} /> Refresh
        </Button>
      </PageHeading>
      <Tabs value={kind} onValueChange={changeKind}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="expense">Expenses</TabsTrigger>
          <TabsTrigger value="turn">Turns</TabsTrigger>
          <TabsTrigger value="event">Events</TabsTrigger>
        </TabsList>
      </Tabs>
      <Card>
        <AdminCardHeader compact>
          <div>
            <CardTitle>Recent events</CardTitle>
            <CardDescription>
              Showing {page?.activity.length ?? 0} of {page?.total ?? 0} records · newest first
            </CardDescription>
          </div>
        </AdminCardHeader>
        <CardContent className="overflow-x-auto p-1 pt-0 max-mobile:px-0">
          <DataTable className="min-w-216">
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
                      <div className="flex items-center gap-2.5 [&_div]:grid [&_div]:gap-1 [&_span]:flex [&_span]:items-center [&_span]:gap-1 [&_span]:text-[0.5625rem] [&_span]:text-admin-ink-faint [&_span]:capitalize [&_span_svg]:w-2.5 [&_strong]:text-[0.6875rem] [&_strong]:font-medium [&_strong]:text-admin-ink-soft">
                        <span className={cn("grid h-7 w-7 place-items-center rounded-lg [&_svg]:w-3.5", eventTone[item.type === "expense" ? "pay" : item.type])}>
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
                      <div className="grid gap-1 [&_span]:flex [&_span]:items-center [&_span]:gap-1 [&_span]:text-[0.5625rem] [&_span]:text-admin-ink-faint [&_span]:capitalize [&_strong]:text-[0.6875rem] [&_strong]:font-medium [&_strong]:text-admin-ink-soft">
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
          </DataTable>
          {!page?.activity.length && <div className="p-8 text-center text-xs text-admin-ink-faint">No activity found for this filter.</div>}
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
    <section className="grid gap-5">
      <PageHeading>
        <div>
          <AdminKicker>ACCESS & PLANS</AdminKicker>
          <h1>Memberships</h1>
          <p>Review current Premium access and upcoming expirations.</p>
        </div>
      </PageHeading>
      <div className="grid grid-cols-4 gap-3.5 max-admin-tablet:grid-cols-2 max-mobile:gap-2.5">
        <MetricCard label="Active Premium" value={(page?.active ?? 0).toLocaleString()} trend="Live" detail="Premium and God" icon={Gem} color="violet" up />
        <MetricCard label="Expiring soon" value={(page?.expiring ?? 0).toLocaleString()} trend="7 days" detail="needs attention" icon={Clock3} color="amber" up />
        <MetricCard label="Expired" value={(page?.expired ?? 0).toLocaleString()} trend="Live" detail="historical access" icon={ReceiptText} color="cyan" up />
        <MetricCard label="God plans" value={(page?.god ?? 0).toLocaleString()} trend="Live" detail="currently active" icon={Crown} color="green" up />
      </div>
      <Card aria-busy={pending} className={pending ? "opacity-65" : ""}>
        <AdminCardHeader className="gap-4">
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
            className="flex w-64 items-center gap-2 rounded-md border border-input pl-2.5 text-admin-ink-faint focus-within:border-admin-violet/50 focus-within:ring-2 focus-within:ring-admin-violet/20 max-mobile:w-full [&_input]:border-0 [&_input]:pl-0 [&_svg]:w-3.5 [&_svg]:flex-none"
            onSubmit={(event) => {
              event.preventDefault();
              load();
            }}
          >
            <Search />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, mobile, or email" aria-label="Search memberships" disabled={pending} />
          </form>
        </AdminCardHeader>
        <CardContent className="overflow-x-auto p-1 pt-0 max-mobile:px-0">
          <DataTable>
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
                      <PersonRow>
                        <Avatar user={person} />
                        <div>
                          <strong>{user.name || "Unnamed user"}</strong>
                          <span>{user.email || user.mobile}</span>
                        </div>
                      </PersonRow>
                    </td>
                    <td>
                      <Badge variant={user.plan.type === "UserPlanGod" ? "secondary" : "outline"}>{user.plan.type === "UserPlanGod" ? "God" : user.plan.type === "UserPlanPremium" ? "Premium" : "Free"}</Badge>
                    </td>
                    <td>
                      <Badge variant={state.tone}>
                        <i className="mr-1 h-1 w-1 rounded-full bg-current" />
                        {state.label}
                      </Badge>
                    </td>
                    <td>{user.plan.expiresAt ? new Date(user.plan.expiresAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" }) : "Never"}</td>
                    <td>{user.role === 3 ? "Admin" : user.role === 2 ? "Operator" : "Member"}</td>
                  </tr>
                );
              })}
            </tbody>
          </DataTable>
          {!page?.memberships.length && <div className="p-8 text-center text-xs text-admin-ink-faint">No memberships match this filter.</div>}
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
    <Card className="[&_.card-content]:p-4.5 [&_b]:block [&_b]:text-[0.6875rem] [&_b]:font-medium [&_b]:text-admin-ink-soft [&_small]:mt-1 [&_small]:block [&_small]:text-[0.5625rem] [&_small]:leading-5 [&_small]:text-admin-ink-faint">
      <CardContent>
        <div className={cn("grid h-8 w-8 place-items-center rounded-lg [&_svg]:w-4", resourceTone[tone as keyof typeof resourceTone])}>
          <Icon />
        </div>
        <div className="mt-4.5 flex items-end justify-between [&_span]:text-[0.625rem] [&_span]:text-admin-ink-muted [&_strong]:text-[1.3125rem] [&_strong]:font-semibold [&_strong]:tracking-[-0.044rem] [&_strong]:text-[#f0f0f2]">
          <span>{label}</span>
          <strong>{safePercent.toFixed(1)}%</strong>
        </div>
        <div className="mt-2.5 mr-0 mb-4 ml-0 h-1 overflow-hidden rounded-full bg-[#25262d] [&_i]:block [&_i]:h-full [&_i]:rounded-[inherit] [&_i]:bg-[linear-gradient(90deg,#776bc1,#c0b7ff)] [&_i]:shadow-[0_0_12px_var(--admin-violet)] [&_i]:transition-[width] [&_i]:duration-300 [&_i]:ease-out">
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
      <section className="grid gap-4.5">
        <PageHeading>
          <div>
            <AdminKicker>INFRASTRUCTURE</AdminKicker>
            <h1>System</h1>
            <p>The server metrics endpoint is currently unavailable.</p>
          </div>
          <Button onClick={refresh} disabled={pending}>
            <RefreshCw /> Retry
          </Button>
        </PageHeading>
      </section>
    );
  const { system } = snapshot;
  return (
    <section className="grid gap-4.5">
      <PageHeading>
        <div>
          <AdminKicker>INFRASTRUCTURE</AdminKicker>
          <h1>System</h1>
          <p>Live health and capacity from {system.hostname || "the API host"}.</p>
        </div>
        <Button variant="outline" onClick={refresh} disabled={pending}>
          <RefreshCw className={pending ? "animate-spin" : ""} /> {pending ? "Refreshing…" : "Refresh snapshot"}
        </Button>
      </PageHeading>
      {error && (
        <p className="rounded-lg border border-admin-rose/30 bg-admin-rose-soft px-3 py-2.5 text-[0.625rem] text-admin-rose" role="alert">
          {error}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3.5 max-mobile:grid-cols-1 [&_.badge]:text-[0.5rem] [&_.card-content]:flex [&_.card-content]:items-center [&_.card-content]:gap-3 [&_.card-content]:p-4.5 [&_.card-content>div]:grid [&_.card-content>div]:flex-1 [&_.card-content>div]:gap-1 [&_small]:text-[0.5625rem] [&_small]:tracking-[0.038rem] [&_small]:text-admin-ink-faint [&_small]:uppercase [&_span]:text-[0.5625rem] [&_span]:text-admin-ink-faint [&_strong]:text-[0.8125rem] [&_strong]:font-semibold [&_strong]:text-admin-ink-soft [&_strong]:capitalize">
        <Card>
          <CardContent>
            <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-admin-green-soft text-admin-green [&_svg]:w-4">
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
            <span className={cn("grid h-9 w-9 flex-none place-items-center rounded-lg [&_svg]:w-4", snapshot.database.status === "operational" ? "bg-admin-green-soft text-admin-green" : "bg-admin-amber-soft text-admin-amber")}>
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
      <div className="grid grid-cols-3 gap-3.5 max-admin-tablet:grid-cols-2 max-mobile:grid-cols-1">
        <ResourceCard icon={Cpu} label="CPU usage" percent={system.cpu.usagePercent} value={`${system.cpu.cores} logical cores`} detail="Host utilization during the latest sample" tone="violet" />
        <ResourceCard icon={MemoryStick} label="Memory usage" percent={system.memory.usagePercent} value={`${formatBytes(system.memory.usedBytes)} / ${formatBytes(system.memory.totalBytes)}`} detail={`${formatBytes(system.memory.processBytes)} used by the API process`} tone="cyan" />
        <ResourceCard icon={HardDrive} label="Disk usage" percent={system.disk.usagePercent} value={`${formatBytes(system.disk.usedBytes)} / ${formatBytes(system.disk.totalBytes)}`} detail={`Filesystem mounted at ${system.disk.path}`} tone="amber" />
      </div>
      <div className="grid grid-cols-2 gap-3.5 max-mobile:grid-cols-1">
        <Card>
          <CardHeader className="[&_.card-description]:mt-1 [&_.card-description]:text-[0.625rem] [&_.card-title]:text-[0.8125rem]">
            <div>
              <CardTitle>Runtime</CardTitle>
              <CardDescription>Current server process</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid [&_span]:text-[0.625rem] [&_span]:text-admin-ink-faint [&_strong]:overflow-hidden [&_strong]:text-[0.625rem] [&_strong]:font-medium [&_strong]:text-ellipsis [&_strong]:whitespace-nowrap [&_strong]:text-admin-ink-soft [&>div]:flex [&>div]:items-center [&>div]:justify-between [&>div]:gap-4 [&>div]:border-b [&>div]:border-b-admin-line [&>div]:py-2.5 [&>div:last-child]:border-b-0">
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
          <CardHeader className="[&_.card-description]:mt-1 [&_.card-description]:text-[0.625rem] [&_.card-title]:text-[0.8125rem]">
            <div>
              <CardTitle>Host</CardTitle>
              <CardDescription>Machine-level context</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid [&_span]:text-[0.625rem] [&_span]:text-admin-ink-faint [&_strong]:overflow-hidden [&_strong]:text-[0.625rem] [&_strong]:font-medium [&_strong]:text-ellipsis [&_strong]:whitespace-nowrap [&_strong]:text-admin-ink-soft [&>div]:flex [&>div]:items-center [&>div]:justify-between [&>div]:gap-4 [&>div]:border-b [&>div]:border-b-admin-line [&>div]:py-2.5 [&>div:last-child]:border-b-0">
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
    <nav className={mobile ? "max-mobile:mt-9 max-mobile:grid max-mobile:gap-1.5 max-mobile:self-start" : "grid gap-1 max-admin-tablet:w-full"} aria-label="Admin sections">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs text-admin-ink-muted no-underline hover:bg-admin-panel-muted hover:text-admin-ink [&_.badge]:ml-auto [&_.badge]:py-px [&_.badge]:text-[0.5rem] [&_svg]:h-4 [&_svg]:w-4",
              !mobile && "max-admin-tablet:justify-center max-admin-tablet:px-0",
              activeItem.label === item.label && "bg-secondary text-admin-violet-ink ring-1 ring-admin-violet/20 ring-inset max-admin-tablet:bg-admin-violet-soft [&_svg]:text-admin-violet"
            )}
            onClick={() => setMobileNavOpen(false)}
          >
            <Icon />
            <span className={cn(!mobile && "max-admin-tablet:hidden")}>{item.label}</span>
            {item.label === "Audit log" && (
              <Badge className={cn(!mobile && "max-admin-tablet:hidden")} variant="outline">
                Soon
              </Badge>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="grid min-h-screen grid-cols-[15.75rem_minmax(0,_1fr)] bg-[#0c0d10] bg-[radial-gradient(circle_at_100%_0,#a18fff0b,transparent_30%)] max-admin-tablet:grid-cols-[4.375rem_minmax(0,_1fr)] max-mobile:block">
      <aside className="sticky top-0 flex h-screen flex-col border-r border-r-border bg-admin-panel pt-5 pr-3 pb-3.5 pl-3 max-admin-tablet:items-center max-admin-tablet:px-2.5 max-mobile:hidden">
        <Link
          className="flex items-center gap-2 px-2.5 py-0 text-xl font-[750] tracking-[-0.0625rem] text-admin-ink max-admin-tablet:p-0 [&_em]:ml-1 [&_em]:font-sans [&_em]:text-[0.5rem] [&_em]:font-bold [&_em]:tracking-[0.0875rem] [&_em]:text-[#7f8190] [&_em]:not-italic [&_img]:grayscale [&_span_span]:text-admin-violet"
          href="/admin"
          aria-label="Ekipma admin home"
        >
          <Image src="/images/app-logo.svg" width={30} height={30} alt="" />
          <span className="max-admin-tablet:hidden">
            ekipma<span>.</span>
          </span>
          <em className="max-admin-tablet:hidden">ADMIN</em>
        </Link>
        <div className="mt-8 mr-1 mb-4.5 ml-1 max-admin-tablet:mx-0 max-admin-tablet:mt-8 max-admin-tablet:mb-4.5 [&_button]:flex [&_button]:w-full [&_button]:items-center [&_button]:gap-2.5 [&_button]:rounded-lg [&_button]:border-0 [&_button]:bg-transparent [&_button]:px-2 [&_button]:py-2 [&_button]:text-left [&_button]:text-xs [&_button]:text-admin-ink-soft max-admin-tablet:[&_button]:justify-center max-admin-tablet:[&_button]:px-0 [&_button_svg]:w-3.5 [&_button_svg]:text-admin-ink-faint [&_button:hover]:bg-admin-panel-muted [&_strong]:flex-1 [&_strong]:font-medium [&>span]:block [&>span]:px-2 [&>span]:pb-2 [&>span]:font-sans [&>span]:text-[0.5625rem] [&>span]:font-bold [&>span]:tracking-[0.069rem] [&>span]:text-admin-ink-faint max-admin-tablet:[&>span]:hidden">
          <span className="max-admin-tablet:hidden">WORKSPACE</span>
          <button>
            <span className="grid h-6 w-6 place-items-center rounded-md bg-[linear-gradient(135deg,#c3b9ff,#7567bb)] text-xs font-extrabold text-primary-foreground">E</span>
            <strong className="max-admin-tablet:hidden">Ekipma</strong>
            <ChevronsUpDown className="max-admin-tablet:hidden" />
          </button>
        </div>
        {navItems()}
        <div className="mt-auto grid gap-1 max-admin-tablet:w-full max-admin-tablet:items-center [&>a]:flex [&>a]:items-center [&>a]:gap-2.5 [&>a]:rounded-lg [&>a]:border-0 [&>a]:bg-transparent [&>a]:px-2.5 [&>a]:py-2 [&>a]:text-left [&>a]:text-[0.6875rem] [&>a]:text-admin-ink-muted max-admin-tablet:[&>a]:justify-center max-admin-tablet:[&>a]:px-0 [&>a_svg:first-child]:w-4 [&>a_svg:last-child]:ml-auto [&>a_svg:last-child]:w-3 [&>a:hover]:bg-admin-panel-muted [&>a:hover]:text-admin-ink [&>button]:flex [&>button]:items-center [&>button]:gap-2.5 [&>button]:rounded-lg [&>button]:border-0 [&>button]:bg-transparent [&>button]:px-2.5 [&>button]:py-2 [&>button]:text-left [&>button]:text-[0.6875rem] [&>button]:text-admin-ink-muted max-admin-tablet:[&>button]:justify-center max-admin-tablet:[&>button]:px-0 [&>button_svg]:w-4 [&>button:hover]:bg-admin-panel-muted [&>button:hover]:text-admin-ink">
          <a href="/" target="_blank">
            <PanelLeft />
            <span className="max-admin-tablet:hidden">View landing</span>
            <ArrowUpRight className="max-admin-tablet:hidden" />
          </a>
          <button>
            <LifeBuoy /> <span className="max-admin-tablet:hidden">Help &amp; docs</span>
          </button>
          <div className="mt-2.5 flex items-center gap-2 border-t border-t-admin-line pt-3 pr-2 pb-0 pl-2 max-admin-tablet:w-full max-admin-tablet:justify-center max-admin-tablet:px-0 [&_.button]:p-0 [&_.button_svg]:w-4 [&_div>span]:mt-0.5 [&_div>span]:block [&_div>span]:overflow-hidden [&_div>span]:text-[0.5625rem] [&_div>span]:text-ellipsis [&_div>span]:whitespace-nowrap [&_div>span]:text-admin-ink-faint [&_strong]:block [&_strong]:overflow-hidden [&_strong]:text-[0.6875rem] [&_strong]:font-semibold [&_strong]:text-ellipsis [&_strong]:whitespace-nowrap [&>div]:min-w-0 [&>div]:flex-1">
            <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-secondary text-[0.5625rem] font-bold text-admin-violet-ink max-admin-tablet:h-8 max-admin-tablet:w-8">{initials}</span>
            <div className="max-admin-tablet:hidden">
              <strong>{currentUser.name}</strong>
              <span>Administrator</span>
            </div>
            <div className="max-admin-tablet:hidden">
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
        </div>
      </aside>
      <main className="min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-b-border bg-[#0c0d10e8] px-8 py-0 backdrop-blur-2xl max-mobile:h-14 max-mobile:px-4 max-mobile:py-0">
          <div className="flex items-center">
            <Button className="hidden max-mobile:inline-flex" variant="ghost" size="icon" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}>
              <Menu />
            </Button>
            <div className="flex items-center gap-2 text-[0.6875rem] text-admin-ink-faint max-mobile:text-[0.625rem] [&_strong]:font-medium [&_strong]:text-admin-ink-soft [&_svg]:w-3">
              <strong>{activeItem?.label}</strong>
            </div>
          </div>
          <div className="flex items-center gap-2 [&>.button]:text-admin-ink-muted [&>.button_svg]:w-4">
            <button
              className="flex h-8 w-52 items-center gap-2 rounded-md border border-border bg-admin-panel-soft px-2 py-0 text-left text-[0.6875rem] text-admin-ink-faint hover:border-input hover:text-admin-ink-soft max-mobile:hidden [&_kbd]:ml-auto [&_kbd]:rounded-sm [&_kbd]:border [&_kbd]:border-admin-line-soft [&_kbd]:px-1 [&_kbd]:py-px [&_kbd]:font-sans [&_kbd]:text-[0.5625rem] [&_kbd]:text-admin-ink-faint [&_svg]:w-3.5"
              onClick={openSearch}
            >
              <Search />
              <span>Search</span>
              <kbd>⌘ K</kbd>
            </button>
            <Button size="icon" variant="ghost" aria-label="Notifications">
              <Bell />
            </Button>
            <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-secondary text-[0.5625rem] font-bold text-admin-violet-ink max-mobile:hidden">HG</span>
          </div>
        </header>
        <div className="mt-4.5 mr-8 mb-0 ml-8 flex items-center gap-2.5 rounded-lg border border-admin-violet/20 bg-admin-violet-soft/40 px-3.5 py-2.5 text-[0.6875rem] text-admin-ink-muted max-mobile:mt-3.5 max-mobile:mr-4 max-mobile:mb-0 max-mobile:ml-4 max-mobile:items-start max-mobile:text-[0.625rem] max-mobile:leading-[1.55] [&_button]:ml-auto [&_button]:inline-flex [&_button]:items-center [&_button]:gap-1 [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-[0.625rem] [&_button]:text-admin-violet [&_button_svg]:w-3 [&_button:hover]:text-white [&_strong]:font-semibold [&_strong]:text-admin-violet-ink [&>svg]:w-4 [&>svg]:text-admin-violet">
          <Sparkles />
          <span>
            <strong>Protected admin session.</strong> Overview, user, group, and system data are live.
          </span>
          <button onClick={() => setNoticeOpen(true)}>
            Data notes <ArrowUpRight />
          </button>
        </div>
        <div className="mx-auto my-0 w-[min(1440px,_100%)] pt-8.5 pr-8 pb-12 pl-8 max-mobile:pt-7 max-mobile:pr-4 max-mobile:pb-9 max-mobile:pl-4">{children}</div>
      </main>
      {mobileNavOpen && (
        <div className="hidden max-mobile:fixed max-mobile:inset-0 max-mobile:z-60 max-mobile:grid max-mobile:grid-rows-[auto_1fr] max-mobile:bg-[#111217] max-mobile:p-4.5">
          <div className="max-mobile:flex max-mobile:items-center max-mobile:justify-between">
            <Link
              className="flex items-center gap-2 px-2.5 py-0 text-xl font-[750] tracking-[-0.0625rem] text-admin-ink max-admin-tablet:p-0 [&_em]:ml-1 [&_em]:font-sans [&_em]:text-[0.5rem] [&_em]:font-bold [&_em]:tracking-[0.0875rem] [&_em]:text-[#7f8190] [&_em]:not-italic [&_img]:grayscale [&_span_span]:text-admin-violet"
              href="/admin"
            >
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
          <div className="grid gap-2.5 rounded-lg bg-white/5 p-3.5 text-[0.6875rem] leading-[1.55] text-admin-ink-muted [&_div]:flex [&_div]:gap-2 [&_svg]:w-4 [&_svg]:flex-none [&_svg]:text-admin-green">
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
          <div className="flex items-center gap-2 rounded-lg border border-[var(--input)] pl-2.5 text-admin-ink-faint focus-within:border-admin-violet/50 focus-within:ring-2 focus-within:ring-admin-violet/20 [&_input]:border-0 [&_input]:pl-0 [&_svg]:w-4 [&_svg]:flex-none">
            <Search />
            <Input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search sections…" aria-label="Search admin sections" />
          </div>
          <div className="grid gap-1 [&_button]:flex [&_button]:items-center [&_button]:justify-between [&_button]:rounded-lg [&_button]:border-0 [&_button]:bg-transparent [&_button]:p-2.5 [&_button]:text-left [&_button]:text-xs [&_button]:text-admin-ink-soft [&_button_span]:flex [&_button_span]:items-center [&_button_span]:gap-2.5 [&_button_svg]:w-4 [&_button_svg]:text-admin-violet [&_button:hover]:bg-white/5 [&>p]:px-2.5 [&>p]:py-4 [&>p]:text-center [&>p]:text-[0.6875rem] [&>p]:text-admin-ink-faint">
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
  const activityIcons = { expense: CreditCard, turn: CheckCircle2, event: CalendarDays };
  return (
    <>
      <PageHeading className="flex">
        <div>
          <AdminKicker>{new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date()).toUpperCase()}</AdminKicker>
          <h1>Welcome back, {adminName.split(/\s+/)[0] || "Admin"}.</h1>
          <p>Here’s the live pulse of Ekipma today.</p>
        </div>
        <div className="flex gap-2 max-mobile:w-full [&_.button]:h-9 [&_.button]:text-[0.6875rem] [&_.button_svg]:w-3.5">
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
      </PageHeading>
      <section className="mt-7 grid grid-cols-4 gap-3.5 max-mobile:mt-5 max-mobile:grid-cols-[1fr_1fr] max-mobile:gap-2.5" aria-label="Overview metrics">
        <MetricCard label="Total people" value={total.toLocaleString()} trend="Live" detail="registered accounts" icon={UsersRound} color="violet" up />
        <MetricCard label="Collaborating groups" value={(overview?.activeGroups ?? 0).toLocaleString()} trend={`${Math.abs(activeTrend).toFixed(1)}%`} detail={`vs prior ${overview?.periodDays ?? 30} days`} icon={FolderKanban} color="cyan" up={activeTrend >= 0} />
        <MetricCard label="Premium access" value={(overview?.activePremium ?? 0).toLocaleString()} trend="Live" detail="currently active" icon={Gem} color="lavender" up />
        <MetricCard label="New groups" value={newGroups.toLocaleString()} trend="Live" detail="last 30 days" icon={Sparkles} color="green" up />
      </section>
      <section className="mt-3.5 grid grid-cols-2 gap-3.5 max-admin-tablet:grid-cols-1 [&_.card-description]:mt-1 [&_.card-description]:text-[0.625rem] [&_.card-header]:flex [&_.card-header]:flex-row [&_.card-header]:justify-between [&_.card-title]:text-[0.8125rem]">
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
                  <div
                    className="flex items-center gap-2.5 border-b border-b-admin-line px-0 py-2.5 last:border-b-0 [&_span]:overflow-hidden [&_span]:text-[0.5625rem] [&_span]:text-ellipsis [&_span]:whitespace-nowrap [&_span]:text-admin-ink-faint [&_strong]:overflow-hidden [&_strong]:text-[0.6875rem] [&_strong]:font-medium [&_strong]:text-ellipsis [&_strong]:whitespace-nowrap [&_strong]:text-admin-ink-soft [&_time]:ml-auto [&_time]:text-[0.5625rem] [&_time]:whitespace-nowrap [&_time]:text-admin-ink-faint [&>div]:grid [&>div]:min-w-0 [&>div]:gap-1"
                    key={user.id}
                  >
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
              <p className="p-8 text-center text-xs text-admin-ink-faint">No accounts found.</p>
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
                  <div
                    className="flex items-center gap-2.5 border-b border-b-admin-line px-0 py-2.5 last:border-b-0 [&_span]:overflow-hidden [&_span]:text-[0.5625rem] [&_span]:text-ellipsis [&_span]:whitespace-nowrap [&_span]:text-admin-ink-faint [&_strong]:overflow-hidden [&_strong]:text-[0.6875rem] [&_strong]:font-medium [&_strong]:text-ellipsis [&_strong]:whitespace-nowrap [&_strong]:text-admin-ink-soft [&_time]:ml-auto [&_time]:text-[0.5625rem] [&_time]:whitespace-nowrap [&_time]:text-admin-ink-faint [&>div]:grid [&>div]:min-w-0 [&>div]:gap-1"
                    key={group.id}
                  >
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
              <p className="p-8 text-center text-xs text-admin-ink-faint">No groups found.</p>
            )}
          </CardContent>
        </Card>
      </section>
      <SplitGrid>
        <Card>
          <AdminCardHeader compact>
            <div>
              <CardTitle>Collaboration activity</CardTitle>
              <CardDescription>Distinct groups with records · {overview?.periodDays ?? 30}-day window</CardDescription>
            </div>
            <Badge variant="outline">12 intervals</Badge>
          </AdminCardHeader>
          <CardContent>
            <div className="flex items-end justify-between [&_.badge]:gap-1 [&_.badge]:text-[0.5625rem] [&_.badge_svg]:w-3 [&_span]:text-[0.625rem] [&_span]:text-admin-ink-faint [&_strong]:text-2xl [&_strong]:font-semibold [&_strong]:tracking-[-0.0625rem] [&>div]:flex [&>div]:items-baseline [&>div]:gap-2">
              <div>
                <strong>{(overview?.activeGroups ?? 0).toLocaleString()}</strong>
                <span>active groups</span>
              </div>
              <Badge variant={activeTrend >= 0 ? "success" : "warning"}>
                {activeTrend >= 0 ? <ArrowUpRight /> : <ArrowDownRight />} {Math.abs(activeTrend).toFixed(1)}%
              </Badge>
            </div>
            <div
              className="mt-5.5 flex h-40 items-end gap-[5.5%] border-b border-b-admin-line-soft px-2 py-0 max-mobile:h-30 [&_i]:block [&_i]:h-[17%] [&_i]:w-full [&_i]:rounded-t [&_i]:bg-white/10 [&_span]:flex [&_span]:w-[4.1%] [&_span]:min-w-2 [&_span]:items-end [&_span]:rounded-t [&_span]:bg-[linear-gradient(#8073cf,#3c375a)] [&_span]:opacity-65 [&_span.is-latest]:bg-[linear-gradient(#c0b7ff,#7168af)] [&_span.is-latest]:opacity-100 [&_span.is-latest]:shadow-[0_-4px_18px_var(--admin-violet)]"
              aria-label="Active groups chart"
            >
              {overview?.collaborationChart.map((point, index) => (
                <span key={point.start} title={`${new Date(point.start).toLocaleDateString()}: ${point.value}`} style={{ height: `${Math.max(4, (point.value / chartMax) * 100)}%` }} className={index === overview.collaborationChart.length - 1 ? "is-latest" : ""}>
                  <i />
                </span>
              ))}
            </div>
            <div className="flex justify-between pt-2.5 font-sans text-[0.5rem] leading-normal font-normal tracking-[0.031rem] text-admin-ink-faint">
              <span>{overview?.collaborationChart[0] ? new Date(overview.collaborationChart[0].start).toLocaleDateString("en", { month: "short", day: "numeric" }) : "—"}</span>
              <span>{overview?.records.toLocaleString() ?? 0} records</span>
              <span>{overview?.collaborationChart.at(-1) ? new Date(overview.collaborationChart.at(-1)!.start).toLocaleDateString("en", { month: "short", day: "numeric" }) : "—"}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="max-admin-tablet:order-2">
          <AdminCardHeader compact>
            <div>
              <CardTitle>Service pulse</CardTitle>
              <CardDescription>{system ? `Sampled ${new Date(system.system.collectedAt).toLocaleTimeString()}` : "Live metrics unavailable"}</CardDescription>
            </div>
            <Button size="icon" variant="ghost" aria-label="System status" onClick={() => router.push("/admin/system")}>
              <Gauge />
            </Button>
          </AdminCardHeader>
          <CardContent>
            <div className="grid gap-1">
              <HealthRow label="API service" status={system ? "Ready" : "Unknown"} tone={system ? "ready" : "unknown"} detail={system ? `Up ${formatUptime(system.system.processUptimeSeconds)}` : "Could not read server metrics"} />
              <HealthRow label="Database" status={system?.database.status === "operational" ? "Ready" : "Degraded"} tone={system?.database.status === "operational" ? "ready" : "unknown"} detail={system ? `${system.database.latencyMs.toFixed(1)} ms ping` : "Readiness unavailable"} />
              <HealthRow label="Admin API" status="Ready" tone="ready" detail="Role-protected operations endpoint" />
            </div>
            <button className="mt-4 inline-flex items-center gap-1 border-0 bg-transparent p-0 text-[0.625rem] text-admin-violet [&_svg]:w-3" onClick={() => router.push("/admin/system")}>
              View system metrics <ArrowUpRight />
            </button>
          </CardContent>
        </Card>
      </SplitGrid>
      <SplitGrid>
        <Card>
          <AdminCardHeader compact>
            <div>
              <CardTitle>Recent collaboration</CardTitle>
              <CardDescription>Latest public group activity</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/activity")}>
              View activity <ArrowUpRight />
            </Button>
          </AdminCardHeader>
          <CardContent>
            <div className="grid">
              {overview?.recentActivity.length ? (
                overview.recentActivity.map((event) => {
                  const Icon = activityIcons[event.type];
                  return (
                    <div
                      key={event.id}
                      className="grid grid-cols-[1.875rem_minmax(0,_1fr)_auto_1.5rem] items-center gap-2.5 border-b border-b-admin-line px-0 py-2.5 last:border-b-0 max-mobile:grid-cols-[1.875rem_minmax(0,_1fr)_1.5rem] [&_.badge]:text-[0.5rem] [&_span:not([class])]:mt-1 [&_span:not([class])]:block [&_span:not([class])]:overflow-hidden [&_span:not([class])]:text-[0.5625rem] [&_span:not([class])]:text-ellipsis [&_span:not([class])]:whitespace-nowrap [&_span:not([class])]:text-admin-ink-faint [&_strong]:block [&_strong]:overflow-hidden [&_strong]:text-[0.6875rem] [&_strong]:font-medium [&_strong]:text-ellipsis [&_strong]:whitespace-nowrap [&_strong]:text-admin-ink-soft [&_time]:text-[0.5625rem] [&_time]:text-admin-ink-faint"
                    >
                      <span className={cn("grid h-7 w-7 place-items-center rounded-lg [&_svg]:w-3.5", eventTone[event.type === "expense" ? "pay" : event.type])}>
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
                <div className="p-8 text-center text-xs text-admin-ink-faint">No public group activity yet.</div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[linear-gradient(145deg,#1b1830,#121318_70%)] [&_.badge]:gap-1 [&_.badge]:text-[0.5625rem] [&_.badge_svg]:w-3 [&_.card-header]:flex [&_.card-header]:flex-col [&_.card-header]:items-start [&_.card-header]:gap-4 [&_.card-title]:max-w-64 [&_.card-title]:text-[1.0625rem] [&_.card-title]:leading-snug [&_.card-title]:text-admin-violet-ink [&_p]:text-[0.625rem] [&_p]:leading-7 [&_p]:text-admin-ink-muted">
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
            <div className="mt-4.5 flex items-center justify-between gap-2 border-t border-t-white/10 pt-3.5 [&>.button]:px-2.5 [&>.button_svg]:w-3 [&>span]:flex [&>span]:items-center [&>span]:gap-1.5 [&>span]:text-[0.5625rem] [&>span]:text-admin-ink-muted [&>span_svg]:w-3">
              <span>
                <Clock3 /> Last {overview?.periodDays ?? 30} days
              </span>
              <Button variant="outline" size="sm" onClick={() => router.push("/admin/activity")}>
                View activity <ArrowUpRight />
              </Button>
            </div>
          </CardContent>
        </Card>
      </SplitGrid>
      <SplitGrid>
        <Card>
          <AdminCardHeader compact>
            <div>
              <CardTitle>Membership watch</CardTitle>
              <CardDescription>Live plan access requiring attention</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/memberships")}>
              View memberships <ArrowUpRight />
            </Button>
          </AdminCardHeader>
          <CardContent>
            <div className="grid">
              <WatchRow name="Premium access expiring" value={(overview?.premiumExpiringSevenDays ?? 0).toLocaleString()} note="within 7 days" tone="amber" />
              <WatchRow name="Expired Premium records" value={(overview?.expiredPremium ?? 0).toLocaleString()} note="access no longer active" tone="muted" />
              <WatchRow name="God plan access" value={(overview?.godPlans ?? 0).toLocaleString()} note="currently active" tone="muted" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <AdminCardHeader compact>
            <div>
              <CardTitle>Admin actions</CardTitle>
              <CardDescription>Jump into protected operations</CardDescription>
            </div>
          </AdminCardHeader>
          <CardContent className="grid grid-cols-2 gap-2 max-mobile:grid-cols-1 [&_.button]:h-auto [&_.button]:min-h-16 [&_.button]:flex-col [&_.button]:items-start [&_.button]:justify-center [&_.button]:gap-2 [&_.button]:p-3 [&_.button]:text-left [&_.button]:whitespace-normal [&_svg]:w-4 [&_svg]:text-admin-violet">
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
      </SplitGrid>
    </>
  );
}

export function OverviewPanel({ overview, adminName, users, total, groups, newGroups, system }: { overview: AdminOverview | null; adminName: string; users: AdminUser[]; total: number; groups: AdminGroup[]; newGroups: number; system: AdminSystem | null }) {
  return <Overview overview={overview} adminName={adminName} users={users.map(toDashboardUser)} total={total} groups={groups} newGroups={newGroups} system={system} />;
}

function MetricCard({ label, value, trend, detail, icon: Icon, color, up }: { label: string; value: string; trend: string; detail: string; icon: typeof UsersRound; color: string; up: boolean }) {
  return (
    <Card className="[&_.card-content]:relative [&_.card-content]:min-h-36 [&_.card-content]:p-4.5">
      <CardContent>
        <div className={cn("grid h-8 w-8 place-items-center rounded-lg [&_svg]:w-4", metricTone[color as keyof typeof metricTone])}>
          <Icon />
        </div>
        <div className="mt-4.5 text-[0.6875rem] text-admin-ink-muted max-mobile:mt-4">{label}</div>
        <div className="mt-1 text-[1.625rem] font-semibold tracking-[-0.0625rem] text-admin-ink max-mobile:text-[1.375rem]">{value}</div>
        <div className="mt-2 flex items-center gap-2 max-mobile:mt-2 max-mobile:grid max-mobile:gap-0.5 [&_small]:text-[0.5625rem] [&_small]:text-admin-ink-faint [&_span]:inline-flex [&_span]:items-center [&_span]:gap-px [&_span]:text-[0.625rem] [&_span]:text-admin-green [&_svg]:w-3">
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
    <div className="flex items-center gap-2.5 border-b border-b-admin-line px-0 py-2.5 last:border-b-0 [&_.badge]:text-[0.5rem] [&_span:not([class])]:mt-1 [&_span:not([class])]:block [&_span:not([class])]:text-[0.5625rem] [&_span:not([class])]:text-admin-ink-faint [&_strong]:block [&_strong]:text-[0.6875rem] [&_strong]:font-medium [&_strong]:text-admin-ink-soft [&>div]:flex-1">
      <span className={cn("h-2 w-2 rounded-full", healthTone[tone as keyof typeof healthTone])} />
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
    <div className="flex items-center gap-2.5 border-b border-b-admin-line px-0 py-2.5 last:border-b-0 [&_b]:text-[0.9375rem] [&_b]:font-semibold [&_b]:text-[#e6e6e9] [&_span:not([class])]:mt-1 [&_span:not([class])]:block [&_span:not([class])]:text-[0.5625rem] [&_span:not([class])]:text-admin-ink-faint [&_strong]:block [&_strong]:text-[0.6875rem] [&_strong]:font-medium [&_strong]:text-admin-ink-soft [&>div]:flex-1">
      <span className={cn("grid h-7 w-7 place-items-center rounded-lg [&_svg]:w-3.5", watchTone[tone as keyof typeof watchTone])}>
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
