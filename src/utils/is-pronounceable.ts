import { FINAL_CLUSTERS, INITIAL_CLUSTERS, MEDIAL_CLUSTERS } from './clusters';

const VOWEL = /[aeiou]/;
const LONG_VOWEL_RUN = /[aeiou]{3}/;
const NAKED_Q = /q(?!u)/;
const ILLEGAL_FINAL_LETTER = /[jqwhv]$/;
const TRIPLE_LETTER = /(.)\1\1/;
const CONSONANT_RUNS = /[^aeiou]+/g;

const isLegalConsonantRun = (run: string, start: number, wordLength: number): boolean => {
  if (run.length <= 1) return true;
  if (start === 0) return INITIAL_CLUSTERS.has(run);
  if (start + run.length === wordLength) return FINAL_CLUSTERS.has(run);
  return MEDIAL_CLUSTERS.has(run);
};

const hasLegalConsonantRuns = (word: string): boolean =>
  [...word.matchAll(CONSONANT_RUNS)].every((match) =>
    isLegalConsonantRun(match[0], match.index ?? 0, word.length),
  );

export const isPronounceable = (word: string): boolean =>
  VOWEL.test(word) &&
  !LONG_VOWEL_RUN.test(word) &&
  !NAKED_Q.test(word) &&
  !ILLEGAL_FINAL_LETTER.test(word) &&
  !TRIPLE_LETTER.test(word) &&
  hasLegalConsonantRuns(word);
