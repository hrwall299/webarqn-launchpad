import {
  Sparkles, Building2, Briefcase, User, FileText, ShoppingCart, LineChart, Users,
  Receipt, FilePlus2, ServerCog, BarChart3, Megaphone, Facebook, Wrench, GraduationCap,
  Palette, Rocket, Search, ShieldCheck, TrendingUp, IndianRupee, Smartphone, Award,
  Instagram, Linkedin, MessageCircle, Mail, Phone, MapPin, Globe, Zap, Star, Check,
  CheckCircle2, Sun, Moon, Menu, X, ArrowRight, Clock, LayoutGrid, Heart, Camera,
  Home, Settings, Layers, Package, Cpu, Cloud, Database, Lock, Gift, Truck,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles, Building2, Briefcase, User, FileText, ShoppingCart, LineChart, Users,
  Receipt, FilePlus2, ServerCog, BarChart3, Megaphone, Facebook, Wrench, GraduationCap,
  Palette, Rocket, Search, ShieldCheck, TrendingUp, IndianRupee, Smartphone, Award,
  Instagram, Linkedin, MessageCircle, Mail, Phone, MapPin, Globe, Zap, Star, Check,
  CheckCircle2, Sun, Moon, Menu, X, ArrowRight, Clock, LayoutGrid, Heart, Camera,
  Home, Settings, Layers, Package, Cpu, Cloud, Database, Lock, Gift, Truck,
};

export const ICON_NAMES = Object.keys(ICON_MAP).sort();

export function getIcon(name: string | null | undefined): LucideIcon {
  if (name && ICON_MAP[name]) return ICON_MAP[name];
  return Sparkles;
}