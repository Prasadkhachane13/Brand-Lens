# AUDIT RUNTIME TEST RESULTS

Execution Timestamp: 2026-10-29T02:13:22-07:00
Target Environment: http://localhost:3000 (Express + Vite + Prisma + SQLite)

| Test Step | Target Endpoint / Action | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **1** | `GET /api/me` (unauthenticated) | HTTP 401 Unauthorized | HTTP 401 | **PASS** |
| **2a** | `POST /api/login` (user: ada) | HTTP 200, role: CREATOR | HTTP 200, role: CREATOR | **PASS** |
| **2b** | `GET /api/me` (as ada) | HTTP 200, role: CREATOR | HTTP 200, role: CREATOR | **PASS** |
| **2c** | `POST /api/login` (user: marcus) | HTTP 200, role: REVIEWER | HTTP 200, role: REVIEWER | **PASS** |
| **2d** | `GET /api/me` (as marcus) | HTTP 200, role: REVIEWER | HTTP 200, role: REVIEWER | **PASS** |
| **2e** | `POST /api/login` (user: priya) | HTTP 200, role: BRAND_ADMIN | HTTP 200, role: BRAND_ADMIN | **PASS** |
| **2f** | `GET /api/me` (as priya) | HTTP 200, role: BRAND_ADMIN | HTTP 200, role: BRAND_ADMIN | **PASS** |
| **2g** | `POST /api/login` (user: sam) | HTTP 200, role: VIEWER | HTTP 200, role: VIEWER | **PASS** |
| **2h** | `GET /api/me` (as sam) | HTTP 200, role: VIEWER | HTTP 200, role: VIEWER | **PASS** |
| **3** | `GET /api/dashboard` | HTTP 200, telemetry & items | HTTP 200, 8 items returned | **PASS** |
| **4** | `GET /api/brand-kit` | HTTP 200, guidelines & sources | HTTP 200, full kit returned | **PASS** |
| **5** | `GET /api/content` | HTTP 200, content list | HTTP 200, 8 items returned | **PASS** |
| **6** | `GET /api/content/item-claims-term` | HTTP 200, active version | HTTP 200, activeVersion found | **PASS** |
| **7** | `GET /api/inbox` | HTTP 200, queued items | HTTP 200, queue items returned | **PASS** |
| **8** | `GET /api/insights` | HTTP 200, Ambiguity Radar | HTTP 200, radar array returned | **PASS** |
| **9** | `GET /api/settings` | HTTP 200, RBAC & disclosure | HTTP 200, disclosure returned | **PASS** |
| **10** | `POST /api/content/item-claims-term/reanalyse` | HTTP 200, contains CLAIM-SUPERLATIVE | HTTP 200, CLAIM-SUPERLATIVE present | **PASS** |
| **11a** | RBAC: ada setting status APPROVED | HTTP 403 (Self-approval blocked) | HTTP 403 Forbidden | **PASS** |
| **11b** | RBAC: marcus approving item with blocker | HTTP 409 (Blocker conflict) | HTTP 409 Conflict | **PASS** |
| **11c** | RBAC: marcus approving clean item | HTTP 200 (Stage approved) | HTTP 200 OK | **PASS** |
| **12** | Workflow: priya publishing approved item | HTTP 200 (PUBLISHED state) | HTTP 200 OK | **PASS** |
| **13a** | Upload: `.txt` file | HTTP 200, format: TEXT | HTTP 200 OK | **PASS** |
| **13b** | Upload: `.md` file | HTTP 200, format: MARKDOWN | HTTP 200 OK | **PASS** |
| **13c** | Upload: `.docx` file | HTTP 200, format: DOCX | HTTP 200 OK | **PASS** |
| **13d** | Upload: `.pdf` file | HTTP 200, format: PDF | HTTP 200 OK | **PASS** |
| **13e** | Upload: `.png` file | HTTP 200, format: IMAGE | HTTP 200 OK | **PASS** |

**Summary**: 24/24 Runtime checks passed (0 failures).
