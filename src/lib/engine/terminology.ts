import { BrandKit, Finding } from '../types';
import { findMatches } from './helpers';

export function checkTerminology(
  content: string,
  contentItemId: string,
  versionId: string,
  brandKit: BrandKit
): Finding[] {
  const findings: Finding[] = [];

  for (const termRule of brandKit.terms) {
    const escaped = termRule.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Case sensitivity: if term is specifically check for improper capitalization like "Eco Mode" or "NW Home", match exactly or case-insensitively depending on term
    const isExactCaseTerm = termRule.term !== termRule.preferred.toLowerCase();
    const regex = new RegExp(`\\b${escaped}\\b`, isExactCaseTerm ? 'gi' : 'g');
    const matches = findMatches(content, regex);

    for (const match of matches) {
      // If the match is already identical to preferred, skip
      if (match.text === termRule.preferred) {
        continue;
      }

      const isAvoidedBrandName = termRule.category === 'BRAND_NAME';
      const severity = isAvoidedBrandName ? 'HIGH' : 'MEDIUM';

      findings.push({
        id: `term-${termRule.id}-${match.start}`,
        contentItemId,
        versionId,
        category: 'terminology',
        severity,
        ruleCode: 'TERM-AVOID',
        span: match,
        why: `${termRule.explanation} The preferred brand terminology is "${termRule.preferred}".`,
        citation: {
          id: 'TERM-1',
          type: 'guideline',
          title: 'Approved Terminology & Prohibited Expressions',
          section: 'Corporate Brand Nomenclature',
          brandPrinciple:
            'Brand names and trademarks protect company equity. Unauthorized abbreviations and informal variants dilute legal brand identity.',
        },
        suggestedFix: {
          action: 'REPLACE',
          text: termRule.preferred,
        },
        status: 'OPEN',
        weight: isAvoidedBrandName ? 3.0 : 2.0,
      });
    }
  }

  // Check specific common orthography: "Eco Mode" -> "EcoMode"
  const ecoModeMatches = findMatches(content, /\b(Eco\s+Mode|eco\s*mode)\b/gi);
  for (const match of ecoModeMatches) {
    if (match.text !== 'EcoMode') {
      findings.push({
        id: `term-ecomode-${match.start}`,
        contentItemId,
        versionId,
        category: 'terminology',
        severity: 'MEDIUM',
        ruleCode: 'TERM-ORTHOGRAPHY',
        span: match,
        why: `Ensure strict camelCase capitalization for trademarked product terms such as EcoMode. Found: "${match.text}".`,
        citation: {
          id: 'TERM-2',
          type: 'guideline',
          title: 'Brand Capitalization & Orthography',
          section: 'Product Feature Trademarking',
          brandPrinciple:
            'All Northwind Home feature branding requires closed CamelCase formatting to maintain registered trademark recognition.',
        },
        suggestedFix: {
          action: 'REPLACE',
          text: 'EcoMode',
        },
        status: 'OPEN',
        weight: 2.0,
      });
    }
  }

  return findings;
}
