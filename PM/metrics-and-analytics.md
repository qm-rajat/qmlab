# Product Metrics, Telemetry & Analytics Framework

**Document Version:** v2.0.0  
**Framework:** Google HEART + Pirate Funnel (AARRR)  
**Tracking Engine:** Server-Side Telemetry Service (`server/services/telemetry.service.ts`)  

---

## 1. Google HEART Framework Mapping

| HEART Dimension | Goal | Metric | Target SLA |
| :--- | :--- | :--- | :--- |
| **Happiness** | User satisfaction & visual delight | Direct feedback, clean UI ratings, zero error states | > 95% positive feedback |
| **Engagement** | Deep exploration of case studies and articles | Avg. session duration, case study expansion rate, article read-through % | > 2.5 min avg session, > 40% read-through |
| **Adoption** | New visitors connecting or utilizing MCP | 1st-time contact inquiries, MCP server connections (Claude/Cursor) | > 25 new inquiries/mo, > 100 MCP clients |
| **Retention** | Return visits from recruiters, clients & agents | Weekly active agents, returning visitor ratio | > 30% 30-day returning rate |
| **Task Success** | Frictionless resume download, contact, and tool calls | Form completion rate, PDF generation success, JSON-RPC success rate | > 99.8% MCP call success, < 2% form bounce |

---

## 2. Inbound Conversion Funnel

```
               [100%] Total Unique Visitors
                         │
                         ▼
        [65%] Projects / Case Studies Viewed
                         │
                         ▼
       [35%] Interactive Resume Inspected
                         │
                         ▼
      [18%] Resume Downloaded / Filter Applied
                         │
                         ▼
     [8%] Inbound Contact Form Submitted / MCP Invocation
```

---

## 3. Telemetry Event Taxonomy

| Event Name | Trigger Context | Payload Parameters |
| :--- | :--- | :--- |
| `page_view` | Initial page load or SPA navigation | `path`, `referrer`, `viewport_width`, `timestamp` |
| `project_view` | Project modal opened or clicked | `project_id`, `project_slug`, `category`, `has_live_url` |
| `resume_download`| Resume PDF export or download initiated | `format`, `tailored_role`, `source_section` |
| `mcp_tool_call` | External AI agent executes JSON-RPC tool | `tool_name`, `method`, `latency_ms`, `status_code`, `client_name` |
| `contact_submit`| Contact form submission sent | `inquiry_type`, `has_notes`, `ip_hash` |
| `blog_like` | User clicks like on a technical article | `blog_id`, `blog_slug`, `total_likes` |

---

## 4. Experimentation & Growth Backlog

1. **Test EXP-01: One-Click "Ask AI About Rajat" Floating Bar**
   - *Hypothesis:* Adding an interactive AI assistant trigger on the landing page will increase case study deep-dives by 35%.
2. **Test EXP-02: Instant Calendar Scheduling vs. Static Form**
   - *Hypothesis:* Offering a direct 15-minute introductory meeting picker will increase lead conversion by 50%.
3. **Test EXP-03: ATS-Optimized Dynamic Resume Keyword Highlighter**
   - *Hypothesis:* Allowing recruiters to paste a job title to highlight relevant skills will increase resume download rates by 25%.
