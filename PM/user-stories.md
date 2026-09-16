# Product User Stories & Agile Backlog

**Document Version:** v2.1.0  
**Framework:** Scrum / Agile Kanban  
**Story Point Scale:** Fibonacci (1, 2, 3, 5, 8, 13)  
**Priority Model:** MoSCoW (Must have, Should have, Could have, Won't have now)  

---

## 1. Epic Overview

- **EPIC-1: Public Engagement & Interactive Case Studies** (Discoverability, rich case studies, interactive UI)
- **EPIC-2: Unified Admin CRM & Headless CMS** (Authenticated management, settings, content authoring)
- **EPIC-3: Model Context Protocol (MCP) AI Interoperability** (Agent integration, JSON-RPC 2.0 tools, simulator)
- **EPIC-4: Dynamic Resume & Credential Verification** (Interactive resume, skills taxonomy, certificate verification)
- **EPIC-5: Lead Capture, Inbound Telemetry & Notifications** (Spam-protected contact portal, email notifications, analytics)

---

## 2. Detailed User Stories

### EPIC-1: Public Engagement & Interactive Case Studies

#### US-1.1: Multi-Category Case Study Exploration
- **As a** Hiring Manager or Enterprise Client,
- **I want to** filter and explore case studies by technology domain (*Product Management, AI Systems, Automation, Cybersecurity*),
- **So that** I can rapidly assess Rajat's relevant domain expertise.
- **Priority:** Must Have (P0) | **Points:** 3
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Given I am on the Projects view
  When I click the "Product Management" category filter
  Then only projects tagged with "product-management" or "both" should be displayed
  And the active filter pill should have high-contrast visual styling
  And the URL hash or query should update without page refresh
  ```

#### US-1.2: Deep Architecture & Business Metric Inspection
- **As a** VP of Engineering / CTO,
- **I want to** inspect problem statements, technical architecture highlights, live URLs, and quantitative metrics for each project,
- **So that** I can verify the real-world impact and technical depth of the work.
- **Priority:** Must Have (P0) | **Points:** 5
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Given I open a project detail modal or expanded card
  When the project renders
  Then I should see a highlighted Key Metric box (e.g., "99.4% Pipeline Efficiency")
  And I should see bulleted Architecture Highlights and Tech Stack badges
  And clicking "Live System" or "GitHub Repo" should safely open the external URL in a new tab with no-opener/no-referrer
  ```

---

### EPIC-2: Unified Admin CRM & Headless CMS

#### US-2.1: Secure Admin Authentication
- **As the** Portfolio Owner (Rajat),
- **I want to** log in with a master password protected by rate-limiting and hashed sessions,
- **So that** unauthorized actors cannot tamper with portfolio data or settings.
- **Priority:** Must Have (P0) | **Points:** 5
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Given an unauthenticated session on the `/admin` view
  When I input the correct admin passphrase
  Then a secure session cookie or token should be set
  And I should be redirected to the Admin Dashboard Tab
  When 5 invalid attempts occur within 1 minute
  Then subsequent attempts should return HTTP 429 Too Many Requests
  ```

#### US-2.2: Instant Case Study & Blog Authoring
- **As the** Admin,
- **I want to** draft, format, preview, and publish projects and blog articles with markdown support,
- **So that** I can update my portfolio in real time without triggering a redeployment.
- **Priority:** Must Have (P0) | **Points:** 5
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Given I am on the Admin Projects Tab
  When I fill in the project title, description, architecture highlights, and toggle "Publish",
  Then saving should immediately update the database via PUT /api/admin/projects
  And the changes should reflect on the public frontend instantly on next view
  ```

#### US-2.3: Dynamic Homepage Tagline & Typewriter Control
- **As the** Admin,
- **I want to** configure comma-separated roles in the Admin Settings "Display Tagline" field (`#set-tagline`),
- **So that** the homepage animated typewriter dynamically rotates through my selected professional personas (e.g. Technical Product Manager, Full-Stack Developer, Technical SEO, IT Support).
- **Priority:** Should Have (P1) | **Points:** 3
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Given I am in Admin Settings > General Settings
  When I enter a comma-separated list of roles in "Display Tagline" (e.g., "Technical Product Manager, Full-Stack Developer, Technical SEO, IT Support")
  And I save the settings
  Then the homepage typewriter component parses the roles
  And dynamically rotates through each title with smooth type/delete transitions
  ```

---

### EPIC-3: Model Context Protocol (MCP) AI Interoperability

#### US-3.1: OpenAI & Claude Agent Tool Calling
- **As an** AI Assistant (e.g. Claude Desktop or ChatGPT),
- **I want to** call the `/api/mcp` endpoint using JSON-RPC 2.0 protocol methods (`initialize`, `tools/list`, `tools/call`),
- **So that** I can query portfolio metrics, summarize case studies, or update records autonomously.
- **Priority:** Must Have (P0) | **Points:** 8
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Given an HTTP POST request to `/api/mcp` with method `tools/list`
  When the server processes the request
  Then it must return a valid JSON-RPC 2.0 response with an array of at least 18 registered tools
  And each tool must have a descriptive `name`, `description`, and `inputSchema`
  ```

#### US-3.2: In-Browser Live MCP Protocol Simulator
- **As the** Admin,
- **I want to** execute tool calls, format JSON arguments, and inspect live response payloads in the Admin AI Hub,
- **So that** I can verify agent tool integrity without external debugging tools.
- **Priority:** Should Have (P1) | **Points:** 5
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Given I am in the Admin AI Tab
  When I select the `get_portfolio_overview` tool and click "Send JSON-RPC Payload"
  Then the console should show HTTP status, execution latency (in ms), and pretty-printed JSON response
  ```

---

### EPIC-4: Dynamic Resume & Credential Verification

#### US-4.1: Interactive Resume Tailoring & PDF Export
- **As a** Recruiter or Hiring Manager,
- **I want to** select professional personas (defaulting to Technical Product Manager), view work experience, MBA/B.Tech education, and download a tailored print-ready PDF resume,
- **So that** I can share Rajat's profile with executive hiring committees.
- **Priority:** Must Have (P0) | **Points:** 3
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Given I am on the Resume view
  Then the active persona should default to "Product Manager (TPM)"
  When I switch between available personas (e.g. Full-Stack, Technical SEO, QA, Cybersecurity)
  Then the summary, core competencies, and emphasized highlights should dynamically adjust
  When I click "Print / Save PDF"
  Then the browser print dialog opens with A4 page sizing
  And all navigation bars, footers, control buttons, and banners are hidden via `.no-print`
  And contact hyperlinks are converted to clean, printable profile URLs
  ```

#### US-4.2: Verified Credential Badge Inspection
- **As an** Evaluator,
- **I want to** see verified certification badges with issuing organizations (AWS, DeepLearning.AI, Coursera) and credential verification URLs,
- **So that** I can instantly confirm authenticity.
- **Priority:** Should Have (P1) | **Points:** 2
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Given I am viewing the Credentials grid
  When I click "Verify Credential" on an AWS certification
  Then I should be navigated to the official verification authority URL in a secure new tab
  ```

---

### EPIC-5: Lead Capture, Inbound Telemetry & Notifications

#### US-5.1: Spam-Protected Contact & Lead Management
- **As a** Potential Client or Recruiter,
- **I want to** submit an inquiry with name, email, project type, and message,
- **So that** I can start a discussion on technical product leadership or consulting.
- **Priority:** Must Have (P0) | **Points:** 3
- **Acceptance Criteria (Gherkin):**
  ```gherkin
  Given I submit the contact form with valid details
  When the submission completes
  Then I should see an elegant confirmation message
  And the message should be recorded in the Admin CRM with status "unread"
  And an automated SMTP notification should be dispatched to the admin
  ```
