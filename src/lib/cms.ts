import { supabase } from "@/integrations/supabase/client";

export type HeroSettings = {
  enabled: boolean;
  eyebrow: string;
  heading_prefix: string;
  heading_accent: string;
  subheading: string;
  cta_primary_label: string;
  cta_primary_href: string;
  cta_secondary_label: string;
  cta_secondary_href: string;
  image_url: string;
  badges: string[];
};

export type ContactDetails = {
  heading: string;
  subheading: string;
  company_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  website: string;
  address: string;
  google_maps_embed: string;
  business_hours: string;
};

export type FooterSettings = {
  tagline: string;
  copyright: string;
  note: string;
  privacy_url: string;
  terms_url: string;
  services_list: string[];
};

export type SeoSettings = {
  title: string;
  description: string;
  keywords: string;
  og_image: string;
  favicon: string;
  google_analytics_id: string;
};

export type LogoSettings = { url: string; alt: string };

export type SectionsSettings = {
  features_enabled: boolean;
  services_enabled: boolean;
  industries_enabled: boolean;
  stats_enabled: boolean;
  pricing_enabled: boolean;
  why_enabled: boolean;
  process_enabled: boolean;
  faq_enabled: boolean;
  contact_enabled: boolean;
};

export type Service = { id: string; icon: string; title: string; description: string; sort_order: number; enabled: boolean };
export type Industry = { id: string; name: string; sort_order: number; enabled: boolean };
export type Stat = { id: string; number: number; suffix: string; label: string; sort_order: number; enabled: boolean };
export type PricingPlan = { id: string; name: string; price: string; tag: string; features: string[]; popular: boolean; sort_order: number; enabled: boolean };
export type WhyChoose = { id: string; icon: string; title: string; description: string; sort_order: number; enabled: boolean };
export type ProcessStep = { id: string; title: string; description: string; sort_order: number; enabled: boolean };
export type Faq = { id: string; question: string; answer: string; sort_order: number; enabled: boolean };
export type SocialLink = { id: string; platform: string; url: string; icon: string; sort_order: number; enabled: boolean };
export type MediaItem = { id: string; name: string; url: string; storage_path: string; size: number | null; mime_type: string | null; folder: string | null; created_at: string };

export type CmsData = {
  logo: LogoSettings;
  hero: HeroSettings;
  contact: ContactDetails;
  footer: FooterSettings;
  seo: SeoSettings;
  sections: SectionsSettings;
  services: Service[];
  industries: Industry[];
  stats: Stat[];
  plans: PricingPlan[];
  why: WhyChoose[];
  process: ProcessStep[];
  faqs: Faq[];
  socials: SocialLink[];
};

export async function loadSetting<T>(key: string): Promise<T | null> {
  const { data } = await supabase.from("site_settings").select("value").eq("key", key).maybeSingle();
  return (data?.value ?? null) as T | null;
}

export async function saveSetting(key: string, value: unknown) {
  const { error } = await supabase.from("site_settings").upsert({ key, value: value as never });
  if (error) throw error;
}

export async function loadCms(): Promise<CmsData> {
  const [settingsRes, services, industries, stats, plans, why, process, faqs, socials] = await Promise.all([
    supabase.from("site_settings").select("key,value"),
    supabase.from("services").select("*").eq("enabled", true).order("sort_order"),
    supabase.from("industries").select("*").eq("enabled", true).order("sort_order"),
    supabase.from("stats").select("*").eq("enabled", true).order("sort_order"),
    supabase.from("pricing_plans").select("*").eq("enabled", true).order("sort_order"),
    supabase.from("why_choose").select("*").eq("enabled", true).order("sort_order"),
    supabase.from("process_steps").select("*").eq("enabled", true).order("sort_order"),
    supabase.from("faqs").select("*").eq("enabled", true).order("sort_order"),
    supabase.from("social_links").select("*").eq("enabled", true).order("sort_order"),
  ]);
  const settings: Record<string, unknown> = {};
  for (const row of settingsRes.data ?? []) settings[row.key] = row.value;
  return {
    logo: (settings.logo as LogoSettings) ?? { url: "", alt: "WEBARQN" },
    hero: settings.hero as HeroSettings,
    contact: settings.contact_details as ContactDetails,
    footer: settings.footer as FooterSettings,
    seo: settings.seo as SeoSettings,
    sections: settings.sections as SectionsSettings,
    services: (services.data ?? []) as Service[],
    industries: (industries.data ?? []) as Industry[],
    stats: (stats.data ?? []) as Stat[],
    plans: ((plans.data ?? []) as unknown as PricingPlan[]).map(p => ({ ...p, features: Array.isArray(p.features) ? p.features : [] })),
    why: (why.data ?? []) as WhyChoose[],
    process: (process.data ?? []) as ProcessStep[],
    faqs: (faqs.data ?? []) as Faq[],
    socials: (socials.data ?? []) as SocialLink[],
  };
}

/** Uploads to site-media (private) and returns a long-lived signed URL. */
export async function uploadMedia(file: File, folder = "general"): Promise<MediaItem> {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const up = await supabase.storage.from("site-media").upload(path, file, { contentType: file.type, upsert: false });
  if (up.error) throw up.error;
  const signed = await supabase.storage.from("site-media").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (signed.error || !signed.data?.signedUrl) throw signed.error ?? new Error("Signed URL failed");
  const url = signed.data.signedUrl;
  const ins = await supabase.from("media_library").insert({
    name: file.name, url, storage_path: path, size: file.size, mime_type: file.type, folder,
  }).select().single();
  if (ins.error) throw ins.error;
  return ins.data as unknown as MediaItem;
}

export async function deleteMedia(item: MediaItem) {
  await supabase.storage.from("site-media").remove([item.storage_path]);
  await supabase.from("media_library").delete().eq("id", item.id);
}