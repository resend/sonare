import { describe, expect, it } from 'vitest';
import { PATTERNS } from './pattern';
import { PATTERN_LENGTH_STATS } from './pattern-length-stats';

describe('pattern-length-stats', () => {
  describe('PATTERN_LENGTH_STATS', () => {
    it('has stats for every pattern', () => {
      expect(Object.keys(PATTERN_LENGTH_STATS).toSorted()).toEqual([...PATTERNS].toSorted());
    });

    it('has positive means for every pattern', () => {
      const offenders = PATTERNS.filter((pattern) => PATTERN_LENGTH_STATS[pattern].mean <= 0);
      expect(offenders).toEqual([]);
    });

    it('orders means by pattern complexity', () => {
      expect(PATTERN_LENGTH_STATS.CV.mean).toBeLessThan(PATTERN_LENGTH_STATS.CVCV.mean);
      expect(PATTERN_LENGTH_STATS.CVCV.mean).toBeLessThan(PATTERN_LENGTH_STATS.CVCVCV.mean);
    });

    it('has non-decreasing cumulative distributions from 0 to 1', () => {
      const offenders = PATTERNS.filter((pattern) => {
        const { cumulative } = PATTERN_LENGTH_STATS[pattern];
        const monotone = cumulative.every(
          (value, index) => index === 0 || value >= cumulative[index - 1],
        );
        return !monotone || cumulative[0] !== 0 || cumulative[cumulative.length - 1] !== 1;
      });

      expect(offenders).toEqual([]);
    });

    it('reports short patterns as fitting under small bounds', () => {
      expect(PATTERN_LENGTH_STATS.CV.cumulative[8]).toBe(1);
      expect(PATTERN_LENGTH_STATS.CVCVCV.cumulative[8]).toBeLessThan(0.5);
    });
  });
});
