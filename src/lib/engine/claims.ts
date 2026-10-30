import { BrandKit, Finding } from '../types';
import { findMatches } from './helpers';

export function checkClaims(
  content: string,
  contentItemId: string,
  versionId: string,
  brandKit: BrandKit
): Finding[] {
  const findings: Finding[] = [];
  const currentDate = new Date('2026-10-29'); // local app current date

  // 1. Superlative patterns (# is non-word, so use alternation for #1)
  const superlativeRegex = /(?:#1|\b(?:number\s+one|best-in-class|unmatched|guaranteed|100%\s+risk-free|market\s+leader|world's\s+best)\b)/gi;
  const superlativeMatches = findMatches(content, superlativeRegex);

  for (const match of superlativeMatches) {
    const termLower = match.text.toLowerCase();

    // Check if any ApprovedSource mentions or substantiates this superlative
    const matchingSource = brandKit.approvedSources.find((src) =>
      src.allowedSuperlatives?.some((s) => s.toLowerCase() === termLower) ||
      src.substantiatedStatementText.toLowerCase().includes(termLower)
    );

    if (matchingSource) {
      const reviewDate = new Date(matchingSource.reviewAfter);
      const isExpired = reviewDate < currentDate || matchingSource.isExpired;

      if (isExpired) {
        // Outdated source violation
        findings.push({
          id: `claim-outdated-${match.start}`,
          contentItemId,
          versionId,
          category: 'claims',
          severity: 'HIGH',
          ruleCode: 'CLAIM-SUPERLATIVE',
          span: match,
          why: `OUTDATED SOURCE: Superlative claim "${match.text}" references source "${matchingSource.title}" which expired on ${matchingSource.reviewAfter}. Unsubstantiated rejects are strictly prohibited.`,
          citation: {
            id: matchingSource.id,
            type: 'approved_source',
            title: matchingSource.title,
            owner: matchingSource.owner,
            effectiveFrom: matchingSource.effectiveFrom,
            reviewAfter: matchingSource.reviewAfter,
            isExpired: true,
            substantiatedStatementText: matchingSource.substantiatedStatementText,
            brandPrinciple:
              'Every finding flagged by BrandLens is tied to an explicit rule in the Northwind Home Brand Kit or an Approved Evidence Source. Unsubstantiated claims are strictly prohibited.',
          },
          suggestedFix: {
            action: 'REPLACE',
            text: getSubstitutedQualifier(match.text),
          },
          status: 'OPEN',
          weight: 4.0,
        });
      }
    } else {
      // Unsubstantiated claim with no approved source
      findings.push({
        id: `claim-unsubstantiated-${match.start}`,
        contentItemId,
        versionId,
        category: 'claims',
        severity: 'BLOCKER',
        ruleCode: 'CLAIM-SUPERLATIVE',
        span: match,
        why: `Absolute superlative "${match.text}" has no active validated Approved Source on file. Unverified claims create regulatory advertising liability.`,
        citation: {
          id: 'CLAIM-1',
          type: 'guideline',
          title: 'Superlatives & Unsubstantiated Claims',
          section: 'Substantiation Requirements',
          brandPrinciple:
            'Absolute superlatives such as "#1", "guaranteed", or "best-in-class" are strictly prohibited unless linked to an active, validated Approved Source.',
        },
        suggestedFix: {
          action: 'REPLACE',
          text: getSubstitutedQualifier(match.text),
        },
        status: 'OPEN',
        weight: 5.0,
      });
    }
  }

  // 2. Numeric Claims & Percentages Verification
  // Match patterns like "saves 45%", "reduces heating by 60%", "$199", "100,000 homes"
  const numericRegex = /\b(\d+%\s*(?:savings|reduction|efficiency)?|\$\d+(?:\.\d{2})?|\b\d{2,3}(?:,\d{3})*\s*(?:homes|customers|units|users))\b/gi;
  const numericMatches = findMatches(content, numericRegex);

  for (const match of numericMatches) {
    // Cross-check against ApprovedSource numeric metrics
    const matchLower = match.text.toLowerCase();
    const isDocumented = brandKit.approvedSources.some((src) => {
      const isSrcValid = new Date(src.reviewAfter) >= currentDate && !src.isExpired;
      if (!isSrcValid) return false;
      return (
        src.substantiatedStatementText.toLowerCase().includes(matchLower) ||
        Object.values(src.numericMetrics || {}).some((val) =>
          String(val).toLowerCase().includes(matchLower)
        )
      );
    });

    if (!isDocumented) {
      // Find if an expired source exists or if it's completely unverified
      const expiredSource = brandKit.approvedSources.find(
        (src) =>
          src.substantiatedStatementText.toLowerCase().includes(matchLower) &&
          (new Date(src.reviewAfter) < currentDate || src.isExpired)
      );

      if (expiredSource) {
        findings.push({
          id: `claim-num-expired-${match.start}`,
          contentItemId,
          versionId,
          category: 'claims',
          severity: 'HIGH',
          ruleCode: 'CLAIM-NUMERIC',
          span: match,
          why: `Numeric claim "${match.text}" links to expired source "${expiredSource.title}" (review date: ${expiredSource.reviewAfter}). Requires recertification.`,
          citation: {
            id: expiredSource.id,
            type: 'approved_source',
            title: expiredSource.title,
            owner: expiredSource.owner,
            effectiveFrom: expiredSource.effectiveFrom,
            reviewAfter: expiredSource.reviewAfter,
            isExpired: true,
            substantiatedStatementText: expiredSource.substantiatedStatementText,
          },
          suggestedFix: {
            action: 'REPLACE',
            text: 'up to 23%',
          },
          status: 'OPEN',
          weight: 4.0,
        });
      } else {
        findings.push({
          id: `claim-num-unverified-${match.start}`,
          contentItemId,
          versionId,
          category: 'claims',
          severity: 'BLOCKER',
          ruleCode: 'CLAIM-NUMERIC',
          span: match,
          why: `Numeric claim "${match.text}" is not documented in any active Approved Fact Source. Unsubstantiated statistics risk regulatory compliance fines.`,
          citation: {
            id: 'CLAIM-2',
            type: 'guideline',
            title: 'Numeric and Performance Data Verification',
            section: 'Statistical Integrity',
            brandPrinciple:
              'Every numeric percentage, technical specification, and dollar amount quoted in content must be documented verbatim in an active Approved Source.',
          },
          suggestedFix: {
            action: 'REPLACE',
            text: 'significant measurable',
          },
          status: 'OPEN',
          weight: 4.5,
        });
      }
    }
  }

  return findings;
}

function getSubstitutedQualifier(superlative: string): string {
  const map: Record<string, string> = {
    '#1': 'leading',
    'number one': 'premier',
    'best-in-class': 'industry-recognized',
    unmatched: 'high-caliber',
    guaranteed: 'designed to',
    '100% risk-free': 'satisfaction-backed',
    'market leader': 'pioneering brand',
    "world's best": 'world-class',
  };
  return map[superlative.toLowerCase()] || 'leading';
}
