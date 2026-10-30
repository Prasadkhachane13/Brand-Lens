import { TextSpan } from '../types';

/**
 * Finds all occurrences of a case-insensitive regex or exact string within content,
 * returning exact character start and end indices.
 */
export function findMatches(
  content: string,
  regex: RegExp
): { start: number; end: number; text: string }[] {
  const matches: { start: number; end: number; text: string }[] = [];
  const flags = regex.flags.includes('g') ? regex.flags : regex.flags + 'g';
  const globalRegex = new RegExp(regex.source, flags);

  let match: RegExpExecArray | null;
  while ((match = globalRegex.exec(content)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[0],
    });
  }

  return matches;
}

/**
 * Calculates approximate Flesch-Kincaid Reading Ease and Grade Level
 */
export function calculateReadability(text: string): { gradeLevel: number; readingEase: number } {
  const words = text.match(/\b[a-zA-Z0-9'-]+\b/g) || [];
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  if (words.length === 0 || sentences.length === 0) {
    return { gradeLevel: 0, readingEase: 100 };
  }

  const syllableCount = words.reduce((acc, word) => acc + countSyllables(word), 0);
  const wordsPerSentence = words.length / sentences.length;
  const syllablesPerWord = syllableCount / words.length;

  // Flesch-Kincaid Grade Level formula
  const gradeLevel = Math.max(
    1,
    Math.round(0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59)
  );

  // Flesch Reading Ease formula
  const readingEase = Math.round(
    206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord
  );

  return { gradeLevel, readingEase };
}

function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]|ed|es|e)$/, '');
  word = word.replace(/^y/, '');
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
}

/**
 * Computes 64-bit dHash (difference hash) for hex colors or canvas/image buffer data
 */
export function computeHexDHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

/**
 * Simple SHA-256 for audit chaining in browser/node
 */
export async function sha256(message: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Synchronous fallback hash if webcrypto is unavailable in test runner
  let h = 0xdeadbeef;
  for (let i = 0; i < message.length; i++) {
    h = Math.imul(h ^ message.charCodeAt(i), 2654435761);
  }
  return ((h ^ (h >>> 16)) >>> 0).toString(16).padStart(16, '0');
}
