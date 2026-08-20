export interface VitalsScores {
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
}

export interface VitalsMetrics {
  lcp: string;
  inp: string;
  cls: string;
  fcp: string;
  ttfb: string;
}

export interface SitemapPageItem {
  url: string;
  priority: string;
  changefreq: string;
}

export interface AiSeoReport {
  success?: boolean;
  titles?: Array<{ text: string; reason: string }>;
  descriptions?: Array<{ text: string; reason: string }>;
  h1?: string;
  schema?: string;
  contentBrief?: {
    wordCountRecommendation?: string;
    nlpKeywords?: string[];
    outline?: string[];
    questions?: string[];
  };
}

export function getUrlDetails(urlStr: string) {
  let cleanUrl = urlStr || "https://qmlab-indol.vercel.app";
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = "https://" + cleanUrl;
  }
  try {
    const parsed = new URL(cleanUrl);
    const host = parsed.hostname;
    const origin = parsed.origin;
    const domainParts = host.replace(/^www\./i, "").split(".");
    const rawName = domainParts[0] || "QM Labs";
    const cleanName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    return { host, origin, cleanName };
  } catch (e) {
    return { host: "qmlab-indol.vercel.app", origin: "https://qmlab-indol.vercel.app", cleanName: "QM Labs" };
  }
}
