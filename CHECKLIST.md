# BrandLens Acceptance Criteria & Verification Checklist

| Category | Requirement | Implementation Verification | Status |
| :--- | :--- | :--- | :--- |
| **Detection Engine** | Pure functions in `/lib/engine` | Decoupled pure modules in `src/lib/engine/*.ts` with zero external API dependencies | ✅ Pass |
| **Detection Engine** | Seven detection categories | Tone, Terminology, Messaging, Claims, Visual, Accessibility, Confidentiality | ✅ Pass |
| **Detection Engine** | Outdated source expiration check | Flags expired sources where `review_after` < current date (e.g. `SRC-2023-THERMAL` expired Jan 1, 2024) | ✅ Pass |
| **Detection Engine** | Exact text spans | Precise `{ start, end, text }` indices for highlighting and substitution | ✅ Pass |
| **Human Authority** | Never auto-apply anything | All findings are proposals; human explicitly clicks Accept, Edit, or Reject | ✅ Pass |
| **Human Authority** | Proposed Fix custom editing | Inline editor allows customizing suggested replacement prior to applying | ✅ Pass |
| **Evidence & Citations** | Cited guideline / source drawer | Slide-out panel displays active/expired status, owner, review date, substantiated statement, and brand principle | ✅ Pass |
| **Workflow & RBAC** | Multi-stage statuses | `DRAFT` ➔ `SUBMITTED` ➔ `IN_REVIEW` ➔ `CHANGES_REQUESTED` / `APPROVED` ➔ `PUBLISHED` | ✅ Pass |
| **Workflow & RBAC** | Self-Approval Prohibited | Creators cannot approve their own submissions; UI displays disabled prohibition badge | ✅ Pass |
| **Workflow & RBAC** | Four roles | `CREATOR`, `REVIEWER`, `BRAND_ADMIN`, `VIEWER` with role switcher in navbar | ✅ Pass |
| **Audit & Integrity** | Append-only audit log | Chained with SHA-256 hashes (`previousHash` ➔ `hash`), tamper verification check | ✅ Pass |
| **Collaboration** | Version diff & anchored comments | Side-by-side comparison with anchored comments thread | ✅ Pass |
| **Six Screens** | 1. Dashboard | Pre-publication collateral cards, blocker banner, principles card, live audit stream | ✅ Pass |
| **Six Screens** | 2. Brand Kit | Tabs for Guidelines (10), Terms (12), Approved Sources (8), Assets (6), Tone Profile | ✅ Pass |
| **Six Screens** | 3. Review Workspace | Highlighted spans, readiness ring, accept/edit/reject, drawer trigger | ✅ Pass |
| **Six Screens** | 4. Approval Inbox | Editorial & governance queue with stage actions and persona indicator | ✅ Pass |
| **Six Screens** | 5. Insights | First-pass yield, cycle time, Ambiguity Radar table, recurring mistakes, CSV export | ✅ Pass |
| **Six Screens** | 6. Settings & Trust | AI disclosure, external processing toggle (default OFF), RBAC matrix, audit log viewer | ✅ Pass |
| **Seed Dataset** | Northwind Home brand seed | 8 rich collateral items across TEXT, MARKDOWN, DOCX, PDF, and IMAGE | ✅ Pass |
| **Data Layer** | Prisma / SQLite models & seed | `prisma/schema.prisma` with 13 models and `prisma/seed.ts` runnable script | ✅ Pass |
| **Unit Testing** | Logic tests using `node:test` | `src/lib/engine/engine.test.ts` passing all tests via `npx --yes tsx --test` | ✅ Pass |
