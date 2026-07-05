import { describe, expect, it } from 'vitest';
import { CODAS, NUCLEI, ONSETS, RIMES, TAILS } from './phonemes';

describe('phoneme arrays', () => {
  it.each([
    ['ONSETS', ONSETS],
    ['NUCLEI', NUCLEI],
    ['CODAS', CODAS],
    ['TAILS', TAILS],
    ['RIMES', RIMES],
  ])('%s contains no duplicates', (_, arr) => {
    expect(new Set(arr).size).toBe(arr.length);
  });

  it('ONSETS contains only consonant-initial entries', () => {
    expect(ONSETS.filter((onset) => /^[aeiou]/.test(onset))).toEqual([]);
  });

  it('NUCLEI contains only vowel sequences', () => {
    expect(NUCLEI.filter((nucleus) => !/^[aeiou]+$/.test(nucleus))).toEqual([]);
  });

  it('NUCLEI excludes un-English double vowels', () => {
    expect(NUCLEI).not.toContain('aa');
    expect(NUCLEI).not.toContain('ii');
    expect(NUCLEI).not.toContain('uu');
  });

  it('RIMES contains only vowel-initial entries', () => {
    expect(RIMES.filter((rime) => !/^[aeiou]/.test(rime))).toEqual([]);
  });
});
