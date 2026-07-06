import { canJoin } from './can-join';
import { pick } from './pick';
import type { RandomGenerator } from './rng';

const LINKING_VOWELS = Object.freeze(['a', 'e', 'i', 'o', 'u']);

const LINKING_CONSONANTS = Object.freeze(['l', 'n', 'r']);

const QU_LINKING_VOWELS = Object.freeze(['a', 'e', 'i', 'o']);

const QU_LINKING_BRIDGES = Object.freeze([
  'al',
  'an',
  'ar',
  'el',
  'en',
  'er',
  'il',
  'in',
  'ir',
  'ol',
  'on',
  'or',
]);

const isVowel = (char: string): boolean => 'aeiou'.includes(char);

const linkPool = (word: string, segment: string): readonly string[] => {
  const firstChar = segment[0];
  if (word.endsWith('qu')) return isVowel(firstChar) ? QU_LINKING_BRIDGES : QU_LINKING_VOWELS;
  const lastChar = word[word.length - 1];
  return isVowel(lastChar) && isVowel(firstChar) ? LINKING_CONSONANTS : LINKING_VOWELS;
};

export const joinSegments = (
  segmentChoices: readonly (readonly string[])[],
  rng: RandomGenerator,
): readonly [string, RandomGenerator] =>
  segmentChoices.reduce<readonly [string, RandomGenerator]>(
    ([word, state], choices) => {
      const [segment, next] = pick(choices)(state);
      if (canJoin(word, segment)) return [word + segment, next] as const;
      const [link, after] = pick(linkPool(word, segment))(next);
      return [word + link + segment, after] as const;
    },
    ['', rng] as const,
  );
