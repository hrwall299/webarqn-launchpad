import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useInView, useMotionValue, useSpring, AnimatePresence, type Variants } from "framer-motion";
import {
  ArrowRight,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Globe,
  Sun,
  Moon,
  Menu,
  X,
  Check,
  Sparkles,
  Smartphone,
  Search,
  Zap,
  ShieldCheck,
  TrendingUp,
  LayoutGrid,
  Building2,
  Briefcase,
  User,
  FileText,
  ShoppingCart,
  LineChart,
  Users,
  Receipt,
  FilePlus2,
  ServerCog,
  BarChart3,
  Megaphone,
  Facebook,
  Wrench,
  GraduationCap,
  Palette,
  Rocket,
  Clock,
  Award,
  IndianRupee,
  Instagram,
  Linkedin,
  ChevronDown,
  CheckCircle2,
  Star,
} from "lucide-react";
import heroMockup from "@/assets/hero-mockup.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WEBARQN — Websites That Grow Your Business" },
      {
        name: "description",
        content:
          "WEBARQN builds modern websites, CRM dashboards, SEO and digital marketing solutions for businesses that want to grow online. Plans from ₹2,999.",
      },
    ],
  }),
  component: LandingPage,
});

/* ---------- Theme toggle ---------- */
function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("theme")) as
      | "light"
      | "dark"
      | null;
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

