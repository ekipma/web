"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  Cpu,
  Database,
  Download,
  Ellipsis,
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
import type { AdminGroup, AdminSystem, AdminUser } from "@/lib/admin-api";

type Section = "Overview" | "Users" | "Groups" | "Activity" | "Memberships" | "System" | "Audit log";
type User = { id: string; initials: string; name: string; email: string; phone: string; joined: string; plan: "Premium" | "Free"; role: number; status: "Active"; groups: number; color: string };

const navigation: { label: Section; icon: typeof Grid2X2 }[] = [
  { label: "Overview", icon: Grid2X2 },
  { label: "Users", icon: UsersRound },
  { label: "Groups", icon: FolderKanban },
  { label: "Activity", icon: Activity },
  { label: "Memberships", icon: Gem },
  { label: "System", icon: Gauge },
  { label: "Audit log", icon: ShieldCheck },
];

const avatarColors = ["violet", "cyan", "rose", "amber", "lime"];
function toDashboardUser(user: AdminUser, index: number): User {
  const initials = user.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";
  return { id: user.id, initials, name: user.name || "Unnamed user", email: user.email, phone: user.mobile, joined: new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(user.createdAt)), plan: user.plan.type === "UserPlanPremium" || user.plan.type === "UserPlanGod" ? "Premium" : "Free", role: user.role, status: "Active", groups: 0, color: avatarColors[index % avatarColors.length] };
}

const recentActivity = [
  { icon: CreditCard, tone: "pay", title: "Groceries added", detail: "Apartment 4 · 4 people", time: "2m", label: "Expense" },
  { icon: CheckCircle2, tone: "turn", title: "Kitchen clean-up advanced", detail: "Dorm 16 · Sam is up next", time: "14m", label: "Turn" },
  { icon: CalendarDays, tone: "plan", title: "Weekend movie night planned", detail: "The couch crew · Friday, 19:30", time: "37m", label: "Plan" },
  { icon: UsersRound, tone: "neutral", title: "A new group found its home", detail: "Beverage Studies · 6 members", time: "1h", label: "Group" },
];

const bars = [31, 46, 42, 64, 58, 76, 62, 84, 72, 94, 79, 100];

function Avatar({ user, small = false }: { user: User; small?: boolean }) {
  return <span className={`admin-avatar admin-avatar-${user.color} ${small ? "admin-avatar-small" : ""}`}>{user.initials}</span>;
}

function EmptySection({ name }: { name: Section }) {
  const copy: Record<Exclude<Section, "Overview" | "Users">, string> = {
    Groups: "Search and inspect groups, their memberships, visibility, and activity once the admin API is connected.",
    Activity: "Review logical expense, turn, and plan activity without exposing or changing private record details by default.",
    Memberships: "Manage access history and upcoming Premium expiry once entitlement provenance is stored by the backend.",
    System: "Show API and database readiness, client-version rules, and request-ID diagnostics from live operational sources.",
    "Audit log": "Every future administrative read and change will appear here with actor, target, reason, outcome, and time.",
  };
  return <section className="admin-empty-section"><div className="admin-section-kicker">INTERNAL OPERATIONS</div><h1>{name}</h1><p>{copy[name as Exclude<Section, "Overview" | "Users">]}</p><Card><CardContent className="admin-empty-card"><ShieldCheck /><div><strong>Backend integration is intentionally pending</strong><span>This section is designed but not connected to customer data or administrative actions.</span></div></CardContent></Card></section>;
}

