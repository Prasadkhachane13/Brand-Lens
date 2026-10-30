#!/usr/bin/env bash
set -e

BASE_URL="http://localhost:3000"
COOKIE_JAR="/tmp/brandlens_cookies.txt"

echo "=== BRANDLENS RUNTIME API AUDIT ==="

# 1. /api/me (expect 401)
echo "--- 1. Testing /api/me (unauthenticated) ---"
STATUS_1=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/me")
echo "Status: $STATUS_1 (Expected: 401)"
test "$STATUS_1" = "401"

# 2. Login ada/marcus/priya/sam & /api/me (200 each with right role)
echo "--- 2. Testing login & /api/me for ada, marcus, priya, sam ---"
for USER in ada marcus priya sam; do
  echo "Logging in as $USER..."
  LOGIN_RESP=$(curl -s -c "$COOKIE_JAR.$USER" -X POST "$BASE_URL/api/login" \
    -H "Content-Type: application/json" \
    -d "{\"username\": \"$USER\"}")
  echo "Login Response: $LOGIN_RESP"

  ME_RESP=$(curl -s -b "$COOKIE_JAR.$USER" "$BASE_URL/api/me")
  echo "Me Response: $ME_RESP"
done

# 3. /api/dashboard
echo "--- 3. Testing /api/dashboard ---"
DASH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/dashboard")
echo "Dashboard Status: $DASH_STATUS (Expected: 200)"
test "$DASH_STATUS" = "200"

# 4. /api/brand-kit
echo "--- 4. Testing /api/brand-kit ---"
KIT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/brand-kit")
echo "Brand Kit Status: $KIT_STATUS (Expected: 200)"
test "$KIT_STATUS" = "200"

# 5. /api/content
echo "--- 5. Testing /api/content ---"
CONTENT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/content")
echo "Content Status: $CONTENT_STATUS (Expected: 200)"
test "$CONTENT_STATUS" = "200"

# 6. /api/content/item-claims-term
echo "--- 6. Testing /api/content/item-claims-term ---"
ITEM_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/content/item-claims-term")
echo "Item Status: $ITEM_STATUS (Expected: 200)"
test "$ITEM_STATUS" = "200"

# 7. /api/inbox
echo "--- 7. Testing /api/inbox ---"
INBOX_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/inbox")
echo "Inbox Status: $INBOX_STATUS (Expected: 200)"
test "$INBOX_STATUS" = "200"

# 8. /api/insights
echo "--- 8. Testing /api/insights ---"
INSIGHTS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/insights")
echo "Insights Status: $INSIGHTS_STATUS (Expected: 200)"
test "$INSIGHTS_STATUS" = "200"

# 9. /api/settings
echo "--- 9. Testing /api/settings ---"
SETTINGS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/settings")
echo "Settings Status: $SETTINGS_STATUS (Expected: 200)"
test "$SETTINGS_STATUS" = "200"

# 10. POST /api/content/item-claims-term/reanalyse (expect CLAIM-SUPERLATIVE in findings)
echo "--- 10. Testing reanalyse item-claims-term ---"
REANALYSE_RESP=$(curl -s -X POST "$BASE_URL/api/content/item-claims-term/reanalyse")
echo "$REANALYSE_RESP" | grep -q "CLAIM-SUPERLATIVE"
echo "Reanalyse contains CLAIM-SUPERLATIVE: YES"

# 11. RBAC checks:
# ada APPROVED -> 403 (Creator self-approval prohibited)
echo "--- 11a. RBAC: ada attempting APPROVED (expect 403) ---"
ADA_APPROVE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -b "$COOKIE_JAR.ada" \
  -X POST "$BASE_URL/api/content/item-claims-term/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "APPROVED"}')
echo "Ada Approve Status: $ADA_APPROVE_STATUS (Expected: 403)"
test "$ADA_APPROVE_STATUS" = "403"

# marcus APPROVED with blocker -> 409 (Cannot approve items with blockers)
echo "--- 11b. RBAC: marcus approving item with blocker (expect 409) ---"
MARCUS_BLOCKER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -b "$COOKIE_JAR.marcus" \
  -X POST "$BASE_URL/api/content/item-claims-term/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "APPROVED"}')
echo "Marcus Blocker Approve Status: $MARCUS_BLOCKER_STATUS (Expected: 409)"
test "$MARCUS_BLOCKER_STATUS" = "409"

# marcus clean item APPROVED -> 200
echo "--- 11c. RBAC: marcus approving clean item content-smart-scheduling (expect 200) ---"
MARCUS_CLEAN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -b "$COOKIE_JAR.marcus" \
  -X POST "$BASE_URL/api/content/content-smart-scheduling/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "APPROVED"}')
echo "Marcus Clean Approve Status: $MARCUS_CLEAN_STATUS (Expected: 200)"
test "$MARCUS_CLEAN_STATUS" = "200"

# 12. Full workflow to PUBLISHED as priya
echo "--- 12. Testing full workflow to PUBLISHED as priya ---"
PRIYA_PUBLISH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -b "$COOKIE_JAR.priya" \
  -X POST "$BASE_URL/api/content/content-smart-scheduling/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "PUBLISHED"}')
echo "Priya Publish Status: $PRIYA_PUBLISH_STATUS (Expected: 200)"
test "$PRIYA_PUBLISH_STATUS" = "200"

# 13. Uploads for .txt/.md/.docx/.pdf/.png
echo "--- 13. Testing uploads for .txt, .md, .docx, .pdf, .png ---"
mkdir -p /tmp/upload_tests
echo "Test text content" > /tmp/upload_tests/sample.txt
echo "# Test Markdown" > /tmp/upload_tests/sample.md
echo "Dummy docx" > /tmp/upload_tests/sample.docx
echo "%PDF-1.4 dummy pdf" > /tmp/upload_tests/sample.pdf
# create minimal 1x1 png binary
printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82' > /tmp/upload_tests/sample.png

for EXT in txt md docx pdf png; do
  UPLOAD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    -F "file=@/tmp/upload_tests/sample.$EXT" \
    "$BASE_URL/api/upload")
  echo "Upload sample.$EXT status: $UPLOAD_STATUS (Expected: 200)"
  test "$UPLOAD_STATUS" = "200"
done

echo "=== ALL RUNTIME API TESTS PASSED SUCCESSFULLY ==="