/* ---------- Nav ---------- */
const NAV = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Industries", href: "#industries" },
  { label: "Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

function Nav() {
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
        scrolled
          ? "backdrop-blur-xl bg-background/70 border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[oklch(0.16_0.04_265)] text-white dark:bg-[oklch(0.62_0.2_264)]">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-lg">WEBARQN</span>
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-md border border-border/60 text-foreground transition hover:bg-accent"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <a
            href="#contact"
            className="hidden rounded-md bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition hover:brightness-110 md:inline-flex"
          >
            Get Quote
          </a>
          <button
            className="grid h-9 w-9 place-items-center rounded-md border border-border/60 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur md:hidden"
          >
            <div className="flex flex-col p-4">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                >
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

/* ---------- Section header ---------- */
function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      {eyebrow && (
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-[#2563EB] backdrop-blur">
          <Sparkles className="h-3 w-3" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut", delay: i * 0.05 },
  }),
};

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24"
    >
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.18),transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(11,18,32,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(11,18,32,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]" />
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="lg:col-span-6"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2563EB]/20 bg-[#2563EB]/5 px-3 py-1 text-xs font-medium text-[#2563EB]">
            <Star className="h-3 w-3 fill-[#2563EB]" />
            Trusted by 200+ growing businesses
          </span>
          <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[3.75rem]">
            We Build Websites That{" "}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#60a5fa] bg-clip-text text-transparent">
              Grow Your Business
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
            Modern Websites, CRM Dashboards, SEO & Digital Marketing Solutions for
            businesses that want to grow online.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-lg bg-[#0B1220] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0B1220]/20 transition hover:brightness-110 dark:bg-white dark:text-[#0B1220]"
            >
              Get Free Quote
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-background/60 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur transition hover:bg-accent"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              WhatsApp Now
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#2563EB]" /> No hidden costs
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#2563EB]" /> Free SSL & Deployment
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#2563EB]" /> Lifetime guidance
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="lg:col-span-6"
        >
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-[#2563EB]/20 via-transparent to-[#2563EB]/10 blur-2xl" />
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-white/70 p-2 shadow-2xl shadow-[#0B1220]/10 backdrop-blur dark:bg-white/5">
              <img
                src={heroMockup}
                alt="WEBARQN dashboard and mobile app preview"
                width={1408}
                height={1008}
                className="w-full rounded-xl"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Feature strip ---------- */
const FEATURES = [
  { icon: Palette, title: "Modern Design", desc: "Clean, premium interfaces built for 2026." },
  { icon: Smartphone, title: "Mobile Friendly", desc: "Pixel-perfect on every screen size." },
  { icon: Search, title: "SEO Optimized", desc: "Built to rank on Google from day one." },
  { icon: Zap, title: "Fast Performance", desc: "Sub-second load times, 95+ Lighthouse." },
  { icon: ShieldCheck, title: "Secure", desc: "HTTPS, hardened auth, best practices." },
  { icon: TrendingUp, title: "Scalable", desc: "Grows with your traffic and team." },
];

function Features() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              custom={i}
              className="group rounded-xl border border-border/60 bg-card p-4 transition hover:-translate-y-1 hover:border-[#2563EB]/40 hover:shadow-lg hover:shadow-[#2563EB]/10"
            >
              <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
                <f.icon className="h-4 w-4" />
              </div>
              <div className="text-sm font-semibold">{f.title}</div>
              <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Services ---------- */
const SERVICES = [
  { icon: Building2, title: "Business Websites", desc: "Conversion-first sites for growing brands." },
  { icon: Briefcase, title: "Corporate Websites", desc: "Enterprise-grade presence, done right." },
  { icon: User, title: "Portfolio Websites", desc: "Showcase your work with impact." },
  { icon: FileText, title: "Landing Pages", desc: "High-converting pages for campaigns." },
  { icon: ShoppingCart, title: "E-Commerce Websites", desc: "Sell online with modern storefronts." },
  { icon: LineChart, title: "CRM Dashboards", desc: "Custom dashboards for your operations." },
  { icon: Users, title: "Lead Management", desc: "Capture, track and convert leads." },
  { icon: Receipt, title: "Quotation Management", desc: "Send branded quotes in one click." },
  { icon: FilePlus2, title: "Invoice PDF Generation", desc: "Automated, GST-ready invoices." },
  { icon: ServerCog, title: "Admin Panels", desc: "Powerful back-office for your team." },
  { icon: BarChart3, title: "SEO Services", desc: "Rank higher, get organic traffic." },
  { icon: Megaphone, title: "Google Ads", desc: "ROI-focused search & display ads." },
  { icon: Facebook, title: "Meta Ads", desc: "Facebook & Instagram campaigns that convert." },
  { icon: Wrench, title: "Website Maintenance", desc: "Updates, backups, monitoring." },
  { icon: GraduationCap, title: "Resume Building", desc: "Portfolio websites for students." },
];

function Services() {
  return (
    <section id="services" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Services"
          title="Everything you need to go online"
          subtitle="From your first landing page to a full CRM, we build the digital stack that scales your business."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              custom={i}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition hover:-translate-y-1 hover:border-[#2563EB]/40 hover:shadow-xl hover:shadow-[#2563EB]/10"
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#2563EB]/5 blur-2xl transition group-hover:bg-[#2563EB]/15" />
              <div className="relative">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#0B1220] to-[#1e293b] text-white shadow-md dark:from-[#2563EB] dark:to-[#60a5fa]">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#2563EB] opacity-0 transition group-hover:opacity-100">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Industries ---------- */
const INDUSTRIES = [
  "Interior Design", "Construction", "Architecture", "Solar", "Wall Arts",
  "Furniture", "Photography", "Education", "Healthcare", "Gym", "Salon",
  "Cleaning", "Painting", "Digital Agency", "Real Estate", "Restaurants",
  "Hotels", "Clinics", "Schools", "Manufacturing", "Retail",
];

function Industries() {
  return (
    <section id="industries" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Industries We Serve"
          title="Built for the businesses that build India"
          subtitle="From studios and clinics to factories and schools, we ship solutions tailored to your industry."
        />
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {INDUSTRIES.map((ind, i) => (
            <motion.span
              key={ind}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.02, duration: 0.35 }}
              whileHover={{ y: -2 }}
              className="rounded-full border border-border/60 bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:border-[#2563EB]/50 hover:bg-[#2563EB]/5 hover:text-[#2563EB]"
            >
              {ind}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Stats ---------- */
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
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

const STATS = [
  { n: 50, label: "Websites Delivered" },
  { n: 20, label: "CRM Dashboards" },
  { n: 100, label: "Student Portfolio Websites" },
  { n: 30, label: "SEO Campaigns" },
  { n: 10, label: "Business Automations" },
];

function Stats() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-[#0B1220] to-[#111a30] p-8 text-white shadow-2xl sm:p-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="bg-gradient-to-r from-white to-[#93c5fd] bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
                  <Counter to={s.n} />
                </div>
                <div className="mt-2 text-xs font-medium uppercase tracking-wider text-white/60 sm:text-sm">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Pricing ---------- */
const PLANS = [
  {
    name: "Basic",
    price: "2,999",
    tag: "Starter website",
    features: [
      "Static Website",
      "Up to 5 Pages",
      "Responsive Design",
      "Contact Form",
      "WhatsApp Integration",
      "Social Media Links",
      "Basic SEO",
      "Free SSL",
      "Free Deployment",
    ],
  },
  {
    name: "Standard",
    price: "5,999",
    tag: "Growing business",
    features: [
      "Everything in Basic",
      "Dynamic Website",
      "Admin Panel",
      "Up to 10 Pages",
      "Blog & Gallery",
      "Lead Collection Forms",
      "Analytics",
      "Easy Content Management",
    ],
  },
  {
    name: "Business",
    price: "8,999",
    tag: "CRM powered",
    features: [
      "Everything in Standard",
      "CRM Dashboard",
      "Lead Management",
      "Customer Database",
      "Quotation Generator",
      "Invoice PDF Generator",
      "Dashboard Reports",
      "Role-Based Login",
      "Advanced Forms",
    ],
  },
  {
    name: "Premium",
    price: "14,999",
    tag: "Full e-commerce",
    popular: true,
    features: [
      "Everything in Business",
      "E-Commerce Website",
      "Payment Gateway Setup",
      "Product Management",
      "Order Management",
      "Inventory Management",
      "Advanced CRM",
      "Customer Portal",
      "Priority Support",
      "Website Maintenance",
    ],
  },
];

function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Pricing"
          title="Transparent plans, premium quality"
          subtitle="Pick the plan that matches your goals. All plans include free SSL, deployment and lifetime guidance."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((p, i) => (
            <motion.div
              key={p.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              custom={i}
              className={`relative flex flex-col rounded-2xl border p-6 shadow-sm transition hover:-translate-y-1 ${
                p.popular
                  ? "border-[#2563EB] bg-gradient-to-b from-[#2563EB]/5 to-transparent shadow-xl shadow-[#2563EB]/20"
                  : "border-border/60 bg-card"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 right-6 rounded-full bg-[#2563EB] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-lg">
                  Most Popular
                </div>
              )}
              <div className="text-sm font-semibold uppercase tracking-wider text-[#2563EB]">
                {p.name}
              </div>
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
              <a
                href="#contact"
                className={`mt-8 inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  p.popular
                    ? "bg-[#2563EB] text-white hover:brightness-110"
                    : "border border-border/70 bg-background text-foreground hover:bg-accent"
                }`}
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Why choose ---------- */
const WHY = [
  { icon: Palette, title: "Modern UI" },
  { icon: Rocket, title: "Fast Delivery" },
  { icon: Search, title: "SEO Ready" },
  { icon: ShieldCheck, title: "Secure Development" },
  { icon: TrendingUp, title: "Scalable Solutions" },
  { icon: IndianRupee, title: "Affordable Pricing" },
  { icon: Smartphone, title: "Mobile Responsive" },
  { icon: Award, title: "Lifetime Technical Guidance" },
];

function WhyChoose() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Why WEBARQN"
          title="A partner that ships, supports and scales"
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {WHY.map((w, i) => (
            <motion.div
              key={w.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              custom={i}
              className="rounded-xl border border-border/60 bg-card p-5 transition hover:-translate-y-1 hover:border-[#2563EB]/40 hover:shadow-md"
            >
              <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
                <w.icon className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold">{w.title}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Process ---------- */
const STEPS = ["Discuss", "Planning", "Design", "Development", "Testing", "Launch", "Support"];

function Process() {
  return (
    <section id="process" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Our Process"
          title="Simple, predictable, on-time"
          subtitle="A proven 7-step process that turns your idea into a live, revenue-ready product."
        />
        <div className="relative">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-[#2563EB]/40 to-transparent md:block" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-7">
            {STEPS.map((s, i) => (
              <motion.div
                key={s}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="flex flex-col items-center text-center"
              >
                <div className="relative grid h-12 w-12 place-items-center rounded-full border border-[#2563EB]/30 bg-background text-sm font-bold text-[#2563EB] shadow-md">
                  {i + 1}
                </div>
                <div className="mt-3 text-sm font-semibold">{s}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
const FAQS = [
  {
    q: "How long does it take to deliver a website?",
    a: "Basic websites go live in 3–5 days. Standard sites take 7–10 days. Business CRM builds ship in 2–3 weeks, and Premium e-commerce projects in 3–4 weeks.",
  },
  {
    q: "Do you provide hosting and domain?",
    a: "Yes. We help you buy the domain, set up free SSL, and deploy on high-performance hosting. Hosting is included free for the first year on most plans.",
  },
  {
    q: "Is SEO included?",
    a: "Every website ships with on-page SEO — meta tags, schema, sitemap, Open Graph, fast performance and accessibility. Full SEO campaigns are available as an add-on.",
  },
  {
    q: "Can you build a custom CRM for my business?",
    a: "Absolutely. We build tailored CRM dashboards with lead management, quotation & invoice generation, role-based logins and reports — designed around your workflow.",
  },
  {
    q: "Do you integrate WhatsApp for leads?",
    a: "Yes. Every plan includes WhatsApp integration so customers can reach you in one click, and leads route directly to your dashboard or inbox.",
  },
  {
    q: "Can I update the website myself later?",
    a: "Yes. Standard and above ship with an easy admin panel so you can update text, images, blogs, gallery and products without touching code.",
  },
  {
    q: "What kind of support do you offer after launch?",
    a: "Every project includes lifetime technical guidance. Premium ships with monthly maintenance, priority support and monitoring included.",
  },
];

function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="FAQ" title="Questions, answered" />
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="mb-3 rounded-xl border border-border/60 bg-card px-4"
            >
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */
const SERVICES_OPTIONS = [
  "Business Website",
  "E-Commerce Website",
  "CRM Dashboard",
  "SEO Services",
  "Google / Meta Ads",
  "Website Maintenance",
  "Other",
];
const BUDGETS = ["₹2,999 – ₹5,999", "₹5,999 – ₹8,999", "₹8,999 – ₹14,999", "₹14,999+"];

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const key = "webarqn_enquiries";
      const prev = JSON.parse(localStorage.getItem(key) ?? "[]");
      prev.push({ ...data, at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(prev));
    } catch {}
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Enquiry received! We'll reach out within 24 hours.");
      form.reset();
    }, 600);
  };
  return (
    <section id="contact" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Contact"
          title="Let's Build Your Business Website"
          subtitle="Tell us about your project. We'll get back within 24 hours with a free quote and roadmap."
        />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-lg sm:p-8">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center py-10 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 12 }}
                      className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-[#2563EB]/10 text-[#2563EB]"
                    >
                      <CheckCircle2 className="h-8 w-8" />
                    </motion.div>
                    <h3 className="text-xl font-bold">Enquiry received</h3>
                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                      Thanks for reaching out. Our team will get in touch within 24 hours with a free quote and next steps.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-6 text-sm font-medium text-[#2563EB] hover:underline"
                    >
                      Send another enquiry
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                  >
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
                      <select
                        id="service"
                        name="service"
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select a service</option>
                        {SERVICES_OPTIONS.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="budget">Budget</Label>
                      <select
                        id="budget"
                        name="budget"
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select a budget</option>
                        {BUDGETS.map((b) => (
                          <option key={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        maxLength={1000}
                        rows={4}
                        placeholder="Tell us about your project, goals and timeline."
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="h-11 w-full bg-[#2563EB] text-white hover:brightness-110"
                      >
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
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-5 transition hover:-translate-y-0.5 hover:border-[#25D366]/40 hover:shadow-md"
            >
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
            <a
              href="tel:+919999999999"
              className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-5 transition hover:-translate-y-0.5 hover:border-[#2563EB]/40 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Call us</div>
                  <div className="text-xs text-muted-foreground">+91 99999 99999</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </a>
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Email</div>
                  <div className="text-xs text-muted-foreground">hello@webarqn.com</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Website</div>
                  <div className="text-xs text-muted-foreground">www.webarqn.com</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Location</div>
                  <div className="text-xs text-muted-foreground">India · Serving worldwide</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="border-t border-border/60 bg-[#0B1220] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2 font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#2563EB]">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-lg">WEBARQN</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-white/60">
            We Build Websites That Grow Your Business.
          </p>
          <div className="mt-5 flex gap-2">
            {[
              { icon: Instagram, href: "https://instagram.com/webarqn", label: "Instagram" },
              { icon: Facebook, href: "https://facebook.com/webarqn", label: "Facebook" },
              { icon: Linkedin, href: "https://linkedin.com/company/webarqn", label: "LinkedIn" },
              { icon: MessageCircle, href: "https://wa.me/919999999999", label: "WhatsApp" },
              { icon: Mail, href: "mailto:hello@webarqn.com", label: "Email" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-white transition hover:bg-[#2563EB] hover:border-[#2563EB]"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold">Quick Links</div>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="hover:text-white">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Services</div>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            <li>Business Websites</li>
            <li>E-Commerce</li>
            <li>CRM Dashboards</li>
            <li>SEO Services</li>
            <li>Google & Meta Ads</li>
            <li>Maintenance</li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Contact</div>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> hello@webarqn.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> +91 99999 99999
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> India · Worldwide
            </li>
            <li>
              <a href="#pricing" className="hover:text-white">
                Pricing
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row sm:px-6 lg:px-8">
          <div>© 2026 WEBARQN. All Rights Reserved.</div>
          <div>Crafted with care in India.</div>
        </div>
      </div>
    </footer>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased [scroll-behavior:smooth]">
      <Nav />
      <main>
        <Hero />
        <Features />
        <Services />
        <Industries />
        <Stats />
        <Pricing />
        <WhyChoose />
        <Process />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}