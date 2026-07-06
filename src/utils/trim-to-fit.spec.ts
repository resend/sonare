import { describe, expect, it } from 'vitest';
import { FINAL_CLUSTERS } from './clusters';
import { trimToFit } from './trim-to-fit';

const hasIllegalEnding = (word: string): boolean => {
  if (/[jqwhv]$/.test(word)) return true;
  const run = word.match(/[^aeiou]+$/)?.[0] ?? '';
  return run.length >= 2 && !FINAL_CLUSTERS.has(run);
};

describe('trim-to-fit', () => {
  describe('trimToFit', () => {
    it('returns the word unchanged when within max length', () => {
      expect(trimToFit('velora', 10)).toBe('velora');
    });

    it('returns the word unchanged when exactly at max length', () => {
      expect(trimToFit('velorakine', 10)).toBe('velorakine');
    });

    it('keeps a blunt cut when the prefix already ends legally', () => {
      expect(trimToFit('kalimentosa', 10)).toBe('kalimentos');
    });

    it('backs off to the last legal boundary instead of cutting blindly', () => {
      expect(trimToFit('verylongstring', 10)).toBe('verylon');
    });

    it('backs off past a consonant cluster the cut would split', () => {
      expect(trimToFit('eukronoitrenier', 10)).toBe('eukronoit');
    });

    it('backs off past an illegal final letter', () => {
      expect(trimToFit('caloontuevro', 10)).toBe('caloontue');
    });

    it('never leaves a naked q when the cut lands inside qu', () => {
      expect(trimToFit('lunaipixaquene', 10)).toBe('lunaipixa');
    });

    it('never ends the result with qu', () => {
      expect(trimToFit('velaquene', 6)).toBe('vela');
    });

    it('produces only legal endings across trimmed lengths', () => {
      const word = 'garaihondrelakine';
      const offenders = Array.from({ length: word.length - 3 }, (_, index) =>
        trimToFit(word, index + 3),
      ).filter(hasIllegalEnding);

      expect(offenders).toEqual([]);
    });

    it('falls back to a plain slice when no prefix ends legally', () => {
      expect(trimToFit('whanere', 2)).toBe('wh');
    });
  });
});
