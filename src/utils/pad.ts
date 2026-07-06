import { canJoin } from './can-join';
import { pick } from './pick';
import type { RandomGenerator } from './rng';
import { trimToFit } from './trim-to-fit';

const PADDING_SYLLABLES = Object.freeze([
  'a',
  'o',
  'u',
  'i',
  'e',
  'ra',
  'ro',
  'ri',
  're',
  'no',
  'na',
  'ni',
  'ne',
  'li',
  'la',
  'lo',
  'le',
  'ka',
  'ko',
  'ki',
  'ke',
  'ta',
  'to',
  'ti',
  'te',
  'sa',
  'so',
  'si',
  'se',
  'ma',
  'mo',
  'mi',
  'me',
  'da',
  'do',
  'di',
  'de',
  'ba',
  'bo',
  'bi',
  'be',
  'pa',
  'po',
  'pi',
  'pe',
  'xa',
  'xo',
  'xi',
  'xe',
]);

const PADDING_CONSONANTS = Object.freeze(['n', 'r', 'l', 's']);

const isVowel = (char: string): boolean => 'aeiou'.includes(char);

const paddingPool = (word: string, budget: number): readonly string[] => {
  const candidates = isVowel(word[word.length - 1] ?? '')
    ? [...PADDING_SYLLABLES, ...PADDING_CONSONANTS]
    : PADDING_SYLLABLES;
  return candidates.filter((entry) => entry.length <= budget && canJoin(word, entry));
};

const appendPadding = (word: string, min: number, max: number, rng: RandomGenerator): string => {
  if (word.length >= min) return word;
  const [syllable, next] = pick(paddingPool(word, max - word.length))(rng);
  return appendPadding(word + syllable, min, max, next);
};

export const padToLength = (s: string, min: number, max: number, rng: RandomGenerator): string =>
  appendPadding(trimToFit(s, max), min, max, rng);
