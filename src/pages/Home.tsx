// Landing page for WEBARQN. Fully driven by Supabase CMS data.
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  motion, useInView, useMotionValue, useSpring, AnimatePresence, useScroll, useTransform, type Variants,
} from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowRight, MessageCircle, Phone, Mail, MapPin, Globe, Sun, Moon, Menu, X,
  Check, Sparkles, IndianRupee, CheckCircle2, Star,
} from "lucide-react";
import heroMockup from "@/assets/hero-mockup.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { loadCms, type CmsData } from "@/lib/cms";
import { getIcon } from "@/lib/iconMap";

const DEFAULT_FEATURES = [
  { icon: "Palette", title: "Modern Design", description: "Clean, premium interfaces built for 2026." },
  { icon: "Smartphone", title: "Mobile Friendly", description: "Pixel-perfect on every screen size." },
  { icon: "Search", title: "SEO Optimized", description: "Built to rank on Google from day one." },
  { icon: "Zap", title: "Fast Performance", description: "Sub-second load times, 95+ Lighthouse." },
  { icon: "ShieldCheck", title: "Secure", description: "HTTPS, hardened auth, best practices." },
  { icon: "TrendingUp", title: "Scalable", description: "Grows with your traffic and team." },
];

const NAV = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Industries", href: "#industries" },
  { label: "Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const BUDGETS = ["₹2,999 – ₹5,999", "₹5,999 – ₹8,999", "₹8,999 – ₹14,999", "₹14,999+"];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  show: (i = 0) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

const cinematicReveal: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.96, filter: "blur(16px)" },
  show: (i = 0) => ({
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: i * 0.09 },
  }),
};

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-gradient-to-r from-[#2563EB] via-[#60a5fa] to-[#2563EB]"
    />
  );
}

function SplitHeading({ prefix, accent }: { prefix: string; accent: string }) {
  const words = `${prefix} ${accent}`.split(" ");
  const accentStart = prefix.split(" ").filter(Boolean).length;
  return (
    <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[3.75rem]">
      {words.map((w, i) => (
        <span key={i} className="mr-[0.25em] inline-block overflow-hidden align-bottom">
          <motion.span
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className={`inline-block ${i >= accentStart ? "bg-gradient-to-r from-[#2563EB] to-[#60a5fa] bg-clip-text text-transparent" : ""}`}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

export default function HomePage() {
  const [data, setData] = useState<CmsData | null>(null);
  useEffect(() => {
    loadCms().then(setData).catch(() => setData(null));
  }, []);
  useEffect(() => {
    if (!data?.seo) return;
    const { title, description, keywords, favicon, og_image } = data.seo;
    if (title) document.title = title;
    const setMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
      if (!content) return;
      let m = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
      if (!m) {
        m = document.createElement("meta");
        m.setAttribute(attr, name);
        document.head.appendChild(m);
      }
      m.content = content;
    };
    setMeta("description", description);
    setMeta("keywords", keywords);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    if (og_image) setMeta("og:image", og_image, "property");
    if (favicon) {
      let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = favicon;
    }
  }, [data]);

  if (!data) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
        <div className="flex items-center gap-2 text-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#2563EB]" /> Loading…
        </div>
      </div>
    );
  }
  return <LandingPage data={data} />;
}

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("theme")) as "light" | "dark" | null;
    const initial = saved ?? "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);
  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  };
  return { theme, toggle };
}

