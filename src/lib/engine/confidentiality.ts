import { BrandKit, Finding } from '../types';
import { findMatches } from './helpers';

export function checkConfidentiality(
  content: string,
  contentItemId: string,
  versionId: string,
  brandKit: BrandKit
): Finding[] {
  const findings: Finding[] = [];

  // 1. API Keys & Live Secret Tokens (Stripe, OpenAI, AWS, GitHub tokens)
  const apiKeyRegex = /\b(sk_live_[a-zA-Z0-9_]{8,}|AKIA[0-9A-Z]{16}|ghp_[a-zA-Z0-9]{20,}|Bearer\s+ey[a-zA-Z0-9_-]{20,})\b/g;
  const keyMatches = findMatches(content, apiKeyRegex);

  for (const match of keyMatches) {
    findings.push({
      id: `conf-key-${match.start}`,
      contentItemId,
      versionId,
      category: 'confidentiality',
      severity: 'BLOCKER',
      ruleCode: 'CONF-API-KEY',
      span: match,
      why: 'CRITICAL SECURITY LEAK: Live API secret or authentication token detected. Accidental publication will compromise production infrastructure.',
      citation: {
        id: 'CONF-1',
        type: 'guideline',
        title: 'Information Security & Credential Protection',
        section: 'Secret Zero Tolerance',
        brandPrinciple:
          'No production credentials, API secrets, or internal service access tokens may appear in public collateral or documentation.',
      },
      suggestedFix: {
        action: 'REPLACE',
        text: '[REDACTED_API_KEY]',
      },
      status: 'OPEN',
      weight: 10.0,
    });
  }

  // 2. Personally Identifiable Information (SSN, Credit Cards, Employee Internal IDs)
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  const ssnMatches = findMatches(content, ssnRegex);

  for (const match of ssnMatches) {
    findings.push({
      id: `conf-pii-${match.start}`,
      contentItemId,
      versionId,
      category: 'confidentiality',
      severity: 'BLOCKER',
      ruleCode: 'CONF-PII',
      span: match,
      why: 'CRITICAL PRIVACY VIOLATION: Social Security Number (SSN) pattern detected. Violates GDPR, CCPA, and corporate data governance.',
      citation: {
        id: 'CONF-2',
        type: 'guideline',
        title: 'Data Privacy & PII Safeguards',
        section: 'Government Identifier Protection',
        brandPrinciple:
          'Customer or employee personal identifying numbers must never be included in drafts or published collateral.',
      },
      suggestedFix: {
        action: 'REMOVE',
        text: '',
      },
      status: 'OPEN',
      weight: 10.0,
    });
  }

  // 3. Internal Confidentiality Watermarks / Labels
  const confBannerRegex = /(\[CONFIDENTIAL(?:\s*-\s*INTERNAL\s+ONLY)?\]|INTERNAL\s+USE\s+ONLY|DO\s+NOT\s+DISTRIBUTE|STRICTLY\s+CONFIDENTIAL)/gi;
  const bannerMatches = findMatches(content, confBannerRegex);

  for (const match of bannerMatches) {
    findings.push({
      id: `conf-banner-${match.start}`,
      contentItemId,
      versionId,
      category: 'confidentiality',
      severity: 'BLOCKER',
      ruleCode: 'CONF-INTERNAL-MARKER',
      span: match,
      why: `Internal classification banner "${match.text}" found. Material marked confidential cannot be approved for public distribution.`,
      citation: {
        id: 'CONF-3',
        type: 'guideline',
        title: 'Document Classification & Distribution Clearance',
        section: 'Distribution Tiering',
        brandPrinciple:
          'All internal classification labels must be resolved and scrubbed before public external release.',
      },
      suggestedFix: {
        action: 'REMOVE',
        text: '',
      },
      status: 'OPEN',
      weight: 8.0,
    });
  }

  // 4. Unannounced Project Codenames
  const codenameRegex = /\b(Project\s+Boreas|Titan\s+Thermostat|Project\s+Northstar|Apollo\s+Hub)\b/gi;
  const codenameMatches = findMatches(content, codenameRegex);

  for (const match of codenameMatches) {
    findings.push({
      id: `conf-codename-${match.start}`,
      contentItemId,
      versionId,
      category: 'confidentiality',
      severity: 'BLOCKER',
      ruleCode: 'CONF-UNANNOUNCED-CODENAME',
      span: match,
      why: `Unreleased internal codename "${match.text}" detected. Unannounced roadmaps are trade secrets until official press embargo lift.`,
      citation: {
        id: 'CONF-4',
        type: 'guideline',
        title: 'Product Roadmap & Embargo Governance',
        section: 'Codename Confidentiality',
        brandPrinciple:
          'Use approved public product commercial names (e.g. Northwind Home EcoController) instead of internal engineering codenames.',
      },
      suggestedFix: {
        action: 'REPLACE',
        text: 'the next-generation Northwind ecosystem',
      },
      status: 'OPEN',
      weight: 8.0,
    });
  }

  return findings;
}
