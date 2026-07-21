import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Download, LogOut, Search, Trash2, Inbox, Shield, ExternalLink } from "lucide-react";

type EnquiryStatus = "new" | "contacted" | "quotation_sent" | "follow_up" | "won" | "lost";

type Enquiry = {
  id: string;
  name: string;
  business_name: string | null;
  email: string;
  phone: string | null;
  service: string | null;
  budget: string | null;
  message: string | null;
  status: EnquiryStatus;
  created_at: string;
};

const STATUS_META: Record<EnquiryStatus, { label: string; className: string }> = {
  new: { label: "New", className: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300" },
  contacted: { label: "Contacted", className: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" },
  quotation_sent: { label: "Quotation Sent", className: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300" },
  follow_up: { label: "Follow Up", className: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300" },
  won: { label: "Won", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" },
  lost: { label: "Lost", className: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" },
};

export default function AdminPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | EnquiryStatus>("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkedRole, setCheckedRole] = useState(false);

  useEffect(() => {
    document.title = "Admin — WEBARQN";
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("enquiries")
      .select("id,name,business_name,email,phone,service,budget,message,status,created_at")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Not authorized. Ask an admin to grant you access.");
      setRows([]);
    } else {
      setRows((data ?? []) as Enquiry[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (u.user) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", u.user.id);
        setIsAdmin(!!roles?.some((r) => r.role === "admin"));
      }
      setCheckedRole(true);
    })();
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.business_name ?? "").toLowerCase().includes(q) ||
        (r.phone ?? "").toLowerCase().includes(q) ||
        (r.service ?? "").toLowerCase().includes(q) ||
        (r.message ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, query, filter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    for (const s of Object.keys(STATUS_META)) c[s] = 0;
    for (const r of rows) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [rows]);

  async function updateStatus(id: string, status: EnquiryStatus) {
    const prev = rows;
    setRows((r) => r.map((row) => (row.id === id ? { ...row, status } : row)));
    const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
    if (error) {
      setRows(prev);
      toast.error("Failed to update status");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this enquiry? This cannot be undone.")) return;
    const { error } = await supabase.from("enquiries").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r.filter((row) => row.id !== id));
    toast.success("Deleted");
  }

  function exportCsv() {
    const headers = ["Date", "Name", "Business", "Email", "Phone", "Service", "Budget", "Status", "Message"];
    const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [
      headers.join(","),
      ...filtered.map((r) =>
        [
          new Date(r.created_at).toISOString(),
          r.name,
          r.business_name,
          r.email,
          r.phone,
          r.service,
          r.budget,
          STATUS_META[r.status].label,
          r.message,
        ]
          .map(escape)
          .join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `webarqn-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  }

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-base font-bold tracking-tight">
              WEBARQN
            </Link>
            <span className="rounded-full bg-[#2563EB]/10 px-2 py-0.5 text-xs font-medium text-[#2563EB]">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline-flex sm:items-center sm:gap-1"
            >
              View site <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="mr-1.5 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {checkedRole && !isAdmin && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            <Shield className="mt-0.5 h-4 w-4 flex-none" />
            <div>
              <div className="font-semibold">No admin role yet</div>
              <div className="mt-0.5">
                Your account is signed in but hasn't been granted admin access. Ask an existing admin
                (or the site owner) to promote you. Enquiries will appear here once your role is added.
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total enquiries" value={rows.length} />
          <StatCard label="New" value={counts.new ?? 0} />
          <StatCard
            label="In progress"
            value={(counts.contacted ?? 0) + (counts.quotation_sent ?? 0) + (counts.follow_up ?? 0)}
          />
          <StatCard label="Won" value={counts.won ?? 0} />
        </div>

        <div className="mt-6 rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search enquiries…"
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
                All · {counts.all}
              </FilterChip>
              {(Object.keys(STATUS_META) as EnquiryStatus[]).map((s) => (
                <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)}>
                  {STATUS_META[s].label} · {counts[s] ?? 0}
                </FilterChip>
              ))}
              <Button variant="outline" size="sm" onClick={exportCsv} disabled={filtered.length === 0}>
                <Download className="mr-1.5 h-4 w-4" /> Export CSV
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-muted-foreground">Loading enquiries…</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-14 text-center text-sm text-muted-foreground">
              <Inbox className="h-8 w-8 opacity-60" />
              <div>No enquiries match your filters.</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border/60 bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Contact</th>
                    <th className="px-4 py-3 font-medium">Service / Budget</th>
                    <th className="px-4 py-3 font-medium">Message</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-b border-border/40 align-top hover:bg-muted/20">
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString()}
                        <br />
                        <span className="text-[11px]">
                          {new Date(r.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{r.name}</div>
                        {r.business_name && (
                          <div className="text-xs text-muted-foreground">{r.business_name}</div>
                        )}
                        <div className="mt-1 space-y-0.5 text-xs">
                          <a href={`mailto:${r.email}`} className="block text-[#2563EB] hover:underline">
                            {r.email}
                          </a>
                          {r.phone && (
                            <a
                              href={`tel:${r.phone}`}
                              className="block text-muted-foreground hover:text-foreground"
                            >
                              {r.phone}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <div>{r.service ?? "—"}</div>
                        <div className="text-muted-foreground">{r.budget ?? ""}</div>
                      </td>
                      <td className="max-w-xs px-4 py-3 text-xs text-muted-foreground">
                        <p className="line-clamp-3 whitespace-pre-wrap">{r.message ?? "—"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={r.status}
                          onChange={(e) => updateStatus(r.id, e.target.value as EnquiryStatus)}
                          className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none ring-1 ring-inset ring-transparent focus:ring-[#2563EB] ${STATUS_META[r.status].className}`}
                        >
                          {(Object.keys(STATUS_META) as EnquiryStatus[]).map((s) => (
                            <option key={s} value={s}>
                              {STATUS_META[s].label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => remove(r.id)}
                          className="rounded-md p-2 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600"
                          aria-label="Delete enquiry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold tracking-tight">{value}</div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "bg-[#0B1220] text-white dark:bg-white dark:text-[#0B1220]"
          : "bg-muted text-muted-foreground hover:bg-muted/70"
      }`}
    >
      {children}
    </button>
  );
}