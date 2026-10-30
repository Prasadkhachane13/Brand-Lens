import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkTone,
  checkTerminology,
  checkMessaging,
  checkClaims,
  checkVisual,
  checkAccessibility,
  checkConfidentiality,
  runDetectionEngine,
  applySuggestedFix,
} from './index';
import { BrandKit } from '../types';

const mockBrandKit: BrandKit = {
  brandName: 'Northwind Home',
  brandTagline: 'Intelligent climate control made simple for modern homes.',
  guidelines: [
    {
      id: 'CLAIM-1',
      category: 'claims',
      ruleCode: 'CLAIM-SUPERLATIVE',
      title: 'Superlatives & Unsubstantiated Claims',
      description: 'Superlatives must link to verified active sources.',
      severity: 'BLOCKER',
      examples: { compliant: ['leading'], violation: ['#1'] },
    },
    {
      id: 'TERM-1',
      category: 'terminology',
      ruleCode: 'TERM-AVOID',
      title: 'Approved Terminology',
      description: 'Use Northwind Home, never NW Home.',
      severity: 'HIGH',
      examples: { compliant: ['Northwind Home'], violation: ['NW Home'] },
    },
  ],
  terms: [
    {
      id: 'term-nw-home',
      term: 'NW Home',
      preferred: 'Northwind Home',
      explanation: 'Official brand name must never be abbreviated as NW Home.',
      category: 'BRAND_NAME',
    },
    {
      id: 'term-cheap',
      term: 'cheap',
      preferred: 'cost-effective',
      explanation: 'Use value-oriented terminology.',
      category: 'SALES_CLAIM',
    },
  ],
  approvedSources: [
    {
      id: 'SRC-2023-THERMAL',
      title: '2023 Thermal Modulation Award (EXPIRED)',
      factType: 'AWARD',
      owner: 'Market Research',
      effectiveFrom: '2023-01-01',
      reviewAfter: '2024-01-01', // Expired!
      isExpired: true,
      substantiatedStatementText: 'Rated #1 best-in-class thermostat for smart home temperature modulation.',
      allowedSuperlatives: ['#1', 'best-in-class'],
      numericMetrics: {},
    },
    {
      id: 'SRC-2024-ENERGY',
      title: '2024 Energy Efficiency Independent Benchmark',
      factType: 'ENERGY_STUDY',
      owner: 'Hardware QA',
      effectiveFrom: '2024-06-01',
      reviewAfter: '2027-06-01', // Active
      isExpired: false,
      substantiatedStatementText: 'Saves up to 23% on seasonal HVAC electricity bills.',
      allowedSuperlatives: [],
      numericMetrics: { savings: 'up to 23%' },
    },
  ],
  approvedAssets: [],
  toneProfile: {
    targetFormality: 70,
    maxSentenceLength: 25,
    targetReadingGrade: [8, 11],
    bannedSlang: ['super dope', 'mind-blowing', 'gonna'],
    allowExclamationPoints: false,
    maxExclamationPointsPerDoc: 1,
    activeVoiceTarget: 80,
  },
};

test('Detection Engine: Terminology avoids NW Home and suggests Northwind Home', () => {
  const content = 'NW Home delivers outstanding comfort with cheap parts.';
  const findings = checkTerminology(content, 'item-1', 'v1', mockBrandKit);

  assert.ok(findings.length >= 2, 'Should find avoided brand abbreviation and sales term');
  const nwHomeFinding = findings.find((f) => f.span.text === 'NW Home');
  assert.ok(nwHomeFinding, 'Should flag NW Home');
  assert.equal(nwHomeFinding?.suggestedFix.text, 'Northwind Home');
  assert.equal(nwHomeFinding?.ruleCode, 'TERM-AVOID');
});

