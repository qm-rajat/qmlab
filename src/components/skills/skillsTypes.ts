import { 
  Terminal, Globe, Cpu, Database, ShieldCheck, Code,
  Activity, Radio, Info, Layers, Compass, Play, Pause,
  Search, X, Atom, Code2, Server, FileCode, Palette, Zap,
  Gauge, Binary, Network, Bug, TrendingUp, BarChart3,
  ScanSearch, CheckCircle2, CheckSquare, ClipboardCheck,
  Webhook, Wrench, FileSearch, Bot, BrainCircuit,
  SlidersHorizontal, PieChart, LayoutDashboard, Table,
  ShieldAlert, Lock, Eye, Crosshair, TerminalSquare,
  GitBranch, LucideIcon
} from 'lucide-react';
import { SiteSettings } from '../../types';

export interface OrbitConfig {
  categoryName: string;
  radius: number;
  speedMultiplier: number;
  color: string;
  borderColor: string;
  glowColor: string;
  accentHex: string;
  bgGlow: string;
}

export interface FlatSkill {
  name: string;
  category: string;
  proficiency: number;
  orbitRadius: number;
  initialAngle: number;
  speedMultiplier: number;
  color: string;
  glowColor: string;
  accentHex: string;
  icon: LucideIcon;
}

export interface FocusSkill {
  name: string;
  category: string;
  proficiency: number;
  icon: LucideIcon;
}

export interface CategoryDetails {
  icon: LucideIcon;
  bgColor: string;
  barColor: string;
  textColor: string;
  accentColor: string;
  desc: string;
}

export interface SolarSkillsMapProps {
  skills: SiteSettings['skills'];
  skillSearch: string;
  selectedSkillCat: string | null;
  onSelectSkillCat: (cat: string | null) => void;
  getCategoryDetails: (category: string) => CategoryDetails;
}

export const DEFAULT_ORBIT_CONFIGS: OrbitConfig[] = [
  {
    categoryName: "Web Development",
    radius: 65,
    speedMultiplier: 1.2,
    color: "from-indigo-500 to-purple-500",
    borderColor: "border-indigo-500/30",
    glowColor: "rgba(99, 102, 241, 0.4)",
    accentHex: "#6366f1",
    bgGlow: "bg-indigo-500/10"
  },
  {
    categoryName: "Technical SEO & Web Analytics",
    radius: 105,
    speedMultiplier: 0.85,
    color: "from-emerald-500 to-teal-400",
    borderColor: "border-emerald-500/30",
    glowColor: "rgba(16, 185, 129, 0.4)",
    accentHex: "#10b981",
    bgGlow: "bg-emerald-500/10"
  },
  {
    categoryName: "QA Automation & Scripting",
    radius: 145,
    speedMultiplier: 0.6,
    color: "from-rose-500 to-amber-500",
    borderColor: "border-rose-500/30",
    glowColor: "rgba(244, 63, 94, 0.4)",
    accentHex: "#f43f5e",
    bgGlow: "bg-rose-500/10"
  },
  {
    categoryName: "Data Science & BI",
    radius: 185,
    speedMultiplier: -0.45, // Counter-rotational spin
    color: "from-sky-500 to-blue-600",
    borderColor: "border-sky-500/30",
    glowColor: "rgba(14, 165, 233, 0.4)",
    accentHex: "#0ea5e9",
    bgGlow: "bg-sky-500/10"
  },
  {
    categoryName: "Cybersecurity & Infrastructure",
    radius: 225,
    speedMultiplier: 0.3,
    color: "from-amber-500 to-yellow-400",
    borderColor: "border-amber-500/30",
    glowColor: "rgba(245, 158, 11, 0.4)",
    accentHex: "#f59e0b",
    bgGlow: "bg-amber-500/10"
  }
];

// Map skill names to tailored Lucide icons
export const getSkillIcon = (name: string, category?: string): LucideIcon => {
  const norm = name.toLowerCase();
  
  // Web Dev
  if (norm.includes('react') || norm.includes('next')) return Atom;
  if (norm.includes('node')) return Server;
  if (norm.includes('type') || norm.includes('ts')) return FileCode;
  if (norm.includes('tailwind') || norm.includes('css')) return Palette;
  if (norm.includes('express')) return Zap;
  if (norm.includes('wordpress')) return Globe;
  if (norm.includes('php')) return Code2;
  if (norm.includes('sql') && !norm.includes('postgre')) return Database;

  // SEO & Analytics
  if (norm.includes('vital') || norm.includes('speed') || norm.includes('performance')) return Gauge;
  if (norm.includes('schema') || norm.includes('markup')) return Binary;
  if (norm.includes('sitemap') || norm.includes('robot')) return Network;
  if (norm.includes('crawl') || norm.includes('error')) return Bug;
  if (norm.includes('rank') || norm.includes('index')) return TrendingUp;
  if (norm.includes('ga4') || norm.includes('gsc') || norm.includes('google analytics')) return BarChart3;
  if (norm.includes('ahrefs') || norm.includes('semrush')) return Search;
  if (norm.includes('screaming') || norm.includes('frog')) return ScanSearch;

  // QA Automation
  if (norm.includes('selenium')) return Play;
  if (norm.includes('pytest') || norm.includes('test')) return CheckSquare;
  if (norm.includes('functional')) return ClipboardCheck;
  if (norm.includes('api') || norm.includes('endpoint')) return Webhook;
  if (norm.includes('debug') || norm.includes('troubleshoot')) return Wrench;
  if (norm.includes('scrap') || norm.includes('crawler')) return FileSearch;
  if (norm.includes('automat')) return Bot;

  // Data Science & BI
  if (norm.includes('pandas') || norm.includes('numpy') || norm.includes('python')) return Binary;
  if (norm.includes('learn') || norm.includes('scikit') || norm.includes('ai') || norm.includes('ml')) return BrainCircuit;
  if (norm.includes('feature') || norm.includes('engineering')) return SlidersHorizontal;
  if (norm.includes('visual') || norm.includes('chart') || norm.includes('graph')) return PieChart;
  if (norm.includes('power bi') || norm.includes('tableau') || norm.includes('bi')) return LayoutDashboard;
  if (norm.includes('excel') || norm.includes('sheet')) return Table;

  // Cybersecurity & Infra
  if (norm.includes('vulnerab') || norm.includes('audit')) return ShieldAlert;
  if (norm.includes('protocol') || norm.includes('ssl') || norm.includes('tls') || norm.includes('lock')) return Lock;
  if (norm.includes('wireshark') || norm.includes('packet')) return Eye;
  if (norm.includes('nmap') || norm.includes('port') || norm.includes('scan')) return Radio;
  if (norm.includes('burp') || norm.includes('proxy')) return ShieldCheck;
  if (norm.includes('metasploit') || norm.includes('exploit')) return Crosshair;
  if (norm.includes('parrot') || norm.includes('kali') || norm.includes('linux') || norm.includes('terminal')) return TerminalSquare;
  if (norm.includes('devsecops') || norm.includes('git') || norm.includes('ci/cd')) return GitBranch;
  if (norm.includes('infra') || norm.includes('server')) return Server;

  // Category fallback
  if (category) {
    const cNorm = category.toLowerCase();
    if (cNorm.includes('web')) return Code;
    if (cNorm.includes('seo') || cNorm.includes('analytics')) return Globe;
    if (cNorm.includes('qa') || cNorm.includes('scripting')) return Cpu;
    if (cNorm.includes('data') || cNorm.includes('bi')) return Database;
    if (cNorm.includes('cyber') || cNorm.includes('security')) return ShieldCheck;
  }

  return Code;
};
