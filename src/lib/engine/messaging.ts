import { BrandKit, ContentChannel, Finding } from '../types';
import { findMatches } from './helpers';

export function checkMessaging(
  content: string,
  contentItemId: string,
  versionId: string,
  brandKit: BrandKit,
  channel: ContentChannel
): Finding[] {
  const findings: Finding[] = [];
  const coreValueProp = 'Intelligent climate control made simple for modern homes.';

  // 1. Check for core value proposition in marketing/press/landing channels
  const marketingChannels: ContentChannel[] = ['PRESS', 'LANDING', 'EMAIL', 'BLOG'];
  if (marketingChannels.includes(channel)) {
    const hasValueProp = content.toLowerCase().includes('climate control made simple') ||
      content.toLowerCase().includes('intelligent climate control');

    if (!hasValueProp) {
      // Find suitable anchor point at end of first sentence or paragraph
      const firstSentenceMatch = content.match(/[^.!?]+[.!?]/);
      const insertIndex = firstSentenceMatch ? firstSentenceMatch[0].length : content.length;
      
      findings.push({
        id: `msg-core-prop-${insertIndex}`,
        contentItemId,
        versionId,
        category: 'messaging',
        severity: 'MEDIUM',
        ruleCode: 'MESSAGING-VALUE-PROP',
        span: {
          start: 0,
          end: Math.min(content.length, insertIndex),
          text: content.substring(0, Math.min(content.length, insertIndex)),
        },
        why: `Marketing channels require inclusion of core value proposition: "${coreValueProp}" to ensure cross-channel brand recognition.`,
        citation: {
          id: 'MSG-1',
          type: 'guideline',
          title: 'Core Brand Pillars & Value Propositions',
          section: 'Market Positioning',
          brandPrinciple:
            'External customer-facing collateral must reinforce our central thesis: Intelligent climate control made simple for modern homes.',
        },
        suggestedFix: {
          action: 'INSERT',
          text: ` ${coreValueProp} `,
        },
        status: 'OPEN',
        weight: 3.5,
      });
    }
  }

  // 2. Check for empty or vague hyperbolic claims like "revolutionary efficiency"
  const vagueHypeMatches = findMatches(
    content,
    /\b(revolutionary efficiency|total transformation|magic solution|miraculous)\b/gi
  );
  for (const match of vagueHypeMatches) {
    findings.push({
      id: `msg-vague-hype-${match.start}`,
      contentItemId,
      versionId,
      category: 'messaging',
      severity: 'MEDIUM',
      ruleCode: 'MESSAGING-SPECIFICITY',
      span: match,
      why: `Phrasing "${match.text}" relies on empty abstraction. Northwind messaging requires specific, grounded engineering benefits.`,
      citation: {
        id: 'MSG-2',
        type: 'guideline',
        title: 'Concrete Product Value vs Abstract Hyperbole',
        section: 'Feature Messaging',
        brandPrinciple:
          'Quantify or describe physical user benefits (comfort, acoustic silence, energy savings) instead of generic buzzwords.',
      },
      suggestedFix: {
        action: 'REPLACE',
        text: 'sub-degree temperature precision and energy optimization',
      },
      status: 'OPEN',
      weight: 2.5,
    });
  }

  return findings;
}
