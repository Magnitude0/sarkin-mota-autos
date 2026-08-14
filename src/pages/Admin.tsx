import { useAction, useMutation, useQuery } from "convex/react";
import {
  Car,
  Download,
  ExternalLink,
  LayoutDashboard,
  Loader2,
  LogOut,
  MessageSquare,
  Pencil,
  Phone,
  Plus,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import type { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { MachineModal } from "@/components/admin/MachineModal";
import { statusChip, type Car as CarType } from "@/components/site/CarCard";

type Lead = Doc<"inquiries">;
import { LogoMark } from "@/components/site/SiteLogo";
import { WhatsAppIcon } from "@/components/site/icons";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { formatNaira, waLink } from "@/lib/site";

type Tab = "overview" | "inventory" | "leads" | "team";

// Must match MAX_ADMIN_ACCOUNTS in src/convex/auth.ts.
const MAX_ADMIN_ACCOUNTS = 3;

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "inventory", label: "Inventory", icon: Car },
  { id: "leads", label: "Leads & Inquiries", icon: MessageSquare },
  { id: "team", label: "Team", icon: Users },
];

function formatDate(ts?: number) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function MetricCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: typeof Car;
  accent: string;
}) {
  return (
    <div
      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#151517] p-5"
      style={{ transform: "none" }}
    >
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border",
          accent,
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="font-display text-2xl font-black text-white">{value}</p>
        <p className="font-display text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#888]">
          {label}
        </p>
      </div>
    </div>
  );
}

/* ───────────────────── Overview ───────────────────── */

