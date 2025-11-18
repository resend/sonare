import { pick } from './pick';
import type { RandomGenerator } from './rng';

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

export function padToLength(s: string, min: number, max: number, rng: RandomGenerator): string {
  function pad(current: string, state: RandomGenerator): string {
    if (current.length >= min) {
      return current.length > max ? current.slice(0, max) : current;
    }
    const [syll, next] = pick(PADDING_SYLLABLES)(state);
    return pad(current + syll, next);
  }
  return pad(s, rng);
}
