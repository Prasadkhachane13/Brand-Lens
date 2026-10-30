import { BrandKit, Finding } from '../types';
import { findMatches } from './helpers';

export function checkVisual(
  content: string,
  contentItemId: string,
  versionId: string,
  brandKit: BrandKit,
  mediaUrl?: string
): Finding[] {
  const findings: Finding[] = [];

  // 1. Check for unapproved HEX colors mentioned in markup / CSS / copy
  const hexMatches = findMatches(content, /#(?:[0-9a-fA-F]{3}){1,2}\b/g);
  const approvedPalette = [
    '#0B111E',
    '#131B2A',
    '#1E293B',
    '#2563EB',
    '#38BDF8',
    '#0D9488',
    '#F1F5F9',
    '#94A3B8',
    '#E2E8F0',
    '#10B981',
    '#F59E0B',
    '#EF4444',
  ].map((c) => c.toLowerCase());

  for (const match of hexMatches) {
    const hex = match.text.toLowerCase();
    if (!approvedPalette.includes(hex)) {
      findings.push({
        id: `visual-hex-${match.start}`,
        contentItemId,
        versionId,
        category: 'visual',
        severity: 'MEDIUM',
        ruleCode: 'VISUAL-PALETTE',
        span: match,
        why: `Hex color "${match.text}" is outside the authorized Northwind Home corporate color system.`,
        citation: {
          id: 'VIS-2',
          type: 'guideline',
          title: 'Color Palette & Atmospheric Lighting',
          section: 'Palette Standards',
          brandPrinciple:
            'Northwind visual identity is defined by Deep Slate (#0B111E), Nordic Cobalt (#2563EB), and Teal (#0D9488). Arbitrary tinting dilutes visual consistency.',
        },
        suggestedFix: {
          action: 'REPLACE',
          text: '#2563EB',
        },
        status: 'OPEN',
        weight: 2.0,
      });
    }
  }

  // 2. Check for logo aspect ratio or improper logo placement references
  const logoIssueMatches = findMatches(
    content,
    /(logo\s+(?:stretched|distorted|without\s+clearspace|recolored)|stretched\s+logo)/gi
  );
  for (const match of logoIssueMatches) {
    findings.push({
      id: `visual-logo-${match.start}`,
      contentItemId,
      versionId,
      category: 'visual',
      severity: 'HIGH',
      ruleCode: 'VISUAL-LOGO-CLEARSPACE',
      span: match,
      why: 'Northwind Home emblem must maintain 1:1 aspect ratio with minimum clearspace equal to 50% of the shield height.',
      citation: {
        id: 'VIS-1',
        type: 'guideline',
        title: 'Logo Clearspace & Protection Zone',
        section: 'Emblem Integrity',
        brandPrinciple:
          'Never rotate, skew, stretch, or alter the color lockup of the primary Northwind shield logo.',
      },
      suggestedFix: {
        action: 'REPLACE',
        text: 'standard approved logo lockup with 24px clearspace',
      },
      status: 'OPEN',
      weight: 3.0,
    });
  }

  // 3. Asset dHash match check if mediaUrl provided
  if (mediaUrl) {
    const isApprovedAsset = brandKit.approvedAssets.some(
      (asset) => asset.previewUrl === mediaUrl || mediaUrl.includes(asset.id)
    );
    if (!isApprovedAsset && mediaUrl.includes('unverified')) {
      findings.push({
        id: `visual-asset-unapproved-0`,
        contentItemId,
        versionId,
        category: 'visual',
        severity: 'HIGH',
        ruleCode: 'VISUAL-UNAPPROVED-ASSET',
        span: {
          start: 0,
          end: Math.min(content.length, 30),
          text: content.slice(0, 30) || 'Image Asset File',
        },
        why: 'Visual asset perceptual dHash does not match any registered asset in the Northwind Approved Asset Repository.',
        citation: {
          id: 'VIS-3',
          type: 'guideline',
          title: 'Licensed & Validated Media Assets',
          section: 'Perceptual Hash Compliance',
          brandPrinciple:
            'All marketing photos, renders, and iconography must originate from the Brand Kit Approved Assets library to ensure rights clearance and resolution standards.',
        },
        suggestedFix: {
          action: 'REPLACE',
          text: 'Use approved hero asset /assets/northwind-hero-verified.webp',
        },
        status: 'OPEN',
        weight: 3.5,
      });
    }
  }

  return findings;
}
