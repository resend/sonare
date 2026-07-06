import { FINAL_CLUSTERS } from './clusters';
import { trailingConsonantRun } from './trailing-consonant-run';

const ILLEGAL_FINAL_LETTERS: ReadonlySet<string> = new Set(['j', 'q', 'w', 'h', 'v']);

const hasLegalEnding = (word: string): boolean => {
  if (word.endsWith('qu')) return false;
  if (ILLEGAL_FINAL_LETTERS.has(word[word.length - 1])) return false;
  const run = trailingConsonantRun(word);
  return run.length <= 1 || FINAL_CLUSTERS.has(run);
};

export const trimToFit = (word: string, maxLength: number): string => {
  if (word.length <= maxLength) return word;
  const prefixes = Array.from({ length: maxLength }, (_, index) =>
    word.slice(0, maxLength - index),
  );
  return prefixes.find(hasLegalEnding) ?? word.slice(0, maxLength);
};
