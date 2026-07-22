import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Download, LogOut, Search, Trash2, Inbox, Shield, ExternalLink, Plus, ArrowUp, ArrowDown,
  Save, Upload, Image as ImageIcon, Trash, Copy,
} from "lucide-react";
import { loadSetting, saveSetting, uploadMedia, deleteMedia, type MediaItem } from "@/lib/cms";
import { ICON_NAMES, getIcon } from "@/lib/iconMap";

type EnquiryStatus = "new" | "contacted" | "quotation_sent" | "follow_up" | "won" | "lost";
type Enquiry = {
  id: string; name: string; business_name: string | null; email: string; phone: string | null;
  service: string | null; budget: string | null; message: string | null; status: EnquiryStatus; created_at: string;
};

const STATUS_META: Record<EnquiryStatus, { label: string; className: string }> = {
  new: { label: "New", className: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300" },
  contacted: { label: "Contacted", className: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" },
  quotation_sent: { label: "Quotation Sent", className: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300" },
  follow_up: { label: "Follow Up", className: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300" },
  won: { label: "Won", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" },
  lost: { label: "Lost", className: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" },
};

type NavKey =
  | "enquiries"
  | "logo" | "hero" | "sections" | "contact" | "footer" | "seo"
  | "services" | "industries" | "stats" | "pricing" | "why" | "process" | "faqs" | "socials"
  | "media";

const NAV_GROUPS: { title: string; items: { key: NavKey; label: string }[] }[] = [
  { title: "CRM", items: [{ key: "enquiries", label: "Enquiries" }] },
  { title: "Site Settings", items: [
    { key: "logo", label: "Logo" }, { key: "hero", label: "Hero" }, { key: "sections", label: "Section Toggles" },
    { key: "contact", label: "Contact Details" }, { key: "footer", label: "Footer" }, { key: "seo", label: "SEO" },
  ]},
  { title: "Content", items: [
    { key: "services", label: "Services" }, { key: "industries", label: "Industries" },
    { key: "stats", label: "Stats" }, { key: "pricing", label: "Pricing Plans" },
    { key: "why", label: "Why Choose Us" }, { key: "process", label: "Process Steps" },
    { key: "faqs", label: "FAQ" }, { key: "socials", label: "Social Links" },
  ]},
  { title: "Assets", items: [{ key: "media", label: "Media Library" }] },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);
  const [tab, setTab] = useState<NavKey>("enquiries");

  useEffect(() => { document.title = "Admin — WEBARQN"; }, []);
  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (u.user) {
        const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
        setIsAdmin(!!roles?.some((r) => r.role === "admin"));
      }
      setChecked(true);
    })();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  }

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-base font-bold tracking-tight">WEBARQN</Link>
            <span className="rounded-full bg-[#2563EB]/10 px-2 py-0.5 text-xs font-medium text-[#2563EB]">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline-flex sm:items-center sm:gap-1">
              View site <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <Button variant="outline" size="sm" onClick={signOut}><LogOut className="mr-1.5 h-4 w-4" /> Sign out</Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-16 lg:h-fit">
          <nav className="space-y-5 rounded-2xl border border-border/60 bg-card p-3">
            {NAV_GROUPS.map((g) => (
              <div key={g.title}>
                <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{g.title}</div>
                <ul className="space-y-0.5">
                  {g.items.map((it) => (
                    <li key={it.key}>
                      <button onClick={() => setTab(it.key)}
                        className={`w-full rounded-md px-3 py-1.5 text-left text-sm transition ${tab === it.key ? "bg-[#2563EB] text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                        {it.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <main>
          {checked && !isAdmin && (
            <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              <Shield className="mt-0.5 h-4 w-4 flex-none" />
              <div>
                <div className="font-semibold">No admin role yet</div>
                <div className="mt-0.5">Your account is signed in but hasn't been granted admin access. Content editing is disabled until an admin grants you the role.</div>
              </div>
            </div>
          )}
          {tab === "enquiries" && <Enquiries />}
          {tab === "logo" && <LogoEditor />}
          {tab === "hero" && <HeroEditor />}
          {tab === "sections" && <SectionsEditor />}
          {tab === "contact" && <ContactEditor />}
          {tab === "footer" && <FooterEditor />}
          {tab === "seo" && <SeoEditor />}
          {tab === "services" && <ServicesEditor />}
          {tab === "industries" && <IndustriesEditor />}
          {tab === "stats" && <StatsEditor />}
          {tab === "pricing" && <PricingEditor />}
          {tab === "why" && <WhyEditor />}
          {tab === "process" && <ProcessEditor />}
          {tab === "faqs" && <FaqsEditor />}
          {tab === "socials" && <SocialsEditor />}
          {tab === "media" && <MediaLibraryPanel />}
        </main>
      </div>
    </div>
  );
}

/* ---------------- Enquiries ---------------- */
function Enquiries() {
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | EnquiryStatus>("all");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("enquiries")
      .select("id,name,business_name,email,phone,service,budget,message,status,created_at")
      .order("created_at", { ascending: false });
    if (error) { toast.error("Not authorized."); setRows([]); }
    else setRows((data ?? []) as Enquiry[]);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!q) return true;
      return r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
        || (r.business_name ?? "").toLowerCase().includes(q)
        || (r.phone ?? "").toLowerCase().includes(q)
        || (r.service ?? "").toLowerCase().includes(q)
        || (r.message ?? "").toLowerCase().includes(q);
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
    if (error) { setRows(prev); toast.error("Failed to update status"); }
  }
  async function remove(id: string) {
    if (!confirm("Delete this enquiry?")) return;
    const { error } = await supabase.from("enquiries").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r.filter((row) => row.id !== id));
    toast.success("Deleted");
  }
  function exportCsv() {
    const headers = ["Date", "Name", "Business", "Email", "Phone", "Service", "Budget", "Status", "Message"];
    const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [headers.join(","), ...filtered.map((r) => [
      new Date(r.created_at).toISOString(), r.name, r.business_name, r.email, r.phone,
      r.service, r.budget, STATUS_META[r.status].label, r.message,
    ].map(escape).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `webarqn-enquiries-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Section title="Enquiries" desc="Manage every lead that comes through the site.">
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search enquiries…" className="pl-9" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip active={filter === "all"} onClick={() => setFilter("all")}>All · {counts.all}</Chip>
            {(Object.keys(STATUS_META) as EnquiryStatus[]).map((s) => (
              <Chip key={s} active={filter === s} onClick={() => setFilter(s)}>{STATUS_META[s].label} · {counts[s] ?? 0}</Chip>
            ))}
            <Button variant="outline" size="sm" onClick={exportCsv} disabled={filtered.length === 0}>
              <Download className="mr-1.5 h-4 w-4" /> Export CSV
            </Button>
          </div>
        </div>
        {loading ? <div className="p-10 text-center text-sm text-muted-foreground">Loading…</div>
          : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-14 text-center text-sm text-muted-foreground">
              <Inbox className="h-8 w-8 opacity-60" /><div>No enquiries.</div>
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
                        <br /><span className="text-[11px]">{new Date(r.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{r.name}</div>
                        {r.business_name && <div className="text-xs text-muted-foreground">{r.business_name}</div>}
                        <div className="mt-1 space-y-0.5 text-xs">
                          <a href={`mailto:${r.email}`} className="block text-[#2563EB] hover:underline">{r.email}</a>
                          {r.phone && <a href={`tel:${r.phone}`} className="block text-muted-foreground hover:text-foreground">{r.phone}</a>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs"><div>{r.service ?? "—"}</div><div className="text-muted-foreground">{r.budget ?? ""}</div></td>
                      <td className="max-w-xs px-4 py-3 text-xs text-muted-foreground"><p className="line-clamp-3 whitespace-pre-wrap">{r.message ?? "—"}</p></td>
                      <td className="px-4 py-3">
                        <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value as EnquiryStatus)}
                          className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none ring-1 ring-inset ring-transparent focus:ring-[#2563EB] ${STATUS_META[r.status].className}`}>
                          {(Object.keys(STATUS_META) as EnquiryStatus[]).map((s) => (<option key={s} value={s}>{STATUS_META[s].label}</option>))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => remove(r.id)} className="rounded-md p-2 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600" aria-label="Delete">
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
    </Section>
  );
}

/* ---------------- Shared UI ---------------- */
function Section({ title, desc, children, actions }: { title: string; desc?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${active ? "bg-[#0B1220] text-white dark:bg-white dark:text-[#0B1220]" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>{children}</button>
  );
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">{children}</div>;
}

/* ---------------- Settings-based editors ---------------- */
function useSetting<T>(key: string) {
  const [value, setValue] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => { loadSetting<T>(key).then((v) => { setValue(v); setLoading(false); }); }, [key]);
  const save = async () => {
    if (!value) return;
    setSaving(true);
    try { await saveSetting(key, value); toast.success("Saved"); }
    catch (e) { toast.error((e as Error).message); }
    finally { setSaving(false); }
  };
  return { value, setValue, loading, saving, save };
}

function LogoEditor() {
  const { value, setValue, loading, saving, save } = useSetting<{ url: string; alt: string }>("logo");
  if (loading || !value) return <Section title="Logo"><Card>Loading…</Card></Section>;
  return (
    <Section title="Logo" desc="Displayed in the header and footer." actions={<Button onClick={save} disabled={saving}><Save className="mr-1.5 h-4 w-4" />{saving ? "Saving…" : "Save"}</Button>}>
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Logo URL"><Input value={value.url} onChange={(e) => setValue({ ...value, url: e.target.value })} placeholder="Paste image URL or upload in Media Library" /></Field>
          <Field label="Alt / Wordmark"><Input value={value.alt} onChange={(e) => setValue({ ...value, alt: e.target.value })} /></Field>
        </div>
        <div className="mt-4">
          <MediaPicker onPick={(m) => setValue({ ...value, url: m.url })} />
        </div>
        {value.url && (
          <div className="mt-4 rounded-lg border border-dashed border-border/60 bg-muted/30 p-4">
            <div className="mb-2 text-xs text-muted-foreground">Preview</div>
            <img src={value.url} alt={value.alt} className="h-12 w-auto" />
          </div>
        )}
      </Card>
    </Section>
  );
}

function HeroEditor() {
  const { value, setValue, loading, saving, save } = useSetting<{
    enabled: boolean; eyebrow: string; heading_prefix: string; heading_accent: string; subheading: string;
    cta_primary_label: string; cta_primary_href: string; cta_secondary_label: string; cta_secondary_href: string;
    image_url: string; badges: string[];
  }>("hero");
  if (loading || !value) return <Section title="Hero"><Card>Loading…</Card></Section>;
  return (
    <Section title="Hero Section" desc="Top of the homepage." actions={<Button onClick={save} disabled={saving}><Save className="mr-1.5 h-4 w-4" />{saving ? "Saving…" : "Save"}</Button>}>
      <Card>
        <label className="mb-4 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={value.enabled} onChange={(e) => setValue({ ...value, enabled: e.target.checked })} /> Show hero
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Eyebrow"><Input value={value.eyebrow} onChange={(e) => setValue({ ...value, eyebrow: e.target.value })} /></Field>
          <Field label="Image URL"><Input value={value.image_url} onChange={(e) => setValue({ ...value, image_url: e.target.value })} placeholder="Leave blank for default mockup" /></Field>
          <Field label="Heading Prefix"><Input value={value.heading_prefix} onChange={(e) => setValue({ ...value, heading_prefix: e.target.value })} /></Field>
          <Field label="Heading Accent"><Input value={value.heading_accent} onChange={(e) => setValue({ ...value, heading_accent: e.target.value })} /></Field>
          <Field label="Subheading"><Textarea rows={3} value={value.subheading} onChange={(e) => setValue({ ...value, subheading: e.target.value })} /></Field>
          <Field label="Badges (comma separated)">
            <Input value={value.badges.join(", ")} onChange={(e) => setValue({ ...value, badges: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
          </Field>
          <Field label="Primary CTA Label"><Input value={value.cta_primary_label} onChange={(e) => setValue({ ...value, cta_primary_label: e.target.value })} /></Field>
          <Field label="Primary CTA Href"><Input value={value.cta_primary_href} onChange={(e) => setValue({ ...value, cta_primary_href: e.target.value })} /></Field>
          <Field label="Secondary CTA Label"><Input value={value.cta_secondary_label} onChange={(e) => setValue({ ...value, cta_secondary_label: e.target.value })} /></Field>
          <Field label="Secondary CTA Href"><Input value={value.cta_secondary_href} onChange={(e) => setValue({ ...value, cta_secondary_href: e.target.value })} /></Field>
        </div>
        <div className="mt-4"><MediaPicker onPick={(m) => setValue({ ...value, image_url: m.url })} /></div>
      </Card>
    </Section>
  );
}

function SectionsEditor() {
  const { value, setValue, loading, saving, save } = useSetting<Record<string, boolean>>("sections");
  if (loading || !value) return <Section title="Section Toggles"><Card>Loading…</Card></Section>;
  const keys: [string, string][] = [
    ["features_enabled", "Features strip"], ["services_enabled", "Services"], ["industries_enabled", "Industries"],
    ["stats_enabled", "Stats"], ["pricing_enabled", "Pricing"], ["why_enabled", "Why choose us"],
    ["process_enabled", "Process"], ["faq_enabled", "FAQ"], ["contact_enabled", "Contact"],
  ];
  return (
    <Section title="Section Toggles" desc="Show or hide entire homepage sections." actions={<Button onClick={save} disabled={saving}><Save className="mr-1.5 h-4 w-4" />{saving ? "Saving…" : "Save"}</Button>}>
      <Card>
        <div className="grid gap-3 sm:grid-cols-2">
          {keys.map(([k, label]) => (
            <label key={k} className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-4 py-2.5 text-sm">
              <input type="checkbox" checked={!!value[k]} onChange={(e) => setValue({ ...value, [k]: e.target.checked })} />
              {label}
            </label>
          ))}
        </div>
      </Card>
    </Section>
  );
}

function ContactEditor() {
  const { value, setValue, loading, saving, save } = useSetting<Record<string, string>>("contact_details");
  if (loading || !value) return <Section title="Contact"><Card>Loading…</Card></Section>;
  const fields: [string, string][] = [
    ["heading", "Heading"], ["subheading", "Subheading"], ["company_name", "Company Name"],
    ["email", "Email"], ["phone", "Phone"], ["whatsapp", "WhatsApp URL"], ["website", "Website"],
    ["address", "Address / Location"], ["business_hours", "Business Hours"], ["google_maps_embed", "Google Maps Embed URL"],
  ];
  return (
    <Section title="Contact Details" actions={<Button onClick={save} disabled={saving}><Save className="mr-1.5 h-4 w-4" />{saving ? "Saving…" : "Save"}</Button>}>
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(([k, label]) => (
            <Field key={k} label={label}>
              {k === "subheading" ? (
                <Textarea rows={2} value={value[k] ?? ""} onChange={(e) => setValue({ ...value, [k]: e.target.value })} />
              ) : (
                <Input value={value[k] ?? ""} onChange={(e) => setValue({ ...value, [k]: e.target.value })} />
              )}
            </Field>
          ))}
        </div>
      </Card>
    </Section>
  );
}

function FooterEditor() {
  const { value, setValue, loading, saving, save } = useSetting<{ tagline: string; copyright: string; note: string; privacy_url: string; terms_url: string; services_list: string[] }>("footer");
  if (loading || !value) return <Section title="Footer"><Card>Loading…</Card></Section>;
  return (
    <Section title="Footer" actions={<Button onClick={save} disabled={saving}><Save className="mr-1.5 h-4 w-4" />{saving ? "Saving…" : "Save"}</Button>}>
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tagline"><Input value={value.tagline} onChange={(e) => setValue({ ...value, tagline: e.target.value })} /></Field>
          <Field label="Copyright"><Input value={value.copyright} onChange={(e) => setValue({ ...value, copyright: e.target.value })} /></Field>
          <Field label="Right-side note"><Input value={value.note} onChange={(e) => setValue({ ...value, note: e.target.value })} /></Field>
          <Field label="Privacy URL"><Input value={value.privacy_url} onChange={(e) => setValue({ ...value, privacy_url: e.target.value })} /></Field>
          <Field label="Terms URL"><Input value={value.terms_url} onChange={(e) => setValue({ ...value, terms_url: e.target.value })} /></Field>
          <Field label="Services list (one per line)">
            <Textarea rows={6} value={value.services_list.join("\n")} onChange={(e) => setValue({ ...value, services_list: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
          </Field>
        </div>
      </Card>
    </Section>
  );
}

function SeoEditor() {
  const { value, setValue, loading, saving, save } = useSetting<Record<string, string>>("seo");
  if (loading || !value) return <Section title="SEO"><Card>Loading…</Card></Section>;
  const fields: [string, string, boolean?][] = [
    ["title", "Page Title"], ["description", "Meta Description", true], ["keywords", "Keywords"],
    ["og_image", "OpenGraph Image URL"], ["favicon", "Favicon URL"], ["google_analytics_id", "Google Analytics ID"],
  ];
  return (
    <Section title="SEO & Meta" actions={<Button onClick={save} disabled={saving}><Save className="mr-1.5 h-4 w-4" />{saving ? "Saving…" : "Save"}</Button>}>
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(([k, label, textarea]) => (
            <Field key={k} label={label}>
              {textarea ? (
                <Textarea rows={3} value={value[k] ?? ""} onChange={(e) => setValue({ ...value, [k]: e.target.value })} />
              ) : (
                <Input value={value[k] ?? ""} onChange={(e) => setValue({ ...value, [k]: e.target.value })} />
              )}
            </Field>
          ))}
        </div>
      </Card>
    </Section>
  );
}

/* ---------------- Generic list editor ---------------- */
type ListRow = { id: string; sort_order: number; enabled: boolean; [k: string]: unknown };

function ListEditor<T extends ListRow>({
  title, desc, table, defaults, renderRow,
}: {
  title: string; desc?: string; table: "services" | "industries" | "stats" | "pricing_plans" | "why_choose" | "process_steps" | "faqs" | "social_links";
  defaults: Omit<T, "id" | "sort_order" | "enabled">;
  renderRow: (row: T, patch: (v: Partial<T>) => void) => ReactNode;
}) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from(table).select("*").order("sort_order");
    setRows((data ?? []) as unknown as T[]);
    setLoading(false);
  }, [table]);
  useEffect(() => { load(); }, [load]);

  async function addRow() {
    const max = rows.reduce((m, r) => Math.max(m, r.sort_order), 0);
    const payload = { ...defaults, sort_order: max + 1, enabled: true };
    const { data, error } = await supabase.from(table).insert(payload as never).select().single();
    if (error) return toast.error(error.message);
    setRows((r) => [...r, data as unknown as T]);
    toast.success("Added");
  }
  async function saveRow(row: T) {
    setSavingId(row.id);
    const { id, ...rest } = row;
    const { error } = await supabase.from(table).update(rest as never).eq("id", id);
    setSavingId(null);
    if (error) return toast.error(error.message);
    toast.success("Saved");
  }
  async function removeRow(id: string) {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r.filter((x) => x.id !== id));
  }
  async function move(id: string, dir: -1 | 1) {
    const sorted = [...rows].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((r) => r.id === id);
    const swapIdx = idx + dir;
    if (idx === -1 || swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx], b = sorted[swapIdx];
    const aOrder = a.sort_order, bOrder = b.sort_order;
    setRows((rs) => rs.map((r) => r.id === a.id ? { ...r, sort_order: bOrder } : r.id === b.id ? { ...r, sort_order: aOrder } : r));
    await Promise.all([
      supabase.from(table).update({ sort_order: bOrder } as never).eq("id", a.id),
      supabase.from(table).update({ sort_order: aOrder } as never).eq("id", b.id),
    ]);
  }

  const sorted = [...rows].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <Section title={title} desc={desc} actions={<Button onClick={addRow}><Plus className="mr-1.5 h-4 w-4" /> Add</Button>}>
      {loading ? <Card>Loading…</Card> : sorted.length === 0 ? <Card>No items yet. Click "Add".</Card> : (
        <div className="space-y-3">
          {sorted.map((row) => (
            <div key={row.id} className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input type="checkbox" checked={row.enabled} onChange={(e) => setRows((rs) => rs.map((r) => r.id === row.id ? { ...r, enabled: e.target.checked } : r))} />
                  Enabled
                </label>
                <div className="flex items-center gap-1">
                  <button onClick={() => move(row.id, -1)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"><ArrowUp className="h-4 w-4" /></button>
                  <button onClick={() => move(row.id, 1)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"><ArrowDown className="h-4 w-4" /></button>
                  <Button variant="outline" size="sm" onClick={() => saveRow(row)} disabled={savingId === row.id}>
                    <Save className="mr-1 h-3.5 w-3.5" />{savingId === row.id ? "Saving" : "Save"}
                  </Button>
                  <button onClick={() => removeRow(row.id)} className="rounded-md p-1.5 text-rose-600 hover:bg-rose-500/10"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              {renderRow(row, (patch) => setRows((rs) => rs.map((r) => r.id === row.id ? { ...r, ...patch } as T : r)))}
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const Icon = getIcon(value);
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-10 w-10 place-items-center rounded-md border border-border/60 bg-muted/30 text-[#2563EB]"><Icon className="h-5 w-5" /></div>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm">
        {ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
    </div>
  );
}

function ServicesEditor() {
  return <ListEditor<{ id: string; icon: string; title: string; description: string; sort_order: number; enabled: boolean }>
    title="Services" desc="Cards shown in the Services section."
    table="services" defaults={{ icon: "Sparkles", title: "New Service", description: "" }}
    renderRow={(row, patch) => (
      <div className="grid gap-3 sm:grid-cols-[minmax(0,220px)_1fr_2fr]">
        <Field label="Icon"><IconPicker value={row.icon} onChange={(v) => patch({ icon: v })} /></Field>
        <Field label="Title"><Input value={row.title} onChange={(e) => patch({ title: e.target.value })} /></Field>
        <Field label="Description"><Input value={row.description} onChange={(e) => patch({ description: e.target.value })} /></Field>
      </div>
    )} />;
}
function IndustriesEditor() {
  return <ListEditor<{ id: string; name: string; sort_order: number; enabled: boolean }>
    title="Industries" table="industries" defaults={{ name: "New industry" }}
    renderRow={(row, patch) => (
      <Field label="Name"><Input value={row.name} onChange={(e) => patch({ name: e.target.value })} /></Field>
    )} />;
}
function StatsEditor() {
  return <ListEditor<{ id: string; number: number; suffix: string; label: string; sort_order: number; enabled: boolean }>
    title="Stats" table="stats" defaults={{ number: 10, suffix: "+", label: "New Metric" }}
    renderRow={(row, patch) => (
      <div className="grid gap-3 sm:grid-cols-4">
        <Field label="Number"><Input type="number" value={row.number} onChange={(e) => patch({ number: Number(e.target.value) })} /></Field>
        <Field label="Suffix"><Input value={row.suffix} onChange={(e) => patch({ suffix: e.target.value })} /></Field>
        <Field label="Label"><Input className="sm:col-span-2" value={row.label} onChange={(e) => patch({ label: e.target.value })} /></Field>
      </div>
    )} />;
}
function PricingEditor() {
  return <ListEditor<{ id: string; name: string; price: string; tag: string; popular: boolean; features: string[]; sort_order: number; enabled: boolean }>
    title="Pricing Plans" table="pricing_plans"
    defaults={{ name: "New Plan", price: "0", tag: "", popular: false, features: [] }}
    renderRow={(row, patch) => (
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name"><Input value={row.name} onChange={(e) => patch({ name: e.target.value })} /></Field>
        <Field label="Price (₹)"><Input value={row.price} onChange={(e) => patch({ price: e.target.value })} /></Field>
        <Field label="Tag / Subtitle"><Input value={row.tag} onChange={(e) => patch({ tag: e.target.value })} /></Field>
        <Field label="Popular">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={row.popular} onChange={(e) => patch({ popular: e.target.checked })} /> Highlight this plan</label>
        </Field>
        <Field label="Features (one per line)">
          <Textarea rows={8} value={(row.features ?? []).join("\n")} onChange={(e) => patch({ features: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
        </Field>
      </div>
    )} />;
}
function WhyEditor() {
  return <ListEditor<{ id: string; icon: string; title: string; description: string; sort_order: number; enabled: boolean }>
    title="Why Choose Us" table="why_choose"
    defaults={{ icon: "Sparkles", title: "New reason", description: "" }}
    renderRow={(row, patch) => (
      <div className="grid gap-3 sm:grid-cols-[minmax(0,220px)_1fr_2fr]">
        <Field label="Icon"><IconPicker value={row.icon} onChange={(v) => patch({ icon: v })} /></Field>
        <Field label="Title"><Input value={row.title} onChange={(e) => patch({ title: e.target.value })} /></Field>
        <Field label="Description"><Input value={row.description} onChange={(e) => patch({ description: e.target.value })} /></Field>
      </div>
    )} />;
}
function ProcessEditor() {
  return <ListEditor<{ id: string; title: string; description: string; sort_order: number; enabled: boolean }>
    title="Process Steps" table="process_steps"
    defaults={{ title: "New Step", description: "" }}
    renderRow={(row, patch) => (
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Title"><Input value={row.title} onChange={(e) => patch({ title: e.target.value })} /></Field>
        <Field label="Description"><Input value={row.description} onChange={(e) => patch({ description: e.target.value })} /></Field>
      </div>
    )} />;
}
function FaqsEditor() {
  return <ListEditor<{ id: string; question: string; answer: string; sort_order: number; enabled: boolean }>
    title="FAQ" table="faqs" defaults={{ question: "New question", answer: "" }}
    renderRow={(row, patch) => (
      <div className="grid gap-3">
        <Field label="Question"><Input value={row.question} onChange={(e) => patch({ question: e.target.value })} /></Field>
        <Field label="Answer"><Textarea rows={3} value={row.answer} onChange={(e) => patch({ answer: e.target.value })} /></Field>
      </div>
    )} />;
}
function SocialsEditor() {
  return <ListEditor<{ id: string; platform: string; url: string; icon: string; sort_order: number; enabled: boolean }>
    title="Social Links" table="social_links"
    defaults={{ platform: "Instagram", url: "", icon: "Instagram" }}
    renderRow={(row, patch) => (
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Platform"><Input value={row.platform} onChange={(e) => patch({ platform: e.target.value })} /></Field>
        <Field label="URL"><Input value={row.url} onChange={(e) => patch({ url: e.target.value })} /></Field>
        <Field label="Icon"><IconPicker value={row.icon} onChange={(v) => patch({ icon: v })} /></Field>
      </div>
    )} />;
}

/* ---------------- Media Library ---------------- */
function MediaLibraryPanel() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("media_library").select("*").order("created_at", { ascending: false });
    setItems((data ?? []) as MediaItem[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadMedia(file, "general");
      }
      await load();
      toast.success("Uploaded");
    } catch (e) { toast.error((e as Error).message); }
    finally { setUploading(false); }
  }
  async function del(item: MediaItem) {
    if (!confirm(`Delete ${item.name}?`)) return;
    try { await deleteMedia(item); setItems((xs) => xs.filter((x) => x.id !== item.id)); }
    catch (e) { toast.error((e as Error).message); }
  }
  const copy = (url: string) => { navigator.clipboard.writeText(url); toast.success("URL copied"); };

  return (
    <Section title="Media Library" desc="Upload and manage images used across the site." actions={
      <label className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-[#2563EB] px-3 py-2 text-sm font-semibold text-white hover:brightness-110 ${uploading ? "opacity-60" : ""}`}>
        <Upload className="h-4 w-4" /> {uploading ? "Uploading…" : "Upload"}
        <input type="file" multiple hidden onChange={(e) => onFiles(e.target.files)} disabled={uploading} />
      </label>
    }>
      {loading ? <Card>Loading…</Card> : items.length === 0 ? <Card>No files uploaded yet.</Card> : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.id} className="group overflow-hidden rounded-xl border border-border/60 bg-card">
              <div className="aspect-video bg-muted/30">
                {it.mime_type?.startsWith("image/")
                  ? <img src={it.url} alt={it.name} className="h-full w-full object-cover" />
                  : <div className="grid h-full place-items-center text-muted-foreground"><ImageIcon className="h-6 w-6" /></div>}
              </div>
              <div className="p-3">
                <div className="truncate text-xs font-medium" title={it.name}>{it.name}</div>
                <div className="text-[10px] text-muted-foreground">{(it.size ?? 0) > 0 ? `${((it.size ?? 0) / 1024).toFixed(0)} KB` : ""}</div>
                <div className="mt-2 flex items-center gap-1">
                  <button onClick={() => copy(it.url)} className="flex-1 rounded-md border border-border/60 py-1 text-xs hover:bg-muted"><Copy className="mx-auto h-3.5 w-3.5" /></button>
                  <button onClick={() => del(it)} className="rounded-md border border-border/60 p-1.5 text-rose-600 hover:bg-rose-500/10"><Trash className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

function MediaPicker({ onPick }: { onPick: (m: MediaItem) => void }) {
  const [uploading, setUploading] = useState(false);
  async function onFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    try {
      const item = await uploadMedia(file, "general");
      onPick(item);
      toast.success("Uploaded & selected");
    } catch (e) { toast.error((e as Error).message); }
    finally { setUploading(false); }
  }
  return (
    <label className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border/60 bg-muted/20 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted ${uploading ? "opacity-60" : ""}`}>
      <Upload className="h-3.5 w-3.5" /> {uploading ? "Uploading…" : "Upload & use image"}
      <input type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0] ?? null)} disabled={uploading} />
    </label>
  );
}