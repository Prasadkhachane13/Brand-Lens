import { BrandKit, Finding } from '../types';
import { calculateReadability, findMatches } from './helpers';

export function checkTone(
  content: string,
  contentItemId: string,
  versionId: string,
  brandKit: BrandKit
): Finding[] {
  const findings: Finding[] = [];
  const tone = brandKit.toneProfile;

  // 1. Exclamation point overuse
  const exclamations = findMatches(content, /!{2,}/g);
  for (const match of exclamations) {
    findings.push({
      id: `tone-exclamation-${match.start}`,
      contentItemId,
      versionId,
      category: 'tone',
      severity: 'LOW',
      ruleCode: 'TONE-PUNCTUATION',
      span: match,
      why: 'Multiple consecutive exclamation marks violate Northwind Home professional editorial tone standards.',
      citation: {
        id: 'TONE-1',
        type: 'guideline',
        title: 'Editorial Tone & Professional Punctuation',
        section: 'Punctuation & Syntax',
        brandPrinciple:
          'Northwind Home communicates with quiet confidence, precision, and clarity. Avoid sensationalist typography.',
      },
      suggestedFix: {
        action: 'REPLACE',
        text: '.',
      },
      status: 'OPEN',
      weight: 1.5,
    });
  }

  // 2. Banned slang and hype words
  const bannedSlang = tone.bannedSlang || [
    'super dope',
    'mind-blowing',
    'gonna',
    'tons of',
    'insane',
    'game-changer',
    'crazy good',
  ];

  for (const slang of bannedSlang) {
    const escaped = slang.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matches = findMatches(content, new RegExp(`\\b${escaped}\\b`, 'gi'));
    for (const match of matches) {
      findings.push({
        id: `tone-slang-${match.start}`,
        contentItemId,
        versionId,
        category: 'tone',
        severity: 'MEDIUM',
        ruleCode: 'TONE-SLANG',
        span: match,
        why: `Casual slang '${match.text}' does not match the authoritative, calm Northwind Home brand persona.`,
        citation: {
          id: 'TONE-2',
          type: 'guideline',
          title: 'Brand Voice, Formality & Vocabulary',
          section: 'Vocabulary Restrictions',
          brandPrinciple:
            'Use precise architectural and engineering vocabulary rather than promotional hyperbole or colloquialisms.',
        },
        suggestedFix: {
          action: 'REPLACE',
          text: getProfessionalAlternative(match.text),
        },
        status: 'OPEN',
        weight: 2.0,
      });
    }
  }

  // 3. Excessively long sentences (> maxSentenceLength)
  const sentenceRegex = /([A-Z][^.!?]*[.!?])/g;
  let sMatch: RegExpExecArray | null;
  while ((sMatch = sentenceRegex.exec(content)) !== null) {
    const sentenceText = sMatch[1].trim();
    const words = sentenceText.split(/\s+/).filter(Boolean);
    if (words.length > tone.maxSentenceLength) {
      findings.push({
        id: `tone-length-${sMatch.index}`,
        contentItemId,
        versionId,
        category: 'tone',
        severity: 'LOW',
        ruleCode: 'TONE-SENTENCE-LENGTH',
        span: {
          start: sMatch.index,
          end: sMatch.index + sentenceText.length,
          text: sentenceText,
        },
        why: `Sentence has ${words.length} words, exceeding maximum guideline threshold of ${tone.maxSentenceLength} words. Long sentences reduce reader comprehension.`,
        citation: {
          id: 'TONE-3',
          type: 'guideline',
          title: 'Syntax Cadence & Sentence Architecture',
          section: 'Sentence Length & Readability',
          brandPrinciple:
            'Favor crisp, rhythmic sentence structures. Split compound ideas into two distinct statements.',
        },
        suggestedFix: {
          action: 'REPLACE',
          text: splitLongSentence(sentenceText),
        },
        status: 'OPEN',
        weight: 1.0,
      });
    }
  }

  // 4. Overall Readability Check
  const readability = calculateReadability(content);
  if (readability.gradeLevel > tone.targetReadingGrade[1] + 2 && content.length > 200) {
    // Flag first complex paragraph
    const firstParagraph = content.split('\n\n')[0] || content.slice(0, 100);
    findings.push({
      id: `tone-readability-0`,
      contentItemId,
      versionId,
      category: 'tone',
      severity: 'MEDIUM',
      ruleCode: 'TONE-COMPLEXITY',
      span: {
        start: 0,
        end: Math.min(content.length, firstParagraph.length),
        text: firstParagraph,
      },
      why: `Content reading level is estimated at Grade ${readability.gradeLevel}, exceeding target band (Grades ${tone.targetReadingGrade[0]}-${tone.targetReadingGrade[1]}).`,
      citation: {
        id: 'TONE-1',
        type: 'guideline',
        title: 'Universal Readability & Clarity',
        section: 'Flesch-Kincaid Benchmark',
        brandPrinciple:
          'Northwind documentation must remain readily accessible to homeowners without specialized engineering backgrounds.',
      },
      suggestedFix: {
        action: 'REPLACE',
        text: 'Simplify sentence structure and replace technical jargon with direct language.',
      },
      status: 'OPEN',
      weight: 1.5,
    });
  }

  return findings;
}

function getProfessionalAlternative(slang: string): string {
  const map: Record<string, string> = {
    'super dope': 'exceptional',
    'mind-blowing': 'innovative',
    gonna: 'going to',
    'tons of': 'substantial',
    insane: 'remarkable',
    'game-changer': 'advancement',
    'crazy good': 'high-performance',
  };
  return map[slang.toLowerCase()] || 'refined';
}

function splitLongSentence(sentence: string): string {
  const andIndex = sentence.indexOf(' and ');
  if (andIndex > 20) {
    return (
      sentence.substring(0, andIndex) +
      '. Additionally, ' +
      sentence.substring(andIndex + 5)
    );
  }
  return sentence;
}