function UsersTable({ users, total }: { users: User[]; total: number }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => users.filter((user) => `${user.name} ${user.phone} ${user.email}`.toLowerCase().includes(query.toLowerCase())), [query, users]);
  return <section className="admin-users-section"><div className="admin-page-heading"><div><div className="admin-section-kicker">CUSTOMER OPERATIONS</div><h1>Users</h1><p>Search people and review their account access.</p></div></div><Card><CardHeader className="admin-table-header"><div><CardTitle>All users</CardTitle><CardDescription>Showing {users.length.toLocaleString()} of {total.toLocaleString()} · newest first</CardDescription></div><div className="admin-search"><Search /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, mobile, or email" aria-label="Search users" /></div></CardHeader><CardContent className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Person</th><th>Membership</th><th>Role</th><th>Joined</th><th>Status</th></tr></thead><tbody>{filtered.map((user) => <tr key={user.id}><td><div className="admin-person"><Avatar user={user} /><div><strong>{user.name}</strong><span>{user.email || user.phone}</span></div></div></td><td><Badge variant={user.plan === "Premium" ? "secondary" : "outline"}>{user.plan}</Badge></td><td>{user.role === 3 ? "Admin" : user.role === 2 ? "Operator" : "Member"}</td><td>{user.joined}</td><td><Badge variant="success"><i className="admin-status-dot" />{user.status}</Badge></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="admin-no-results">No users match “{query}”.</div>}</CardContent></Card></section>;
}

function GroupMark({ group }: { group: AdminGroup }) {
  const initials = group.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "G";
  return <span className="admin-group-mark">{initials}</span>;
}

function GroupsTable({ groups, total }: { groups: AdminGroup[]; total: number }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => groups.filter((group) => `${group.name} ${group.description} ${group.adminName}`.toLowerCase().includes(query.toLowerCase())), [groups, query]);
  return <section className="admin-groups-section"><div className="admin-page-heading"><div><div className="admin-section-kicker">COLLABORATION</div><h1>Groups</h1><p>See where people organize expenses, turns, and plans.</p></div></div><Card><CardHeader className="admin-table-header"><div><CardTitle>All groups</CardTitle><CardDescription>Showing {groups.length.toLocaleString()} of {total.toLocaleString()} · newest first</CardDescription></div><div className="admin-search"><Search /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search group, description, or owner" aria-label="Search groups" /></div></CardHeader><CardContent className="admin-table-wrap"><table className="admin-table admin-groups-table"><thead><tr><th>Group</th><th>Owner</th><th>Members</th><th>Visibility</th><th>Created</th></tr></thead><tbody>{filtered.map((group) => <tr key={group.id}><td><div className="admin-person"><GroupMark group={group} /><div><strong>{group.name}</strong><span>{group.description || "No description"}</span></div></div></td><td><strong className="admin-table-primary">{group.adminName || `User ${group.adminId}`}</strong></td><td><span className="admin-member-count"><UsersRound /> {group.memberCount}</span></td><td><Badge variant={group.public ? "success" : "outline"}>{group.public ? <Globe2 /> : <LockKeyhole />}{group.public ? "Public" : "Private"}</Badge></td><td>{new Date(group.createdAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}</td></tr>)}</tbody></table>{filtered.length === 0 && <div className="admin-no-results">No groups match “{query}”.</div>}</CardContent></Card></section>;
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

function ResourceCard({ icon: Icon, label, percent, value, detail, tone }: { icon: typeof Cpu; label: string; percent: number; value: string; detail: string; tone: string }) {
  const safePercent = Math.max(0, Math.min(100, percent));
  return <Card className="admin-resource-card"><CardContent><div className={`admin-resource-icon ${tone}`}><Icon /></div><div className="admin-resource-head"><span>{label}</span><strong>{safePercent.toFixed(1)}%</strong></div><div className="admin-resource-track"><i style={{ width: `${safePercent}%` }} /></div><b>{value}</b><small>{detail}</small></CardContent></Card>;
}

