import {
  BrandKit,
  ContentChannel,
  ContentFormat,
  Finding,
  FindingSeverity,
} from '../types';
import { checkAccessibility } from './accessibility';
import { checkClaims } from './claims';
import { checkConfidentiality } from './confidentiality';
import { checkMessaging } from './messaging';
import { checkTerminology } from './terminology';
import { checkTone } from './tone';
import { checkVisual } from './visual';

export interface AnalysisOptions {
  contentItemId: string;
  versionId: string;
  channel: ContentChannel;
  format: ContentFormat;
  mediaUrl?: string;
}

export interface AnalysisResult {
  findings: Finding[];
  readinessScore: number;
  blockersCount: number;
  totalFindingsCount: number;
  openFindingsCount: number;
}

export function runDetectionEngine(
  content: string,
  options: AnalysisOptions,
  brandKit: BrandKit
): AnalysisResult {
  const allFindings: Finding[] = [];

  // Run all seven deterministic category checkers
  allFindings.push(
    ...checkTone(content, options.contentItemId, options.versionId, brandKit)
  );
  allFindings.push(
    ...checkTerminology(content, options.contentItemId, options.versionId, brandKit)
  );
  allFindings.push(
    ...checkMessaging(
      content,
      options.contentItemId,
      options.versionId,
      brandKit,
      options.channel
    )
  );
  allFindings.push(
    ...checkClaims(content, options.contentItemId, options.versionId, brandKit)
  );
  allFindings.push(
    ...checkVisual(
      content,
      options.contentItemId,
      options.versionId,
      brandKit,
      options.mediaUrl
    )
  );
  allFindings.push(
    ...checkAccessibility(
      content,
      options.contentItemId,
      options.versionId,
      brandKit
    )
  );
  allFindings.push(
    ...checkConfidentiality(
      content,
      options.contentItemId,
      options.versionId,
      brandKit
    )
  );

  // Sort findings by position, then by severity
  const severityRank: Record<FindingSeverity, number> = {
    BLOCKER: 0,
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
  };

  allFindings.sort((a, b) => {
    if (a.span.start !== b.span.start) {
      return a.span.start - b.span.start;
    }
    return severityRank[a.severity] - severityRank[b.severity];
  });

  // Calculate scores
  const blockersCount = allFindings.filter((f) => f.severity === 'BLOCKER').length;
  const highCount = allFindings.filter((f) => f.severity === 'HIGH').length;
  const mediumCount = allFindings.filter((f) => f.severity === 'MEDIUM').length;
  const lowCount = allFindings.filter((f) => f.severity === 'LOW').length;

  let penalty =
    blockersCount * 35 + highCount * 15 + mediumCount * 7 + lowCount * 3;
  let readinessScore = Math.max(0, 100 - penalty);

  if (blockersCount > 0 && readinessScore > 35) {
    readinessScore = 25; // Blockers hard-cap the score
  }

  return {
    findings: allFindings,
    readinessScore,
    blockersCount,
    totalFindingsCount: allFindings.length,
    openFindingsCount: allFindings.length,
  };
}

/**
 * Pure function: cleanly applies a suggested fix to raw content at exact span coordinates
 */
export function applySuggestedFix(
  originalContent: string,
  finding: Finding,
  customReplacementText?: string
): string {
  const replacement =
    customReplacementText !== undefined
      ? customReplacementText
      : finding.suggestedFix.text;
  const { start, end } = finding.span;

  if (finding.suggestedFix.action === 'REMOVE') {
    return (
      originalContent.substring(0, start) +
      originalContent.substring(end)
    ).trim();
  }

  if (finding.suggestedFix.action === 'INSERT') {
    return (
      originalContent.substring(0, start) +
      replacement +
      originalContent.substring(start)
    );
  }

  // REPLACE
  return (
    originalContent.substring(0, start) +
    replacement +
    originalContent.substring(end)
  );
}
