import { BrandKit, Finding } from '../types';
import { findMatches } from './helpers';

export function checkAccessibility(
  content: string,
  contentItemId: string,
  versionId: string,
  brandKit: BrandKit
): Finding[] {
  const findings: Finding[] = [];

  // 1. Ambiguous link text ("click here", "read more", "link", "learn more" without context)
  const vagueLinkRegex = /\[(?:click\s+here|read\s+more|link|here|more)\]\([^)]+\)/gi;
  const vagueLinkMatches = findMatches(content, vagueLinkRegex);

  for (const match of vagueLinkMatches) {
    findings.push({
      id: `a11y-link-${match.start}`,
      contentItemId,
      versionId,
      category: 'accessibility',
      severity: 'HIGH',
      ruleCode: 'A11Y-MEANINGFUL-LINKS',
      span: match,
      why: `Ambiguous link text "${match.text}" fails WCAG 2.1 Criterion 2.4.4. Screen reader users navigating by links cannot understand target destination out of context.`,
      citation: {
        id: 'A11Y-2',
        type: 'guideline',
        title: 'Structural Accessibility and Meaningful Links',
        section: 'Link Purpose (In Context)',
        brandPrinciple:
          'Links must provide descriptive context; never use ambiguous phrases like "click here" or "read more". Describe the specific destination.',
      },
      suggestedFix: {
        action: 'REPLACE',
        text: match.text.replace(
          /\[(?:click\s+here|read\s+more|link|here|more)\]/i,
          '[Explore Northwind Smart Thermostat specifications]'
        ),
      },
      status: 'OPEN',
      weight: 3.0,
    });
  }

  // Also match plain text "click here" or "read more" when used as callouts
  const plainVagueMatches = findMatches(
    content,
    /\b(click\s+here\s+to\s+download|click\s+here|read\s+more\s+at)\b/gi
  );
  for (const match of plainVagueMatches) {
    if (!vagueLinkMatches.some((m) => match.start >= m.start && match.end <= m.end)) {
      findings.push({
        id: `a11y-link-plain-${match.start}`,
        contentItemId,
        versionId,
        category: 'accessibility',
        severity: 'MEDIUM',
        ruleCode: 'A11Y-MEANINGFUL-LINKS',
        span: match,
        why: `Uninformative link anchor "${match.text}" lacks descriptive semantic context for assistive technologies.`,
        citation: {
          id: 'A11Y-2',
          type: 'guideline',
          title: 'Structural Accessibility and Meaningful Links',
          section: 'Link Purpose',
          brandPrinciple:
            'Maintain hierarchical accessibility. Link copy must stand on its own without surrounding visual context.',
        },
        suggestedFix: {
          action: 'REPLACE',
          text: 'review the Northwind Energy Savings Documentation',
        },
        status: 'OPEN',
        weight: 2.0,
      });
    }
  }

  // 2. Missing or inadequate Alt Text in markdown or HTML
  // Pattern 1: Empty markdown alt text: ![](/path.jpg)
  const emptyAltMatches = findMatches(content, /!\[\s*\]\(([^)]+)\)/g);
  for (const match of emptyAltMatches) {
    findings.push({
      id: `a11y-empty-alt-${match.start}`,
      contentItemId,
      versionId,
      category: 'accessibility',
      severity: 'BLOCKER',
      ruleCode: 'A11Y-ALT-TEXT',
      span: match,
      why: 'Image is missing alternative text. Assistive screen readers cannot convey image meaning without alt text (WCAG 1.1.1).',
      citation: {
        id: 'A11Y-1',
        type: 'guideline',
        title: 'Visual Accessibility and Alternative Descriptions',
        section: 'Non-text Content (Level A)',
        brandPrinciple:
          'All imagery must include descriptive, purposeful alt text for assistive screen readers.',
      },
      suggestedFix: {
        action: 'REPLACE',
        text: '![Northwind Home Smart Thermostat mounted on modern wood-paneled wall]($1)',
      },
      status: 'OPEN',
      weight: 4.0,
    });
  }

  // Pattern 2: Vague alt text like ![image](...) or ![photo](...)
  const vagueAltMatches = findMatches(
    content,
    /!\[(image|photo|graphic|screenshot|picture|icon)\]\(([^)]+)\)/gi
  );
  for (const match of vagueAltMatches) {
    findings.push({
      id: `a11y-vague-alt-${match.start}`,
      contentItemId,
      versionId,
      category: 'accessibility',
      severity: 'HIGH',
      ruleCode: 'A11Y-ALT-TEXT',
      span: match,
      why: `Generic alt text "${match.text}" is non-descriptive. Screen readers already announce image elements; alt text must describe the content and function.`,
      citation: {
        id: 'A11Y-1',
        type: 'guideline',
        title: 'Visual Accessibility and Alternative Descriptions',
        section: 'Meaningful Descriptions',
        brandPrinciple:
          'Describe subject, focal point, and contextual relevance. Avoid boilerplate labels such as "photo" or "graphic".',
      },
      suggestedFix: {
        action: 'REPLACE',
        text: '![EcoMode energy dashboard showing weekly thermal efficiency gains]',
      },
      status: 'OPEN',
      weight: 3.5,
    });
  }

  // 3. Heading level skips (e.g., # followed by ### skipping ##)
  const headingLines = content
    .split('\n')
    .map((line, idx) => ({ line, idx, match: line.match(/^(#{1,6})\s+(.*)$/) }))
    .filter((item) => item.match !== null);

  let prevLevel = 0;
  for (const h of headingLines) {
    const level = h.match![1].length;
    if (prevLevel > 0 && level > prevLevel + 1) {
      const lineStart = content.split('\n').slice(0, h.idx).join('\n').length + (h.idx > 0 ? 1 : 0);
      findings.push({
        id: `a11y-heading-skip-${lineStart}`,
        contentItemId,
        versionId,
        category: 'accessibility',
        severity: 'MEDIUM',
        ruleCode: 'A11Y-HEADING-SKIP',
        span: {
          start: lineStart,
          end: lineStart + h.line.length,
          text: h.line,
        },
        why: `Heading level skip detected: H${prevLevel} directly followed by H${level} without intervening H${prevLevel + 1}. Breaks navigation landmark tree for screen readers.`,
        citation: {
          id: 'A11Y-2',
          type: 'guideline',
          title: 'Structural Accessibility and Meaningful Links',
          section: 'Section Headings Hierarchy',
          brandPrinciple:
            'Maintain hierarchical heading order without skipping levels (e.g. h1 followed directly by h3).',
        },
        suggestedFix: {
          action: 'REPLACE',
          text: '#'.repeat(prevLevel + 1) + ' ' + h.match![2],
        },
        status: 'OPEN',
        weight: 2.5,
      });
    }
    prevLevel = level;
  }

  return findings;
}