function SystemPanel({ initial }: { initial: AdminSystem | null }) {
  const [snapshot, setSnapshot] = useState(initial);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function refresh() {
    setPending(true); setError("");
    const response = await fetch("/api/admin/system", { cache: "no-store" });
    if (response.ok) setSnapshot(await response.json());
    else setError("Could not refresh the server snapshot.");
    setPending(false);
  }
  if (!snapshot) return <section className="admin-system-section"><div className="admin-page-heading"><div><div className="admin-section-kicker">INFRASTRUCTURE</div><h1>System</h1><p>The server metrics endpoint is currently unavailable.</p></div><Button onClick={refresh} disabled={pending}><RefreshCw /> Retry</Button></div></section>;
  const { system } = snapshot;
  return <section className="admin-system-section">
    <div className="admin-page-heading"><div><div className="admin-section-kicker">INFRASTRUCTURE</div><h1>System</h1><p>Live health and capacity from {system.hostname || "the API host"}.</p></div><Button variant="outline" onClick={refresh} disabled={pending}><RefreshCw className={pending ? "is-spinning" : ""} /> {pending ? "Refreshing…" : "Refresh snapshot"}</Button></div>
    {error && <p className="admin-system-error" role="alert">{error}</p>}
    <div className="admin-status-grid"><Card><CardContent><span className="admin-system-status ready"><Server /></span><div><small>API service</small><strong>{snapshot.api.status}</strong><span>Process uptime {formatUptime(system.processUptimeSeconds)}</span></div><Badge variant="success">Healthy</Badge></CardContent></Card><Card><CardContent><span className={`admin-system-status ${snapshot.database.status === "operational" ? "ready" : "warning"}`}><Database /></span><div><small>PostgreSQL</small><strong>{snapshot.database.status}</strong><span>{snapshot.database.latencyMs.toFixed(1)} ms ping</span></div><Badge variant={snapshot.database.status === "operational" ? "success" : "warning"}>{snapshot.database.status === "operational" ? "Healthy" : "Degraded"}</Badge></CardContent></Card></div>
    <div className="admin-resource-grid"><ResourceCard icon={Cpu} label="CPU usage" percent={system.cpu.usagePercent} value={`${system.cpu.cores} logical cores`} detail="Host utilization during the latest sample" tone="violet" /><ResourceCard icon={MemoryStick} label="Memory usage" percent={system.memory.usagePercent} value={`${formatBytes(system.memory.usedBytes)} / ${formatBytes(system.memory.totalBytes)}`} detail={`${formatBytes(system.memory.processBytes)} used by the API process`} tone="cyan" /><ResourceCard icon={HardDrive} label="Disk usage" percent={system.disk.usagePercent} value={`${formatBytes(system.disk.usedBytes)} / ${formatBytes(system.disk.totalBytes)}`} detail={`Filesystem mounted at ${system.disk.path}`} tone="amber" /></div>
    <div className="admin-system-detail-grid"><Card><CardHeader><div><CardTitle>Runtime</CardTitle><CardDescription>Current server process</CardDescription></div></CardHeader><CardContent className="admin-runtime-list"><div><span>Go version</span><strong>{system.goVersion}</strong></div><div><span>Platform</span><strong>{system.os} / {system.arch}</strong></div><div><span>Goroutines</span><strong>{system.goroutines.toLocaleString()}</strong></div><div><span>Process uptime</span><strong>{formatUptime(system.processUptimeSeconds)}</strong></div></CardContent></Card><Card><CardHeader><div><CardTitle>Host</CardTitle><CardDescription>Machine-level context</CardDescription></div></CardHeader><CardContent className="admin-runtime-list"><div><span>Hostname</span><strong>{system.hostname || "Unavailable"}</strong></div><div><span>Host uptime</span><strong>{formatUptime(system.uptimeSeconds)}</strong></div><div><span>Collected</span><strong>{new Date(system.collectedAt).toLocaleString()}</strong></div><div><span>Refresh mode</span><strong>Manual snapshot</strong></div></CardContent></Card></div>
  </section>;
}

