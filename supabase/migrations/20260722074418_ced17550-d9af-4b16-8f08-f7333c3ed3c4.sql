
-- ===== site_settings: JSONB key/value store =====
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "admin write site_settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT NOT NULL DEFAULT 'Sparkles',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT ALL ON public.services TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "admin write services" ON public.services FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.industries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.industries TO anon, authenticated;
GRANT ALL ON public.industries TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.industries TO authenticated;
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read industries" ON public.industries FOR SELECT USING (true);
CREATE POLICY "admin write industries" ON public.industries FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number INT NOT NULL DEFAULT 0,
  suffix TEXT NOT NULL DEFAULT '+',
  label TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.stats TO anon, authenticated;
GRANT ALL ON public.stats TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.stats TO authenticated;
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read stats" ON public.stats FOR SELECT USING (true);
CREATE POLICY "admin write stats" ON public.stats FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  tag TEXT NOT NULL DEFAULT '',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  popular BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pricing_plans TO anon, authenticated;
GRANT ALL ON public.pricing_plans TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.pricing_plans TO authenticated;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read pricing_plans" ON public.pricing_plans FOR SELECT USING (true);
CREATE POLICY "admin write pricing_plans" ON public.pricing_plans FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.why_choose (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT NOT NULL DEFAULT 'Sparkles',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.why_choose TO anon, authenticated;
GRANT ALL ON public.why_choose TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.why_choose TO authenticated;
ALTER TABLE public.why_choose ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read why_choose" ON public.why_choose FOR SELECT USING (true);
CREATE POLICY "admin write why_choose" ON public.why_choose FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.process_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.process_steps TO anon, authenticated;
GRANT ALL ON public.process_steps TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.process_steps TO authenticated;
ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read process_steps" ON public.process_steps FOR SELECT USING (true);
CREATE POLICY "admin write process_steps" ON public.process_steps FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon, authenticated;
GRANT ALL ON public.faqs TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "admin write faqs" ON public.faqs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Globe',
  sort_order INT NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.social_links TO anon, authenticated;
GRANT ALL ON public.social_links TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.social_links TO authenticated;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read social_links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "admin write social_links" ON public.social_links FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  size BIGINT,
  mime_type TEXT,
  folder TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media_library TO anon, authenticated;
GRANT ALL ON public.media_library TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.media_library TO authenticated;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read media_library" ON public.media_library FOR SELECT USING (true);
CREATE POLICY "admin write media_library" ON public.media_library FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER site_settings_set_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER services_set_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER pricing_plans_set_updated_at BEFORE UPDATE ON public.pricing_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- storage.objects policies for site-media bucket
CREATE POLICY "public read site-media" ON storage.objects FOR SELECT
  USING (bucket_id = 'site-media');
CREATE POLICY "admin upload site-media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update site-media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete site-media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));

-- ===== seed defaults =====
INSERT INTO public.site_settings (key, value) VALUES
('logo', '{"url": "", "alt": "WEBARQN"}'),
('hero', '{"enabled": true, "eyebrow": "Trusted by 200+ growing businesses", "heading_prefix": "We Build Websites That", "heading_accent": "Grow Your Business", "subheading": "Modern Websites, CRM Dashboards, SEO & Digital Marketing Solutions for businesses that want to grow online.", "cta_primary_label": "Get Free Quote", "cta_primary_href": "#contact", "cta_secondary_label": "WhatsApp Now", "cta_secondary_href": "https://wa.me/919999999999", "image_url": "", "badges": ["No hidden costs", "Free SSL & Deployment", "Lifetime guidance"]}'),
('contact_details', '{"heading": "Let''s Build Your Business Website", "subheading": "Tell us about your project. We''ll get back within 24 hours with a free quote and roadmap.", "company_name": "WEBARQN", "email": "hello@webarqn.com", "phone": "+91 99999 99999", "whatsapp": "https://wa.me/919999999999", "website": "www.webarqn.com", "address": "India · Serving worldwide", "google_maps_embed": "", "business_hours": "Mon-Sat, 10:00 AM - 7:00 PM IST"}'),
('footer', '{"tagline": "We Build Websites That Grow Your Business.", "copyright": "© 2026 WEBARQN. All Rights Reserved.", "note": "Crafted with care in India.", "privacy_url": "", "terms_url": "", "services_list": ["Business Websites", "E-Commerce", "CRM Dashboards", "SEO Services", "Google & Meta Ads", "Maintenance"]}'),
('seo', '{"title": "WEBARQN — Websites That Grow Your Business", "description": "WEBARQN builds modern websites, CRM dashboards, SEO and digital marketing solutions for businesses that want to grow online. Plans from ₹2,999.", "keywords": "web development, CRM, SEO, digital marketing, ecommerce, India", "og_image": "", "favicon": "", "google_analytics_id": ""}'),
('sections', '{"features_enabled": true, "services_enabled": true, "industries_enabled": true, "stats_enabled": true, "pricing_enabled": true, "why_enabled": true, "process_enabled": true, "faq_enabled": true, "contact_enabled": true}');

INSERT INTO public.services (icon, title, description, sort_order) VALUES
('Building2', 'Business Websites', 'Conversion-first sites for growing brands.', 1),
('Briefcase', 'Corporate Websites', 'Enterprise-grade presence, done right.', 2),
('User', 'Portfolio Websites', 'Showcase your work with impact.', 3),
('FileText', 'Landing Pages', 'High-converting pages for campaigns.', 4),
('ShoppingCart', 'E-Commerce Websites', 'Sell online with modern storefronts.', 5),
('LineChart', 'CRM Dashboards', 'Custom dashboards for your operations.', 6),
('Users', 'Lead Management', 'Capture, track and convert leads.', 7),
('Receipt', 'Quotation Management', 'Send branded quotes in one click.', 8),
('FilePlus2', 'Invoice PDF Generation', 'Automated, GST-ready invoices.', 9),
('ServerCog', 'Admin Panels', 'Powerful back-office for your team.', 10),
('BarChart3', 'SEO Services', 'Rank higher, get organic traffic.', 11),
('Megaphone', 'Google Ads', 'ROI-focused search & display ads.', 12),
('Facebook', 'Meta Ads', 'Facebook & Instagram campaigns that convert.', 13),
('Wrench', 'Website Maintenance', 'Updates, backups, monitoring.', 14),
('GraduationCap', 'Resume Building', 'Portfolio websites for students.', 15);

INSERT INTO public.industries (name, sort_order) VALUES
('Interior Design', 1), ('Construction', 2), ('Architecture', 3), ('Solar', 4), ('Wall Arts', 5),
('Furniture', 6), ('Photography', 7), ('Education', 8), ('Healthcare', 9), ('Gym', 10),
('Salon', 11), ('Cleaning', 12), ('Painting', 13), ('Digital Agency', 14), ('Real Estate', 15),
('Restaurants', 16), ('Hotels', 17), ('Clinics', 18), ('Schools', 19), ('Manufacturing', 20), ('Retail', 21);

INSERT INTO public.stats (number, suffix, label, sort_order) VALUES
(50, '+', 'Websites Delivered', 1),
(20, '+', 'CRM Dashboards', 2),
(100, '+', 'Student Portfolio Websites', 3),
(30, '+', 'SEO Campaigns', 4),
(10, '+', 'Business Automations', 5);

INSERT INTO public.pricing_plans (name, price, tag, popular, features, sort_order) VALUES
('Basic', '2,999', 'Starter website', false,
 '["Static Website","Up to 5 Pages","Responsive Design","Contact Form","WhatsApp Integration","Social Media Links","Basic SEO","Free SSL","Free Deployment"]'::jsonb, 1),
('Standard', '5,999', 'Growing business', false,
 '["Everything in Basic","Dynamic Website","Admin Panel","Up to 10 Pages","Blog & Gallery","Lead Collection Forms","Analytics","Easy Content Management"]'::jsonb, 2),
('Business', '8,999', 'CRM powered', false,
 '["Everything in Standard","CRM Dashboard","Lead Management","Customer Database","Quotation Generator","Invoice PDF Generator","Dashboard Reports","Role-Based Login","Advanced Forms"]'::jsonb, 3),
('Premium', '14,999', 'Full e-commerce', true,
 '["Everything in Business","E-Commerce Website","Payment Gateway Setup","Product Management","Order Management","Inventory Management","Advanced CRM","Customer Portal","Priority Support","Website Maintenance"]'::jsonb, 4);

INSERT INTO public.why_choose (icon, title, sort_order) VALUES
('Palette', 'Modern UI', 1),
('Rocket', 'Fast Delivery', 2),
('Search', 'SEO Ready', 3),
('ShieldCheck', 'Secure Development', 4),
('TrendingUp', 'Scalable Solutions', 5),
('IndianRupee', 'Affordable Pricing', 6),
('Smartphone', 'Mobile Responsive', 7),
('Award', 'Lifetime Technical Guidance', 8);

INSERT INTO public.process_steps (title, sort_order) VALUES
('Discuss', 1), ('Planning', 2), ('Design', 3), ('Development', 4),
('Testing', 5), ('Launch', 6), ('Support', 7);

INSERT INTO public.faqs (question, answer, sort_order) VALUES
('How long does it take to deliver a website?', 'Basic websites go live in 3–5 days. Standard sites take 7–10 days. Business CRM builds ship in 2–3 weeks, and Premium e-commerce projects in 3–4 weeks.', 1),
('Do you provide hosting and domain?', 'Yes. We help you buy the domain, set up free SSL, and deploy on high-performance hosting. Hosting is included free for the first year on most plans.', 2),
('Is SEO included?', 'Every website ships with on-page SEO — meta tags, schema, sitemap, Open Graph, fast performance and accessibility. Full SEO campaigns are available as an add-on.', 3),
('Can you build a custom CRM for my business?', 'Absolutely. We build tailored CRM dashboards with lead management, quotation & invoice generation, role-based logins and reports — designed around your workflow.', 4),
('Do you integrate WhatsApp for leads?', 'Yes. Every plan includes WhatsApp integration so customers can reach you in one click, and leads route directly to your dashboard or inbox.', 5),
('Can I update the website myself later?', 'Yes. Standard and above ship with an easy admin panel so you can update text, images, blogs, gallery and products without touching code.', 6),
('What kind of support do you offer after launch?', 'Every project includes lifetime technical guidance. Premium ships with monthly maintenance, priority support and monitoring included.', 7);

INSERT INTO public.social_links (platform, url, icon, sort_order) VALUES
('Instagram', 'https://instagram.com/webarqn', 'Instagram', 1),
('Facebook', 'https://facebook.com/webarqn', 'Facebook', 2),
('LinkedIn', 'https://linkedin.com/company/webarqn', 'Linkedin', 3),
('WhatsApp', 'https://wa.me/919999999999', 'MessageCircle', 4),
('Email', 'mailto:hello@webarqn.com', 'Mail', 5);