function Nav({ logo }: { logo: { url: string; alt: string } }) {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all ${
        scrolled ? "backdrop-blur-xl bg-background/70 border-b border-border/60" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-4">
          {logo.url ? (
            <span className="grid place-items-center rounded-full bg-white border border-black overflow-hidden h-[54px] w-[54px] sm:h-[62px] sm:w-[62px] lg:h-[70px] lg:w-[70px] p-0.5 shadow-sm">
              <img src={logo.url} alt={logo.alt || "WEBARQN"} className="h-full w-full object-contain" />
            </span>
          ) : (
            <span className="grid place-items-center rounded-full bg-white border border-black overflow-hidden h-[54px] w-[54px] sm:h-[62px] sm:w-[62px] lg:h-[70px] lg:w-[70px] p-0.5 shadow-sm">
              <Sparkles className="h-5 w-5 text-[#0B1220]" />
            </span>
          )}
          <span className="text-[20px] font-bold leading-none tracking-[1px] text-[#0B1220] sm:text-[24px] lg:text-[28px]">
            WEBARQN
          </span>
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={toggle} aria-label="Toggle theme" className="grid h-9 w-9 place-items-center rounded-md border border-border/60 text-foreground transition hover:bg-accent">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <a href="#contact" className="hidden rounded-md bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition hover:brightness-110 md:inline-flex">
            Get Quote
          </a>
          <button className="grid h-9 w-9 place-items-center rounded-md border border-border/60 md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur md:hidden">
            <div className="flex flex-col p-4">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
                  {n.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
      variants={{ show: { transition: { staggerChildren: 0.12 } } }}
      className="mx-auto mb-12 max-w-2xl text-center"
    >
      {eyebrow && (
        <motion.span
          variants={fadeUp}
          className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-[#2563EB] backdrop-blur"
        >
          <Sparkles className="h-3 w-3" />
          {eyebrow}
        </motion.span>
      )}
      <motion.h2 variants={cinematicReveal} className="text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{title}</motion.h2>
      {subtitle && <motion.p variants={fadeUp} className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">{subtitle}</motion.p>}
    </motion.div>
  );
}

function Hero({ hero }: { hero: CmsData["hero"] }) {
  const h = hero ?? {
    enabled: true, eyebrow: "", heading_prefix: "We Build Websites That", heading_accent: "Grow Your Business",
    subheading: "", cta_primary_label: "Get Free Quote", cta_primary_href: "#contact",
    cta_secondary_label: "WhatsApp Now", cta_secondary_href: "#", image_url: "", badges: [],
  };
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  return (
    <section ref={heroRef} id="home" className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          style={{ opacity: glowOpacity }}
          animate={{ scale: [1, 1.15, 1], rotate: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.22),transparent_60%)] blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 40, -30, 0], y: [0, -20, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.18),transparent_70%)] blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.15),transparent_70%)] blur-3xl"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(11,18,32,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(11,18,32,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]" />
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <motion.div style={{ y: textY }} className="lg:col-span-6">
          {h.eyebrow && (
            <motion.span
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#2563EB]/20 bg-[#2563EB]/5 px-3 py-1 text-xs font-medium text-[#2563EB]"
            >
              <Star className="h-3 w-3 fill-[#2563EB]" />
              {h.eyebrow}
            </motion.span>
          )}
          <SplitHeading prefix={h.heading_prefix} accent={h.heading_accent} />
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg"
          >{h.subheading}</motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a href={h.cta_primary_href || "#contact"} className="group inline-flex items-center gap-2 rounded-lg bg-[#0B1220] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0B1220]/20 transition hover:brightness-110 dark:bg-white dark:text-[#0B1220]">
              {h.cta_primary_label}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <a href={h.cta_secondary_href || "#"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-background/60 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur transition hover:bg-accent">
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              {h.cta_secondary_label}
            </a>
          </motion.div>
          {h.badges?.length ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95, duration: 0.8 }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
            >
              {h.badges.map((b) => (
                <div key={b} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#2563EB]" /> {b}
                </div>
              ))}
            </motion.div>
          ) : null}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{ y: imgY, scale: imgScale }}
          className="lg:col-span-6"
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <motion.div
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-[#2563EB]/30 via-transparent to-[#60a5fa]/20 blur-3xl"
            />
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-white/70 p-2 shadow-2xl shadow-[#0B1220]/20 backdrop-blur dark:bg-white/5">
              <img src={h.image_url || heroMockup} alt="WEBARQN dashboard preview" width={1408} height={1008} className="w-full rounded-xl" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {DEFAULT_FEATURES.map((f, i) => {
            const Icon = getIcon(f.icon);
            return (
              <motion.div key={f.title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} custom={i}
                className="group rounded-xl border border-border/60 bg-card p-4 transition hover:-translate-y-1 hover:border-[#2563EB]/40 hover:shadow-lg hover:shadow-[#2563EB]/10">
                <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-sm font-semibold">{f.title}</div>
                <p className="mt-1 text-xs text-muted-foreground">{f.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Services({ services }: { services: CmsData["services"] }) {
  return (
    <section id="services" className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Services" title="Everything you need to go online"
          subtitle="From your first landing page to a full CRM, we build the digital stack that scales your business." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = getIcon(s.icon);
            return (
              <motion.div key={s.id} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} custom={i}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition hover:-translate-y-1 hover:border-[#2563EB]/40 hover:shadow-xl hover:shadow-[#2563EB]/10">
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#2563EB]/5 blur-2xl transition group-hover:bg-[#2563EB]/15" />
                <div className="relative">
                  <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#0B1220] to-[#1e293b] text-white shadow-md dark:from-[#2563EB] dark:to-[#60a5fa]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{s.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Industries({ industries }: { industries: CmsData["industries"] }) {
  return (
    <section id="industries" className="py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Industries We Serve" title="Built for the businesses that build India"
          subtitle="From studios and clinics to factories and schools, we ship solutions tailored to your industry." />
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {industries.map((ind, i) => (
            <motion.span key={ind.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.02, duration: 0.35 }} whileHover={{ y: -2 }}
              className="rounded-full border border-border/60 bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:border-[#2563EB]/50 hover:bg-[#2563EB]/5 hover:text-[#2563EB]">
              {ind.name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ to, suffix = "+" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1600, bounce: 0 });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (inView) mv.set(to);
    const unsub = spring.on("change", (v) => setVal(Math.round(v)));
    return () => unsub();
  }, [inView, to, mv, spring]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function Stats({ stats }: { stats: CmsData["stats"] }) {
  return (
    <section className="relative py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-[#0B1220] to-[#111a30] p-8 text-white shadow-2xl sm:p-12">
          <div className={`grid grid-cols-2 gap-8 md:grid-cols-${Math.max(1, Math.min(stats.length, 5))}`}>
            {stats.map((s) => (
              <div key={s.id} className="text-center">
                <div className="bg-gradient-to-r from-white to-[#93c5fd] bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
                  <Counter to={s.number} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-xs font-medium uppercase tracking-wider text-white/60 sm:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing({ plans }: { plans: CmsData["plans"] }) {
  return (
    <section id="pricing" className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Pricing" title="Transparent plans, premium quality"
          subtitle="Pick the plan that matches your goals. All plans include free SSL, deployment and lifetime guidance." />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((p, i) => (
            <motion.div key={p.id} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} custom={i}
              className={`relative flex flex-col rounded-2xl border p-6 shadow-sm transition hover:-translate-y-1 ${p.popular ? "border-[#2563EB] bg-gradient-to-b from-[#2563EB]/5 to-transparent shadow-xl shadow-[#2563EB]/20" : "border-border/60 bg-card"}`}>
              {p.popular && (
                <div className="absolute -top-3 right-6 rounded-full bg-[#2563EB] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-lg">Most Popular</div>
              )}
              <div className="text-sm font-semibold uppercase tracking-wider text-[#2563EB]">{p.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">{p.tag}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <IndianRupee className="h-6 w-6 text-foreground" />
                <span className="text-4xl font-bold tracking-tight">{p.price}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">One-time · GST extra</div>
              <ul className="mt-6 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>
              <a href="#contact" className={`mt-8 inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${p.popular ? "bg-[#2563EB] text-white hover:brightness-110" : "border border-border/70 bg-background text-foreground hover:bg-accent"}`}>
                Get Started <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChoose({ items }: { items: CmsData["why"] }) {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Why WEBARQN" title="A partner that ships, supports and scales" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((w, i) => {
            const Icon = getIcon(w.icon);
            return (
              <motion.div key={w.id} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} custom={i}
                className="rounded-xl border border-border/60 bg-card p-5 transition hover:-translate-y-1 hover:border-[#2563EB]/40 hover:shadow-md">
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-sm font-semibold">{w.title}</div>
                {w.description && <p className="mt-1 text-xs text-muted-foreground">{w.description}</p>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Process({ steps }: { steps: CmsData["process"] }) {
  return (
    <section id="process" className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Our Process" title="Simple, predictable, on-time"
          subtitle="A proven process that turns your idea into a live, revenue-ready product." />
        <div className="relative">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-[#2563EB]/40 to-transparent md:block" />
          <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-${Math.max(2, Math.min(steps.length, 7))}`}>
            {steps.map((s, i) => (
              <motion.div key={s.id} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i} className="flex flex-col items-center text-center">
                <div className="relative grid h-12 w-12 place-items-center rounded-full border border-[#2563EB]/30 bg-background text-sm font-bold text-[#2563EB] shadow-md">{i + 1}</div>
                <div className="mt-3 text-sm font-semibold">{s.title}</div>
                {s.description && <div className="mt-1 text-xs text-muted-foreground">{s.description}</div>}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ({ faqs }: { faqs: CmsData["faqs"] }) {
  return (
    <section id="faq" className="py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="FAQ" title="Questions, answered" />
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={f.id} value={`item-${i}`} className="mb-3 rounded-xl border border-border/60 bg-card px-4">
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">{f.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function Contact({ contact, services }: { contact: CmsData["contact"]; services: CmsData["services"] }) {
  const c = contact ?? {
    heading: "Let's Build Your Business Website", subheading: "", company_name: "WEBARQN",
    email: "", phone: "", whatsapp: "", website: "", address: "", google_maps_embed: "", business_hours: "",
  };
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const { error } = await supabase.from("enquiries").insert({
      name: data.name,
      business_name: data.business || null,
      email: data.email,
      phone: data.phone || null,
      service: data.service || null,
      budget: data.budget || null,
      message: data.message || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not send enquiry. Please try again or WhatsApp us.");
      return;
    }
    setSubmitted(true);
    toast.success("Enquiry received! We'll reach out within 24 hours.");
    form.reset();
  };
  const phoneHref = c.phone ? `tel:${c.phone.replace(/[^+\d]/g, "")}` : "#";
  return (
    <section id="contact" className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Contact" title={c.heading} subtitle={c.subheading} />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-lg sm:p-8">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-10 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-[#2563EB]/10 text-[#2563EB]">
                      <CheckCircle2 className="h-8 w-8" />
                    </motion.div>
                    <h3 className="text-xl font-bold">Enquiry received</h3>
                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">Thanks for reaching out. Our team will get in touch within 24 hours with a free quote and next steps.</p>
                    <button onClick={() => setSubmitted(false)} className="mt-6 text-sm font-medium text-[#2563EB] hover:underline">Send another enquiry</button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" required maxLength={100} placeholder="Your full name" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="business">Business Name</Label>
                      <Input id="business" name="business" maxLength={100} placeholder="Your business" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required maxLength={200} placeholder="you@company.com" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" type="tel" required maxLength={20} placeholder="+91 98765 43210" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="service">Service Required</Label>
                      <select id="service" name="service" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="">Select a service</option>
                        {services.map((s) => <option key={s.id}>{s.title}</option>)}
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="budget">Budget</Label>
                      <select id="budget" name="budget" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="">Select a budget</option>
                        {BUDGETS.map((b) => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" name="message" required maxLength={1000} rows={4} placeholder="Tell us about your project, goals and timeline." />
                    </div>
                    <div className="sm:col-span-2">
                      <Button type="submit" disabled={submitting} className="h-11 w-full bg-[#2563EB] text-white hover:brightness-110">
                        {submitting ? "Sending…" : "Send Enquiry"}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="space-y-4 lg:col-span-2">
            {c.whatsapp && (
              <a href={c.whatsapp} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-5 transition hover:-translate-y-0.5 hover:border-[#25D366]/40 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#25D366]/10 text-[#25D366]">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">WhatsApp us</div>
                    <div className="text-xs text-muted-foreground">Fastest response</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </a>
            )}
            {c.phone && (
              <a href={phoneHref} className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-5 transition hover:-translate-y-0.5 hover:border-[#2563EB]/40 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Call us</div>
                    <div className="text-xs text-muted-foreground">{c.phone}</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </a>
            )}
            {c.email && (
              <div className="rounded-2xl border border-border/60 bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]"><Mail className="h-5 w-5" /></div>
                  <div>
                    <div className="text-sm font-semibold">Email</div>
                    <div className="text-xs text-muted-foreground">{c.email}</div>
                  </div>
                </div>
              </div>
            )}
            {c.website && (
              <div className="rounded-2xl border border-border/60 bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]"><Globe className="h-5 w-5" /></div>
                  <div>
                    <div className="text-sm font-semibold">Website</div>
                    <div className="text-xs text-muted-foreground">{c.website}</div>
                  </div>
                </div>
              </div>
            )}
            {c.address && (
              <div className="rounded-2xl border border-border/60 bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]"><MapPin className="h-5 w-5" /></div>
                  <div>
                    <div className="text-sm font-semibold">Location</div>
                    <div className="text-xs text-muted-foreground">{c.address}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ data }: { data: CmsData }) {
  const f = data.footer ?? { tagline: "", copyright: "© 2026 WEBARQN. All Rights Reserved.", note: "", privacy_url: "", terms_url: "", services_list: [] };
  return (
    <footer className="border-t border-border/60 bg-[#0B1220] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2 font-bold">
            {data.logo.url ? (
              <img src={data.logo.url} alt={data.logo.alt || "WEBARQN"} className="h-8 w-auto" />
            ) : (
              <>
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#2563EB]"><Sparkles className="h-4 w-4" /></span>
                <span className="text-lg">{data.logo.alt || "WEBARQN"}</span>
              </>
            )}
          </div>
          <p className="mt-3 max-w-xs text-sm text-white/60">{f.tagline}</p>
          <div className="mt-5 flex gap-2">
            {data.socials.map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <a key={s.id} href={s.url} aria-label={s.platform} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-white transition hover:bg-[#2563EB] hover:border-[#2563EB]">
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold">Quick Links</div>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            {NAV.map((n) => (
              <li key={n.href}><a href={n.href} className="hover:text-white">{n.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Services</div>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            {f.services_list.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Contact</div>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            {data.contact?.email && <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> {data.contact.email}</li>}
            {data.contact?.phone && <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> {data.contact.phone}</li>}
            {data.contact?.address && <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {data.contact.address}</li>}
            <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row sm:px-6 lg:px-8">
          <div>{f.copyright}</div>
          <div className="flex items-center gap-3">
            {f.privacy_url && <a href={f.privacy_url} className="hover:text-white">Privacy</a>}
            {f.terms_url && <a href={f.terms_url} className="hover:text-white">Terms</a>}
            {f.note && <span>{f.note}</span>}
          </div>
        </div>
      </div>
    </footer>
  );
}

function LandingPage({ data }: { data: CmsData }) {
  const s = data.sections ?? {
    features_enabled: true, services_enabled: true, industries_enabled: true, stats_enabled: true,
    pricing_enabled: true, why_enabled: true, process_enabled: true, faq_enabled: true, contact_enabled: true,
  };
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased [scroll-behavior:smooth]">
      <Nav logo={data.logo} />
      <main>
        {data.hero?.enabled !== false && <Hero hero={data.hero} />}
        {s.features_enabled && <Features />}
        {s.services_enabled && <Services services={data.services} />}
        {s.industries_enabled && <Industries industries={data.industries} />}
        {s.stats_enabled && <Stats stats={data.stats} />}
        {s.pricing_enabled && <Pricing plans={data.plans} />}
        {s.why_enabled && <WhyChoose items={data.why} />}
        {s.process_enabled && <Process steps={data.process} />}
        {s.faq_enabled && <FAQ faqs={data.faqs} />}
        {s.contact_enabled && <Contact contact={data.contact} services={data.services} />}
      </main>
      <Footer data={data} />
    </div>
  );
}