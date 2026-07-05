import { joinSegments } from './join-segments';
import { CODAS, NUCLEI, ONSETS, RIMES, TAILS } from './phonemes';
import type { RandomGenerator } from './rng';

export type Pattern =
  | 'ON+T'
  | 'ON+NU+T'
  | 'CV'
  | 'CR'
  | 'CVC'
  | 'CVT'
  | 'CVCV'
  | 'CVCT'
  | 'CVCR'
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
  'CR',
  'CVC',
  'CVT',
  'CVCV',
  'CVCT',
  'CVCR',
  'CVCVC',
  'VCVCV',
  'CVCVT',
  'CVCTV',
  'CVCVCT',
  'VCVCVC',
  'CVCVCV',
];

export const WEIGHTS: readonly number[] = [4, 3, 1, 1, 1, 2, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2];

const PATTERN_SEGMENTS: Readonly<Record<Pattern, readonly (readonly string[])[]>> = {
  'ON+T': [ONSETS, TAILS],
  'ON+NU+T': [ONSETS, NUCLEI, TAILS],
  CV: [ONSETS, NUCLEI],
  CR: [ONSETS, RIMES],
  CVC: [ONSETS, NUCLEI, CODAS],
  CVT: [ONSETS, NUCLEI, TAILS],
  CVCV: [ONSETS, NUCLEI, ONSETS, NUCLEI],
  CVCT: [ONSETS, NUCLEI, CODAS, TAILS],
  CVCR: [ONSETS, NUCLEI, ONSETS, RIMES],
  CVCVC: [ONSETS, NUCLEI, ONSETS, NUCLEI, CODAS],
  VCVCV: [NUCLEI, ONSETS, NUCLEI, ONSETS, NUCLEI],
  CVCVT: [ONSETS, NUCLEI, ONSETS, NUCLEI, TAILS],
  CVCTV: [ONSETS, NUCLEI, CODAS, TAILS, NUCLEI],
  CVCVCT: [ONSETS, NUCLEI, ONSETS, NUCLEI, CODAS, TAILS],
  VCVCVC: [NUCLEI, ONSETS, NUCLEI, ONSETS, NUCLEI, CODAS],
  CVCVCV: [ONSETS, NUCLEI, ONSETS, NUCLEI, ONSETS, NUCLEI],
};

export const buildPattern = (
  pattern: Pattern,
  rng: RandomGenerator,
): readonly [string, RandomGenerator] => joinSegments(PATTERN_SEGMENTS[pattern], rng);
