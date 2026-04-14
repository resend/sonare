import { describe, expect, it } from 'vitest';
import { CODAS, NUCLEI, ONSETS, TAILS } from './phonemes';

describe('phoneme arrays', () => {
  it.each([
    ['ONSETS', ONSETS],
    ['NUCLEI', NUCLEI],
    ['CODAS', CODAS],
    ['TAILS', TAILS],
  ])('%s contains no duplicates', (_, arr) => {
    expect(new Set(arr).size).toBe(arr.length);
  });
});