export function AdminDashboard({ currentUser, initialUsers, totalUsers, initialGroups, totalGroups, newGroupsLast30Days, initialSystem }: { currentUser: AdminUser; initialUsers: AdminUser[]; totalUsers: number; initialGroups: AdminGroup[]; totalGroups: number; newGroupsLast30Days: number; initialSystem: AdminSystem | null }) {
  const router = useRouter();
  const users = initialUsers.map(toDashboardUser);
  const [section, setSection] = useState<Section>("Overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const activeItem = navigation.find((item) => item.label === section);

  const navItems = (mobile = false) => <nav className={mobile ? "admin-mobile-nav-list" : "admin-nav-list"} aria-label="Admin sections">{navigation.map((item) => { const Icon = item.icon; return <button key={item.label} className={section === item.label ? "is-active" : ""} onClick={() => { setSection(item.label); setMobileNavOpen(false); }}><Icon /><span>{item.label}</span>{item.label === "Audit log" && <Badge variant="outline">Soon</Badge>}</button>; })}</nav>;

  return <div className="admin-app">
    <aside className="admin-sidebar"><a className="admin-brand" href="/admin" aria-label="Ekipma admin home"><Image src="/images/app-logo.svg" width={30} height={30} alt="" /><span>ekipma<span>.</span></span><em>ADMIN</em></a><div className="admin-workspace"><span>WORKSPACE</span><button><span className="admin-workspace-mark">E</span><strong>Ekipma</strong><ChevronsUpDown /></button></div>{navItems()}<div className="admin-sidebar-bottom"><a href="/" target="_blank"><PanelLeft /> View landing <ArrowUpRight /></a><button><LifeBuoy /> Help & docs</button><div className="admin-account"><span className="admin-owner-avatar">{users.find((user) => user.id === currentUser.id)?.initials || "AD"}</span><div><strong>{currentUser.name}</strong><span>Administrator</span></div><DropdownMenu><DropdownMenuTrigger asChild><Button size="icon" variant="ghost" aria-label="Open account menu"><Ellipsis /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuLabel>Administrator account</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem><Settings2 /> Preferences</DropdownMenuItem><DropdownMenuItem onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); router.replace("/admin"); router.refresh(); }}><LogOut /> Sign out</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div></div></aside>
    <main className="admin-main"><header className="admin-topbar"><div className="admin-topbar-left"><Button className="admin-mobile-menu" variant="ghost" size="icon" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}><Menu /></Button><div className="admin-breadcrumb"><span>Admin</span><ChevronDown /><strong>{activeItem?.label}</strong></div></div><div className="admin-topbar-actions"><button className="admin-command-button" onClick={() => setNoticeOpen(true)}><Search /><span>Search</span><kbd>⌘ K</kbd></button><Button size="icon" variant="ghost" aria-label="Notifications"><Bell /></Button><span className="admin-topbar-avatar">HG</span></div></header>
      <div className="admin-local-notice"><Sparkles /><span><strong>Protected admin session.</strong> User data is live; the remaining operational metrics are still illustrative.</span><button onClick={() => setNoticeOpen(true)}>What’s next <ArrowUpRight /></button></div>
      <div className="admin-content">{section === "Overview" ? <Overview onNotice={() => setNoticeOpen(true)} users={users} total={totalUsers} groups={initialGroups} totalGroups={totalGroups} newGroups={newGroupsLast30Days} system={initialSystem} /> : section === "Users" ? <UsersTable users={users} total={totalUsers} /> : section === "Groups" ? <GroupsTable groups={initialGroups} total={totalGroups} /> : section === "System" ? <SystemPanel initial={initialSystem} /> : <EmptySection name={section} />}</div>
    </main>
    {mobileNavOpen && <div className="admin-mobile-nav"><div className="admin-mobile-nav-head"><a className="admin-brand" href="/admin"><Image src="/images/app-logo.svg" width={30} height={30} alt="" /><span>ekipma<span>.</span></span><em>ADMIN</em></a><Button size="icon" variant="ghost" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation"><X /></Button></div>{navItems(true)}</div>}
    <Dialog open={noticeOpen} onOpenChange={setNoticeOpen}><DialogContent><DialogHeader><DialogTitle>This page is safe to explore</DialogTitle><DialogDescription>The dashboard uses static, local prototype data. It does not authenticate, query the API, change accounts, grant Premium, or expose customer data.</DialogDescription></DialogHeader><div className="admin-dialog-points"><div><CheckCircle2 /> Platform admin roles and protected `/api/v1/admin` endpoints come first.</div><div><CheckCircle2 /> Metrics will only show live values after logical activity and entitlement history are modeled.</div><div><CheckCircle2 /> Membership changes and sensitive reads will require reasons and audit events.</div></div><DialogFooter><Button onClick={() => setNoticeOpen(false)}>Got it</Button></DialogFooter></DialogContent></Dialog>
  </div>;
}

