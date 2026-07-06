import { describe, expect, it } from 'vitest';
import { PATTERNS, type Pattern } from './pattern';
import { PATTERN_LENGTH_STATS } from './pattern-length-stats';
import { createRng } from './rng';
import { selectPattern } from './select-pattern';

const samplePatterns = (min: number, max: number, count: number): readonly Pattern[] =>
  Array.from({ length: count }, (_, index) => {
    const [pattern] = selectPattern(min, max, createRng(index + 1));
    return pattern;
  });

describe('select-pattern', () => {
  describe('selectPattern', () => {
    it('returns a known pattern', () => {
      const [pattern] = selectPattern(6, 10, createRng(42));
      expect(PATTERNS).toContain(pattern);
    });

    it('returns a new RNG state', () => {
      const rng = createRng(100);
      const [, nextRng] = selectPattern(6, 10, rng);

      expect(nextRng).toBeDefined();
      expect(nextRng).not.toBe(rng);
    });

    it('is deterministic with same RNG seed', () => {
      const [pattern1] = selectPattern(6, 10, createRng(777));
      const [pattern2] = selectPattern(6, 10, createRng(777));

      expect(pattern1).toBe(pattern2);
    });

    it('never picks patterns that overshoot the range on average', () => {
      const offenders = samplePatterns(6, 10, 2000).filter(
        (pattern) => PATTERN_LENGTH_STATS[pattern].mean > 11,
      );

      expect(offenders).toEqual([]);
    });

    it('never picks long patterns for short ranges', () => {
      const offenders = samplePatterns(4, 6, 2000).filter(
        (pattern) => PATTERN_LENGTH_STATS[pattern].mean > 7,
      );

      expect(offenders).toEqual([]);
    });

    it('picks long patterns for long ranges', () => {
      const offenders = samplePatterns(10, 15, 2000).filter(
        (pattern) => PATTERN_LENGTH_STATS[pattern].mean < 9,
      );

      expect(offenders).toEqual([]);
    });

    it('offers variety within the default range', () => {
      const distinct = new Set(samplePatterns(6, 10, 2000));
      expect(distinct.size).toBeGreaterThanOrEqual(5);
    });

    it('falls back to all patterns when no expected length can fit', () => {
      const [pattern] = selectPattern(1, 1, createRng(42));
      expect(PATTERNS).toContain(pattern);
    });

    it('stays deterministic after the candidate cache evicts entries', () => {
      const [before] = selectPattern(6, 10, createRng(42));
      const flood = Array.from({ length: 300 }, (_, index) => {
        const [pattern] = selectPattern(index + 1, index + 2, createRng(index));
        return pattern;
      });
      const [after] = selectPattern(6, 10, createRng(42));

      expect(flood.every((pattern) => PATTERNS.includes(pattern))).toBe(true);
      expect(after).toBe(before);
    });
  });
});