test('Detection Engine: Claims identifies expired source for #1 and best-in-class', () => {
  const content = 'We are the #1 best-in-class thermostat in the country.';
  const findings = checkClaims(content, 'item-1', 'v1', mockBrandKit);

  const num1 = findings.find((f) => f.span.text === '#1');
  assert.ok(num1, 'Should flag #1');
  assert.equal(num1?.citation.isExpired, true, 'Citation should be marked expired');
  assert.match(num1?.why || '', /OUTDATED SOURCE/, 'Rationale must highlight outdated source');
  assert.equal(num1?.suggestedFix.text, 'leading');
});

test('Detection Engine: Confidentiality flags API secret keys and internal banners', () => {
  const content = 'Release key is sk_live_northwind_99214 and project is [CONFIDENTIAL - INTERNAL ONLY].';
  const findings = checkConfidentiality(content, 'item-1', 'v1', mockBrandKit);

  assert.ok(findings.some((f) => f.ruleCode === 'CONF-API-KEY'), 'Should catch live API secret');
  assert.ok(findings.some((f) => f.ruleCode === 'CONF-INTERNAL-MARKER'), 'Should catch internal banner');
  assert.equal(findings[0].severity, 'BLOCKER', 'Confidentiality leaks must be BLOCKERS');
});

test('Detection Engine: Accessibility checks heading skips and vague links', () => {
  const content = '# Main Title\n\n### Skipped Section\n\nPlease [click here](https://northwind.test) for details.';
  const findings = checkAccessibility(content, 'item-1', 'v1', mockBrandKit);

  assert.ok(findings.some((f) => f.ruleCode === 'A11Y-HEADING-SKIP'), 'Should catch heading jump from h1 to h3');
  assert.ok(findings.some((f) => f.ruleCode === 'A11Y-MEANINGFUL-LINKS'), 'Should catch ambiguous click here link');
});

test('Detection Engine: Tone catches consecutive exclamation marks and banned slang', () => {
  const content = 'This thermostat is super dope and totally mind-blowing!!!';
  const findings = checkTone(content, 'item-1', 'v1', mockBrandKit);

  assert.ok(findings.some((f) => f.ruleCode === 'TONE-PUNCTUATION'), 'Should catch multiple exclamation marks');
  assert.ok(findings.some((f) => f.ruleCode === 'TONE-SLANG'), 'Should catch super dope slang');
});

test('Detection Engine: applySuggestedFix replaces exact text span cleanly', () => {
  const original = 'NW Home delivers comfort.';
  const finding = {
    id: 'f1',
    contentItemId: '1',
    versionId: '1',
    category: 'terminology' as const,
    severity: 'HIGH' as const,
    ruleCode: 'TERM-AVOID',
    span: { start: 0, end: 7, text: 'NW Home' },
    why: 'Avoid abbreviation',
    citation: { id: 'TERM-1', type: 'guideline' as const, title: 'Terminology' },
    suggestedFix: { action: 'REPLACE' as const, text: 'Northwind Home' },
    status: 'OPEN' as const,
    weight: 3,
  };

  const updated = applySuggestedFix(original, finding);
  assert.equal(updated, 'Northwind Home delivers comfort.');
});

test('Detection Engine: Orchestrator calculates readiness score and blocker caps', () => {
  const cleanContent = 'Northwind Home delivers intelligent climate control made simple for modern homes. Designed to optimize energy.';
  const cleanResult = runDetectionEngine(
    cleanContent,
    { contentItemId: '1', versionId: 'v1', channel: 'PRESS', format: 'TEXT' },
    mockBrandKit
  );
  assert.ok(cleanResult.readinessScore >= 90, 'Clean content should have high readiness score');

  const dirtyContent = 'NW Home has sk_live_northwind_99214 with #1 guarantees!';
  const dirtyResult = runDetectionEngine(
    dirtyContent,
    { contentItemId: '1', versionId: 'v1', channel: 'PRESS', format: 'TEXT' },
    mockBrandKit
  );
  assert.ok(dirtyResult.blockersCount > 0, 'Should detect blockers');
  assert.ok(dirtyResult.readinessScore <= 35, 'Blockers should cap readiness score');
});
