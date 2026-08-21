import { Router } from "express";
import { getGeminiClient } from "../services/ai.service.ts";

const router = Router();
const SITE_URL = process.env.SITE_URL || "https://qmlab-indol.vercel.app";

router.post("/analyze", async (req, res) => {
  const { url, keyword, audience, existingTitle, existingDescription } = req.body;

  const cleanUrl = url || SITE_URL;
  const cleanKeyword = keyword || "Full-Stack Development";
  const cleanAudience = audience || "Tech Recruiters & CTOs";

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `Analyze the following website context for Advanced Technical SEO Optimization:
URL: ${cleanUrl}
Primary Topic / Keyword: ${cleanKeyword}
Target Audience: ${cleanAudience}
Existing Title: ${existingTitle || "None"}
Existing Description: ${existingDescription || "None"}

Please generate:
1. Three high-click-through-rate (CTR) optimized Title tag suggestions under 60 characters, with brief explanations of why they work.
2. Two highly optimized Meta Description suggestions between 120-160 characters.
3. An optimized H1 header tag.
4. An NLP content brief including:
   - Word count recommendation.
   - Recommended H2/H3 outline headings.
   - Top 10 high-value semantic/NLP keywords to include.
   - 3 "People Also Ask" conversational questions for search engine feature rich snippets.
5. A custom JSON-LD schema block (valid Schema.org JSON) tailored to this content/business.

You MUST respond with a single, valid JSON object matching this exact TypeScript structure:
{
  "titles": [{"text": "Title string", "reason": "Explanation string"}],
  "descriptions": [{"text": "Description string", "reason": "Explanation string"}],
  "h1": "H1 tag string",
  "contentBrief": {
    "wordCountRecommendation": "e.g. 1500-2000 words",
    "outline": ["heading 1", "heading 2"],
    "nlpKeywords": ["keyword1", "keyword2"],
    "questions": ["q1", "q2"]
  },
  "schema": "formatted JSON-LD string"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are a professional enterprise Technical SEO Expert. You analyze meta structures, suggest crawl configurations, and return valid, optimized structures in strict JSON format.",
        },
      });

      const responseText = response.text || "{}";
      const data = JSON.parse(responseText.trim());

      return res.json({
        success: true,
        aiPowered: true,
        ...data,
      });
    } catch (apiError: any) {
      console.error("Gemini Technical SEO API Error:", apiError);
      // Fallback to high-quality procedural response on actual API error
    }
  }

  // Fallback Heuristics when Gemini API is unconfigured or fails
  return res.json({
    success: true,
    aiPowered: false,
    message: "Configure GEMINI_API_KEY in Settings > Secrets to unlock live AI analysis!",
    titles: [
      {
        text: `How to Dominate ${cleanKeyword}: Ultimate Guide for ${cleanAudience}`,
        reason: "Authoritative, benefit-driven title directly targeting your specific audience with strong CTR action verbs.",
      },
      {
        text: `Technical Blueprint: Maximizing Impact in ${cleanKeyword}`,
        reason: "Focuses on authority and architectural excellence, ideal for engineers, managers, and recruiters.",
      },
      {
        text: `Why ${cleanKeyword} is Your Core Web Vitals Key`,
        reason: "Bridges the primary topic with page performance criteria to grab search interest.",
      },
    ],
    descriptions: [
      {
        text: `Ready to master ${cleanKeyword}? Check out our complete expert breakdown. Learn about Core Web Vitals optimization, schema tags, and how to reach 100% scores.`,
        reason: "Includes secondary high-relevance terms like 'Core Web Vitals', 'optimization', and 'expert' to enhance organic search relevance.",
      },
      {
        text: `Discover technical SEO secrets of ${cleanKeyword} designed for ${cleanAudience}. Elevate your speed indexes and crawler mapping now.`,
        reason: "Creates a direct and compelling appeal to the target audience with a high-impact search CTA.",
      },
    ],
    h1: `The High-Performance Blueprint for ${cleanKeyword}`,
    contentBrief: {
      wordCountRecommendation: "1,750 - 2,100 words",
      outline: [
        `1. Introduction to ${cleanKeyword} and modern SEO indices`,
        `2. Addressing server response latency & optimization (TTFB)`,
        `3. Mastering milestone renders: First Contentful Paint & LCP`,
        `4. Minimizing visual layout shifts (CLS) on responsive screens`,
        `5. Semantic keywords & structured entities checklist`,
      ],
      nlpKeywords: [
        "Core Web Vitals",
        "Largest Contentful Paint",
        "Cumulative Layout Shift",
        "Time to First Byte",
        "Semantic schema",
        "Search indexing",
        "Robots directives",
        "Viewport responsiveness",
        "Lighthouse scores",
        "PageSpeed insights",
      ],
      questions: [
        `How does ${cleanKeyword} directly impact organic query rankings?`,
        "What are the best server frameworks to optimize LCP response timing?",
        "How can we configure Robots.txt to control aggressive AI scrapers?",
      ],
    },
    schema: `{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "The High-Performance Blueprint for ${cleanKeyword}",
  "description": "A comprehensive technical SEO guide to optimizing web architectures for modern indexing spiders and Core Web Vitals.",
  "url": "${cleanUrl}",
  "about": {
    "@type": "Thing",
    "name": "${cleanKeyword}"
  },
  "author": {
    "@type": "Person",
    "name": "Rajat Kumar Dash"
  }
}`,
  });
});

export default router;