function Overview({ onNotice, users, total, groups, totalGroups, newGroups, system }: { onNotice: () => void; users: User[]; total: number; groups: AdminGroup[]; totalGroups: number; newGroups: number; system: AdminSystem | null }) {
  return <>
    <section className="admin-overview-heading"><div><div className="admin-section-kicker">MONDAY, SEPTEMBER 15</div><h1>Good morning, Hayyaun.</h1><p>Here’s the calm little pulse of Ekipma today.</p></div><div className="admin-heading-actions"><Button variant="outline"><CalendarDays /> Last 30 days <ChevronDown /></Button><Button onClick={onNotice}><Download /> Export snapshot</Button></div></section>
    <section className="admin-metrics" aria-label="Overview metrics"><MetricCard label="Total people" value={total.toLocaleString()} trend="Live" detail="registered accounts" icon={UsersRound} color="violet" up /><MetricCard label="Collaborating groups" value={totalGroups.toLocaleString()} trend="Live" detail="all groups" icon={FolderKanban} color="cyan" up /><MetricCard label="Premium access" value="328" trend="13.6%" detail="illustrative" icon={Gem} color="lavender" up /><MetricCard label="New groups" value={newGroups.toLocaleString()} trend="Live" detail="last 30 days" icon={Sparkles} color="green" up /></section>
    <section className="admin-overview-entities"><Card><CardHeader><div><CardTitle>Newest people</CardTitle><CardDescription>Live accounts · latest 5</CardDescription></div></CardHeader><CardContent>{users.length ? <div className="admin-overview-user-list">{users.slice(0, 5).map((user) => <div className="admin-overview-user" key={user.id}><Avatar user={user} small /><div><strong>{user.name}</strong><span>{user.email || user.phone}</span></div><time>{user.joined}</time></div>)}</div> : <p className="admin-no-results">No accounts found.</p>}</CardContent></Card><Card><CardHeader><div><CardTitle>Newest groups</CardTitle><CardDescription>Live groups · latest 5</CardDescription></div></CardHeader><CardContent>{groups.length ? <div className="admin-overview-user-list">{groups.slice(0, 5).map((group) => <div className="admin-overview-user" key={group.id}><GroupMark group={group} /><div><strong>{group.name}</strong><span>{group.memberCount} {group.memberCount === 1 ? "member" : "members"} · {group.public ? "Public" : "Private"}</span></div><time>{new Date(group.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" })}</time></div>)}</div> : <p className="admin-no-results">No groups found.</p>}</CardContent></Card></section>
    <section className="admin-overview-grid"><Card className="admin-activity-card"><CardHeader><div><CardTitle>Collaboration is growing</CardTitle><CardDescription>Illustrative weekly collaborating groups · last 12 weeks</CardDescription></div><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="sm">Weekly <ChevronDown /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem>Weekly</DropdownMenuItem><DropdownMenuItem>Monthly</DropdownMenuItem></DropdownMenuContent></DropdownMenu></CardHeader><CardContent><div className="admin-chart-summary"><div><strong>486</strong><span>groups this week</span></div><Badge variant="success"><ArrowUpRight /> 8.2%</Badge></div><div className="admin-bar-chart" aria-label="Illustrative weekly active group chart">{bars.map((height, index) => <span key={index} style={{ height: `${height}%` }} className={index === bars.length - 1 ? "is-latest" : ""}><i /></span>)}</div><div className="admin-chart-axis"><span>JUN 30</span><span>JUL 28</span><span>AUG 25</span><span>SEP 15</span></div></CardContent></Card>
      <Card className="admin-health-card"><CardHeader><div><CardTitle>Service pulse</CardTitle><CardDescription>{system ? `Sampled ${new Date(system.system.collectedAt).toLocaleTimeString()}` : "Live metrics unavailable"}</CardDescription></div><Button size="icon" variant="ghost" aria-label="System status"><Gauge /></Button></CardHeader><CardContent><div className="admin-health-list"><HealthRow label="API service" status={system ? "Ready" : "Unknown"} tone={system ? "ready" : "unknown"} detail={system ? `Up ${formatUptime(system.system.processUptimeSeconds)}` : "Could not read server metrics"} /><HealthRow label="Database" status={system?.database.status === "operational" ? "Ready" : "Degraded"} tone={system?.database.status === "operational" ? "ready" : "unknown"} detail={system ? `${system.database.latencyMs.toFixed(1)} ms ping` : "Readiness unavailable"} /><HealthRow label="Admin API" status="Ready" tone="ready" detail="Role-protected operations endpoint" /></div><button className="admin-card-link" onClick={onNotice}>View operational notes <ArrowUpRight /></button></CardContent></Card></section>
    <section className="admin-detail-grid"><Card className="admin-recent-card"><CardHeader><div><CardTitle>Recent collaboration</CardTitle><CardDescription>What groups are doing together</CardDescription></div><Button variant="ghost" size="sm">View activity <ArrowUpRight /></Button></CardHeader><CardContent><div className="admin-activity-list">{recentActivity.map((event) => { const Icon = event.icon; return <div key={event.title} className="admin-activity-row"><span className={`admin-event-icon admin-event-${event.tone}`}><Icon /></span><div><strong>{event.title}</strong><span>{event.detail}</span></div><Badge variant="outline">{event.label}</Badge><time>{event.time}</time></div>; })}</div></CardContent></Card>
      <Card className="admin-insight-card"><CardHeader><Badge variant="secondary"><Sparkles /> Product signal</Badge><CardTitle>Turns are quietly becoming a habit.</CardTitle></CardHeader><CardContent><p>Groups that complete a first rotation are a useful future retention signal. Instrument it before treating this as a live conclusion.</p><div className="admin-insight-foot"><span><Clock3 /> Data plan required</span><Button variant="outline" size="sm" onClick={onNotice}>See why <ArrowUpRight /></Button></div></CardContent></Card></section>
    <section className="admin-bottom-grid"><Card><CardHeader><div><CardTitle>Membership watch</CardTitle><CardDescription>Prototype view of access that needs attention</CardDescription></div><Button variant="ghost" size="sm">View memberships <ArrowUpRight /></Button></CardHeader><CardContent><div className="admin-watch-list"><WatchRow name="Premium access expiring" value="19" note="within 7 days" tone="amber" /><WatchRow name="Trial source unknown" value="—" note="requires entitlement history" tone="muted" /><WatchRow name="Manual grants" value="—" note="no admin ledger yet" tone="muted" /></div></CardContent></Card>
      <Card><CardHeader><div><CardTitle>Admin actions</CardTitle><CardDescription>Protected operations will live here</CardDescription></div></CardHeader><CardContent className="admin-action-grid"><Button variant="outline" onClick={onNotice}><Gem /> Manage memberships</Button><Button variant="outline" onClick={onNotice}><UserRound /> Find a person</Button><Button variant="outline" onClick={onNotice}><ShieldCheck /> Review audit log</Button><Button variant="outline" onClick={onNotice}><Database /> Check system</Button></CardContent></Card></section>
  </>;
}

function MetricCard({ label, value, trend, detail, icon: Icon, color, up }: { label: string; value: string; trend: string; detail: string; icon: typeof UsersRound; color: string; up: boolean }) { return <Card className="admin-metric-card"><CardContent><div className={`admin-metric-icon admin-metric-${color}`}><Icon /></div><div className="admin-metric-label">{label}</div><div className="admin-metric-value">{value}</div><div className="admin-metric-trend"><span className={up ? "is-up" : ""}>{up ? <ArrowUpRight /> : <ArrowDownRight />}{trend}</span><small>{detail}</small></div></CardContent></Card>; }
function HealthRow({ label, status, tone, detail }: { label: string; status: string; tone: string; detail: string }) { return <div className="admin-health-row"><span className={`admin-health-indicator ${tone}`} /><div><strong>{label}</strong><span>{detail}</span></div><Badge variant={tone === "ready" ? "success" : tone === "unknown" ? "warning" : "outline"}>{status}</Badge></div>; }
function WatchRow({ name, value, note, tone }: { name: string; value: string; note: string; tone: string }) { return <div className="admin-watch-row"><span className={`admin-watch-icon ${tone}`}><Gem /></span><div><strong>{name}</strong><span>{note}</span></div><b>{value}</b></div>; }