function OverviewPanel({
  cars,
  leads,
  onAddMachine,
}: {
  cars: CarType[] | undefined;
  leads: Lead[] | undefined;
  onAddMachine: () => void;
}) {
  const total = cars?.length ?? 0;
  const available = cars?.filter((c) => c.status === "available").length ?? 0;
  const sold = cars?.filter((c) => c.status === "sold").length ?? 0;
  const startOfToday = new Date().setHours(0, 0, 0, 0);
  const todayLeads = leads?.filter((l) => l.createdAt >= startOfToday).length ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-2xl font-black text-white">
          The Kingdom at a <span className="text-gold">Glance</span>
        </h2>
        <p className="mt-1 text-sm text-[#888]">
          Welcome back, My Bratha — here&apos;s how the showroom is doing today.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Machines"
          value={cars === undefined ? "…" : total}
          icon={Car}
          accent="border-gold/40 bg-gold/10 text-gold"
        />
        <MetricCard
          label="Available"
          value={cars === undefined ? "…" : available}
          icon={Car}
          accent="border-[#25d366]/40 bg-[#25d366]/10 text-[#4ade80]"
        />
        <MetricCard
          label="Sold"
          value={cars === undefined ? "…" : sold}
          icon={Car}
          accent="border-white/20 bg-white/5 text-[#d8d8d8]"
        />
        <MetricCard
          label="Today's Leads"
          value={leads === undefined ? "…" : todayLeads}
          icon={MessageSquare}
          accent="border-red/40 bg-red/10 text-[#ff8b97]"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <MetricCard
          label="All-Time Leads"
          value={leads === undefined ? "…" : leads.length}
          icon={MessageSquare}
          accent="border-red/40 bg-red/10 text-[#ff8b97]"
        />
        <div
          className="flex flex-col justify-center gap-3 rounded-2xl border border-white/10 bg-[#151517] p-5"
          style={{ transform: "none" }}
        >
          <p className="font-display text-sm font-extrabold uppercase tracking-[0.14em] text-gold">
            Quick Actions
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={waLink("👑 SARKIN MOTA — ADMIN\n\nQuick message from the dashboard.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa btn-sm"
            >
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </a>
            <button
              type="button"
              onClick={onAddMachine}
              className="btn btn-red btn-sm"
            >
              <Plus className="h-4 w-4" /> Add Machine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────── Inventory panel ───────────────────── */

function InventoryPanel({
  cars,
  onEdit,
  onDelete,
  onAdd,
}: {
  cars: CarType[] | undefined;
  onEdit: (car: CarType) => void;
  onDelete: (car: CarType) => void;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl font-black text-white">
          Showroom Inventory
        </h2>
        <button type="button" onClick={onAdd} className="btn btn-red btn-sm">
          <Plus className="h-4 w-4" /> Add Machine
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#151517]">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left font-display text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-[#888]">
              <th className="px-4 py-3.5">Machine</th>
              <th className="px-4 py-3.5">Price</th>
              <th className="px-4 py-3.5">Year</th>
              <th className="px-4 py-3.5">Mileage</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Added</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars === undefined ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-gold" />
                </td>
              </tr>
            ) : cars.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <p className="text-sm text-[#888]">
                    No machines yet. Add your first one above 👆
                  </p>
                </td>
              </tr>
            ) : (
              cars.map((car) => (
                <tr
                  key={car._id}
                  className="border-b border-white/5 transition-colors hover:bg-white/5"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {car.images?.[0] ? (
                        <img
                          src={car.images[0]}
                          alt=""
                          className="h-11 w-16 shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <span className="flex h-11 w-16 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-gold/10">
                          <Car className="h-4 w-4 text-gold" />
                        </span>
                      )}
                      <span className="font-semibold text-white">{car.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gold">
                    {formatNaira(car.price)}
                  </td>
                  <td className="px-4 py-3 text-[#b8b8b8]">{car.year ?? "—"}</td>
                  <td className="px-4 py-3 text-[#b8b8b8]">{car.mileage ?? "—"}</td>
                  <td className="px-4 py-3">{statusChip(car.status)}</td>
                  <td className="px-4 py-3 text-[#888]">
                    {formatDate(car.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        aria-label={`Edit ${car.title}`}
                        onClick={() => onEdit(car)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-[#d8d8d8] transition-colors hover:border-gold/50 hover:text-gold"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${car.title}`}
                        onClick={() => onDelete(car)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-[#d8d8d8] transition-colors hover:border-red/60 hover:text-red"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────────────────── Leads panel ───────────────────── */

function LeadsPanel({ leads }: { leads: Lead[] | undefined }) {
  const markContacted = useMutation(api.inquiries.markContacted);

  const exportCsv = () => {
    const rows = [
      ["Name", "Phone", "Machine", "Message", "Date", "Status"],
      ...(leads ?? []).map((l) => [
        l.name,
        l.phone,
        l.carInterest ?? "",
        l.message ?? "",
        new Date(l.createdAt).toISOString(),
        l.status,
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sarkin-mota-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl font-black text-white">
          Leads &amp; Inquiries
        </h2>
        <button
          type="button"
          onClick={exportCsv}
          className="btn btn-outline-gold btn-sm"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#151517]">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left font-display text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-[#888]">
              <th className="px-4 py-3.5">Name</th>
              <th className="px-4 py-3.5">Phone</th>
              <th className="px-4 py-3.5">Machine</th>
              <th className="px-4 py-3.5">Date</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads === undefined ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-gold" />
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <p className="text-sm text-[#888]">
                    No leads yet. They&apos;ll land here the moment someone
                    submits a form.
                  </p>
                </td>
              </tr>
            ) : (
              leads.map((l) => (
                <tr
                  key={l._id}
                  className="border-b border-white/5 transition-colors hover:bg-white/5"
                >
                  <td className="px-4 py-3 font-semibold text-white">{l.name}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`tel:${l.phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-1.5 text-[#b8b8b8] transition-colors hover:text-gold"
                    >
                      <Phone className="h-3 w-3" /> {l.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-[#b8b8b8]">
                    {l.carInterest ?? "General"}
                  </td>
                  <td className="px-4 py-3 text-[#888]">{formatDate(l.createdAt)}</td>
                  <td className="px-4 py-3">
                    {l.status === "new" ? (
                      <span className="badge-chip badge-hot">New</span>
                    ) : (
                      <span className="badge-chip badge-available">Contacted</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={waLink(
                          `👑 SARKIN MOTA — LEAD REPLY\n\nName: ${l.name}\nPhone: ${l.phone}\nMachine: ${l.carInterest ?? "General"}\n\n— sarkinmota.com`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`WhatsApp ${l.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#25d366]/40 bg-[#25d366]/10 text-[#4ade80] transition-colors hover:bg-[#25d366]/20"
                      >
                        <WhatsAppIcon className="h-3.5 w-3.5" />
                      </a>
                      {l.status === "new" && (
                        <button
                          type="button"
                          onClick={() => void markContacted({ id: l._id })}
                          className="btn btn-outline-gold btn-sm px-3 py-1.5 text-xs"
                        >
                          Mark Contacted
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────────────────── Team panel ───────────────────── */

function TeamPanel({
  accounts,
  currentUserId,
  onCreateUser,
}: {
  accounts: Doc<"users">[] | undefined;
  currentUserId: string | undefined;
  onCreateUser: (args: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<unknown>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  const count = accounts?.length ?? 0;
  const seatsLeft = Math.max(MAX_ADMIN_ACCOUNTS - count, 0);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail.includes("@")) {
      setMessage({ ok: false, text: "Enter a valid email address." });
      return;
    }
    if (password.length < 8) {
      setMessage({ ok: false, text: "Password must be at least 8 characters." });
      return;
    }
    setSubmitting(true);
    try {
      await onCreateUser({
        email: trimmedEmail,
        password,
        name: name.trim() || undefined,
      });
      setMessage({
        ok: true,
        text: `${trimmedEmail} now has the throne. Share the password securely.`,
      });
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Could not create that account.";
      setMessage({ ok: false, text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl font-black text-white">
          The <span className="text-gold">Team</span>
        </h2>
        <span className="badge-chip badge-available">
          {count} of {MAX_ADMIN_ACCOUNTS} seats filled
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#151517]">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left font-display text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-[#888]">
              <th className="px-4 py-3.5">Account</th>
              <th className="px-4 py-3.5">Email</th>
              <th className="px-4 py-3.5">Joined</th>
              <th className="px-4 py-3.5">Role</th>
            </tr>
          </thead>
          <tbody>
            {accounts === undefined ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-gold" />
                </td>
              </tr>
            ) : (
              accounts.map((a) => (
                <tr
                  key={a._id}
                  className="border-b border-white/5 transition-colors hover:bg-white/5"
                >
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 font-semibold text-white">
                      {a.name || "—"}
                      {a._id === currentUserId && (
                        <span className="badge-chip badge-new">You</span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#b8b8b8]">{a.email ?? "—"}</td>
                  <td className="px-4 py-3 text-[#888]">
                    {formatDate(a._creationTime)}
                  </td>
                  <td className="px-4 py-3 text-[#b8b8b8]">
                    <span className="capitalize">{a.role ?? "admin"}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {seatsLeft > 0 ? (
        <form
          onSubmit={handleAdd}
          className="rounded-2xl border border-white/10 bg-[#151517] p-5"
        >
          <p className="font-display text-sm font-extrabold uppercase tracking-[0.14em] text-gold">
            Grant a Seat
          </p>
          <p className="mt-1 text-xs text-[#888]">
            {seatsLeft} seat{seatsLeft === 1 ? "" : "s"} remaining. The new
            admin signs in with this email and password.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="team-name" className="field-label">
                Full Name
              </label>
              <input
                id="team-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aliyu Mohammad"
                className="input-dark"
                disabled={submitting}
              />
            </div>
            <div>
              <label htmlFor="team-email" className="field-label">
                Email *
              </label>
              <input
                id="team-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="input-dark"
                disabled={submitting}
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="team-password" className="field-label">
                Password *
              </label>
              <input
                id="team-password"
                type="text"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="input-dark"
                disabled={submitting}
                autoComplete="new-password"
              />
            </div>
          </div>

          {message && (
            <p
              role="alert"
              className={cn(
                "mt-4 rounded-xl border px-4 py-3 text-sm",
                message.ok
                  ? "border-[#25d366]/40 bg-[#25d366]/10 text-[#4ade80]"
                  : "border-red/40 bg-red/10 text-[#ff8b97]",
              )}
            >
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-red btn-sm mt-5"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Creating…
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" /> Grant Seat
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="rounded-2xl border border-gold/20 bg-gold/5 px-4 py-5 text-center text-sm text-[#b8b8b8]">
          All {MAX_ADMIN_ACCOUNTS} seats are filled — the roster is complete. 👑
        </div>
      )}
    </div>
  );
}

/* ───────────────────── Page ───────────────────── */

export default function Admin() {
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CarType | null>(null);

  const cars = useQuery(api.inventory.list);
  const leads = useQuery(api.inquiries.list);
  const accounts = useQuery(api.accounts.list);
  const createUser = useAction(api.accounts.createUser);
  const removeCar = useMutation(api.inventory.removeCar);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-gold" />
      </main>
    );
  }

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (car: CarType) => {
    setEditing(car);
    setModalOpen(true);
  };
  const handleDelete = (car: CarType) => {
    if (
      window.confirm(
        `Delete "${car.title}" from the showroom? This cannot be undone.`,
      )
    ) {
      void removeCar({ id: car._id });
    }
  };
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar (desktop) */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-[260px] flex-col border-r border-white/10 bg-[#0d0d0d] lg:flex">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <LogoMark size={38} />
          <div className="flex flex-col leading-none">
            <span className="font-display text-sm font-black tracking-[0.06em] text-white">
              SARKIN <span className="text-gold">MOTA</span>
            </span>
            <span className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.25em] text-[#888]">
              Admin
            </span>
          </div>
        </div>

        <nav aria-label="Admin navigation" className="flex flex-col gap-1 p-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-left font-display text-sm font-bold transition-colors",
                tab === t.id
                  ? "bg-gold/12 text-gold"
                  : "text-[#b8b8b8] hover:bg-white/5 hover:text-white",
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-1 border-t border-white/10 p-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 font-display text-sm font-bold text-[#b8b8b8] transition-colors hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" /> View Website
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-left font-display text-sm font-bold text-[#b8b8b8] transition-colors hover:bg-red/10 hover:text-red"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-[260px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0d0d0d]/95 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <div className="flex items-center gap-3 lg:hidden">
              <LogoMark size={34} />
              <span className="font-display text-sm font-black tracking-[0.06em] text-white">
                SARKIN <span className="text-gold">MOTA</span>{" "}
                <span className="text-[#888]">· Admin</span>
              </span>
            </div>
            <div className="hidden items-center gap-2 lg:flex">
              <span className="text-sm text-[#888]">Signed in as</span>
              <span className="font-semibold text-white">
                {user?.email ?? "Admin"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="flex h-9 items-center gap-2 rounded-lg border border-white/15 px-3 text-xs font-bold text-[#d8d8d8] transition-colors hover:border-gold/50 hover:text-gold lg:hidden"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Site
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex h-9 items-center gap-2 rounded-lg border border-white/15 px-3 text-xs font-bold text-[#d8d8d8] transition-colors hover:border-red/60 hover:text-red lg:hidden"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>
          </div>

          {/* Mobile tabs */}
          <div className="flex gap-2 overflow-x-auto px-5 pb-3 lg:hidden">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 font-display text-xs font-bold transition-colors",
                  tab === t.id
                    ? "border-gold/60 bg-gold/12 text-gold"
                    : "border-white/15 text-[#b8b8b8]",
                )}
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            ))}
          </div>
        </header>

        <main className="px-5 py-8 sm:px-8">
          {tab === "overview" && (
            <OverviewPanel
              cars={cars}
              leads={leads}
              onAddMachine={openAdd}
            />
          )}
          {tab === "inventory" && (
            <InventoryPanel
              cars={cars}
              onEdit={openEdit}
              onDelete={handleDelete}
              onAdd={openAdd}
            />
          )}
          {tab === "leads" && <LeadsPanel leads={leads} />}
          {tab === "team" && (
            <TeamPanel
              accounts={accounts}
              currentUserId={user?._id}
              onCreateUser={createUser}
            />
          )}
        </main>
      </div>

      <MachineModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
      />
    </div>
  );
}
