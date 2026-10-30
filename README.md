# BrandLens — Enterprise Pre-Publication Brand Governance Platform

BrandLens is a brand-governance web application designed for high-velocity marketing and product teams. It inspects collateral before publishing against brand guidelines, approved facts, terminology, visual identity, accessibility, and confidentiality rules.

---

## Core Principles & Constitutional Rules

1. **Explain, Never Reject**: 100% of findings include severity, exact highlighted text span, a plain-language "why", a citation to an explicit guideline or Approved Source ID, and a proposed fix.
2. **Human Authority**: All corrections are proposals. The human author or editor can **Accept**, **Edit**, or **Reject**. BrandLens **never auto-applies anything**.
3. **Evidence-Linked**: Citations link directly to verified Brand Guidelines or Approved Fact Sources (with active dates and `review_after` expiration verification).
4. **Server-Authoritative RBAC**: Separation of powers enforced in application handlers. **Creators are strictly prohibited from self-approving their own submissions.**
5. **Zero Data Egress Guarantee**: Pure deterministic detection engine runs 100% locally and offline without external API keys. Optional Gemini multimodal intelligence is toggle-gated (default OFF).

---

## Detection Engine Architecture (`/lib/engine`)

The detection engine consists of pure functions covering seven comprehensive categories:

1. **Tone**: Formality scoring, maximum sentence length thresholds (e.g. >25 words), consecutive exclamation marks (`!!!`), and banned colloquial slang (`super dope`, `mind-blowing`).
2. **Terminology**: Avoided brand variants (`NW Home` ➔ `Northwind Home`), trademark orthography (`Eco Mode` ➔ `EcoMode`), and prohibited sales claims (`cheap` ➔ `cost-effective`).
3. **Messaging**: Core value proposition presence (`"Intelligent climate control made simple for modern homes."`), call-to-action enforcement, and elimination of unsubstantiated buzzwords.
4. **Claims**: Superlative patterns (`#1`, `best-in-class`, `guaranteed`) and numeric percentages (`saves 45%`, `85,000 customers`) cross-referenced against `ApprovedSource`. Flags expired certifications (e.g. *2023 Thermal Modulation Award expired 2024-01-01*).
5. **Visual**: Perceptual dHash matching against registered approved assets, brand palette hex color validation (`#0B111E`, `#2563EB`, `#0D9488`), and logo clearspace / distortion rules.
6. **Accessibility**: Missing or vague image alt text (`![]()` or `![photo]()`), hierarchical heading skips (e.g. H1 followed directly by H3), and ambiguous link text (`[click here]`).
7. **Confidentiality**: Zero tolerance for secret credentials (`sk_live_...`, `AKIA...`), employee/customer PII (SSN `\d{3}-\d{2}-\d{4}`), internal distribution markers (`[CONFIDENTIAL - INTERNAL ONLY]`), and unreleased project codenames (`Project Boreas`).

---

## Quickstart & Commands

```bash
# Install dependencies
npm install

# Initialize Prisma / SQLite database migrations (optional for standalone CLI)
npx prisma migrate dev --name init

# Seed database with Northwind Home Brand Kit and 8 collateral items
npm run seed

# Run pure engine unit test suite (Node built-in test runner via tsx)
npm test

# Launch local development server (port 3000)
npm run dev
```

---

## 5-Minute Executive Demo Script

### Minute 1: The Governance Dashboard (Real-time Pre-publication Telemetry)
1. Navigate to **Dashboard**.
2. Point out the **Northwind Home** brand indicator and the **Publication Blockers** banner.
3. Review the 8 seeded content items across various channels (`PRESS`, `BLOG`, `INTERNAL`, `LANDING`, `SOCIAL`, `EMAIL`, `SUPPORT`) and formats (`TEXT`, `DOCX`, `PDF`, `IMAGE`, `MARKDOWN`).
4. Note the right-hand **Core BrandLens Principles** and live **Governance Audit Stream**.

### Minute 2: Review Workspace & Deterministic Inspection
1. Open **"Unsubstantiated Market Claims Flyer"**.
2. Observe the **Readiness Score** gauge at 13% (`Publication Blocked`).
3. View the **Marked Inspection Preview** with color-coded tags (`[TERM-AVOID]`, `[CLAIM]`, `[MESSAGING]`).
4. Click on the highlighted `"#1"` or `"best-in-class"` span.
5. Watch the **Approved Evidence Source** slide-out drawer open, revealing source `SRC-2023-THERMAL` marked **EXPIRED / OUTDATED** (expired 2024-01-01) with the substantiated statement text and regulatory risk disclosure.

### Minute 3: Human Authority in Action (Accept, Edit, Reject)
1. In the right rail, locate finding `[CLAIM-SUPERLATIVE]` for `"#1"`.
2. Click **Accept**: watch the text instantly update to `"leading"`, re-analyzing the document and boosting the Readiness Score.
3. On `"NW Home"`, click **Accept** to replace with `"Northwind Home"`.
4. On another finding, click **Edit**, type a custom compliant phrase, and click **Apply Edit**.
5. On an ambiguous finding, click **Reject**, select reason *"Guideline is ambiguous in this marketing context"*, and confirm. Observe that the finding transitions to Decided while feeding the Ambiguity Radar.

### Minute 4: Multi-Stage Approval Queue & RBAC Enforcement
1. Switch user persona (top right) to **Ada Lovelace [CREATOR]**.
2. Click **Inbox**: look at `"Product Feature Release: Smart Scheduling"`.
3. Highlight the disabled button: **`[Self-Approval Prohibited]`**. Note that authors cannot self-approve their own work.
4. Switch user persona to **Marcus Aurelius [REVIEWER]**.
5. Observe that the action buttons now activate: **`Request Changes`** or **`Approve Stage 1`**. Click **Approve Stage 1** and view confirmation toast with confetti.

### Minute 5: Insights & Ambiguity Radar
1. Navigate to **Insights**.
2. Review the **Ambiguity Radar**: notice how rules with high rejection rates trigger the governance diagnostic **`[⚠️ Guideline may be unclear]`**—empowering brand admins to refine ambiguous rules rather than blaming authors.
3. View the **Recurring Findings Distribution** bar chart and **Top 5 Repeated Mistakes**.
4. Click **Export Insights CSV** to download actionable telemetry.
5. Head to **Settings & Trust** to verify the SHA-256 cryptographic hash chaining on the append-only audit trail and confirm that **External Processing** defaults to OFF.
