import { CODAS, NUCLEI, ONSETS, TAILS } from './phonemes';
import { pick } from './pick';
import type { RandomGenerator } from './rng';
import { sequence } from './sequence';

export type Pattern =
  | 'ON+T'
  | 'ON+NU+T'
  | 'CV'
  | 'CVC'
  | 'CVT'
  | 'CVCV'
  | 'CVCT'
  | 'CVCVC'
  | 'VCVCV'
  | 'CVCVT'
  | 'CVCTV'
  | 'CVCVCT'
  | 'VCVCVC'
  | 'CVCVCV';

export const PATTERNS: readonly Pattern[] = [
  'ON+T',
  'ON+NU+T',
  'CV',
  'CVC',
  'CVT',
  'CVCV',
  'CVCT',
  'CVCVC',
  'VCVCV',
  'CVCVT',
  'CVCTV',
  'CVCVCT',
  'VCVCVC',
  'CVCVCV',
];

export const WEIGHTS: readonly number[] = [4, 3, 1, 1, 2, 3, 3, 2, 2, 2, 2, 2, 2, 2];

export function buildPattern(
  pattern: Pattern,
  rng: RandomGenerator,
): readonly [string, RandomGenerator] {
  switch (pattern) {
    case 'ON+T':
      return sequence([pick(ONSETS), pick(TAILS)], rng);
    case 'ON+NU+T':
      return sequence([pick(ONSETS), pick(NUCLEI), pick(TAILS)], rng);
    case 'CV':
      return sequence([pick(ONSETS), pick(NUCLEI)], rng);
    case 'CVC':
      return sequence([pick(ONSETS), pick(NUCLEI), pick(CODAS)], rng);
    case 'CVT':
      return sequence([pick(ONSETS), pick(NUCLEI), pick(TAILS)], rng);
    case 'CVCV':
      return sequence([pick(ONSETS), pick(NUCLEI), pick(ONSETS), pick(NUCLEI)], rng);
    case 'CVCT':
      return sequence([pick(ONSETS), pick(NUCLEI), pick(CODAS), pick(TAILS)], rng);
    case 'CVCVC':
      return sequence([pick(ONSETS), pick(NUCLEI), pick(ONSETS), pick(NUCLEI), pick(CODAS)], rng);
    case 'VCVCV':
      return sequence([pick(NUCLEI), pick(ONSETS), pick(NUCLEI), pick(ONSETS), pick(NUCLEI)], rng);
    case 'CVCVT':
      return sequence([pick(ONSETS), pick(NUCLEI), pick(ONSETS), pick(NUCLEI), pick(TAILS)], rng);
    case 'CVCTV':
      return sequence([pick(ONSETS), pick(NUCLEI), pick(CODAS), pick(TAILS), pick(NUCLEI)], rng);
    case 'CVCVCT':
      return sequence(
        [pick(ONSETS), pick(NUCLEI), pick(ONSETS), pick(NUCLEI), pick(CODAS), pick(TAILS)],
        rng,
      );
    case 'VCVCVC':
      return sequence(
        [pick(NUCLEI), pick(ONSETS), pick(NUCLEI), pick(ONSETS), pick(NUCLEI), pick(CODAS)],
        rng,
      );
    case 'CVCVCV':
      return sequence(
        [pick(ONSETS), pick(NUCLEI), pick(ONSETS), pick(NUCLEI), pick(ONSETS), pick(NUCLEI)],
        rng,
      );
  }
}
