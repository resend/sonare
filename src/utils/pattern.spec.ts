import { describe, expect, it } from 'vitest';
import { buildPattern, PATTERNS, type Pattern, WEIGHTS } from './pattern';
import { createRng } from './rng';

describe('pattern', () => {
  describe('PATTERNS', () => {
    it('contains all expected pattern types', () => {
      expect(PATTERNS).toContain('ON+T');
      expect(PATTERNS).toContain('ON+NU+T');
      expect(PATTERNS).toContain('CV');
      expect(PATTERNS).toContain('CVC');
      expect(PATTERNS).toContain('CVT');
      expect(PATTERNS).toContain('CVCV');
      expect(PATTERNS).toContain('CVCT');
      expect(PATTERNS).toContain('CVCVC');
      expect(PATTERNS).toContain('VCVCV');
      expect(PATTERNS).toContain('CVCVT');
      expect(PATTERNS).toContain('CVCTV');
      expect(PATTERNS).toContain('CVCVCT');
      expect(PATTERNS).toContain('VCVCVC');
      expect(PATTERNS).toContain('CVCVCV');
    });

    it('has matching number of patterns and weights', () => {
      expect(PATTERNS.length).toBe(WEIGHTS.length);
    });
  });

  describe('WEIGHTS', () => {
    it('contains positive weights', () => {
      for (const weight of WEIGHTS) {
        expect(weight).toBeGreaterThan(0);
      }
    });

    it('has expected total weight', () => {
      const total = WEIGHTS.reduce((a, b) => a + b, 0);
      expect(total).toBe(31);
    });
  });

  describe('buildPattern', () => {
    it('returns a string for all pattern types', () => {
      const rng = createRng(42);
      for (const pattern of PATTERNS) {
        const [result] = buildPattern(pattern, rng);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      }
    });

    it('returns a new RNG state', () => {
      const rng = createRng(100);
      const [, nextRng] = buildPattern('CV', rng);

      expect(nextRng).toBeDefined();
      expect(nextRng).not.toBe(rng);
    });

    it('is deterministic with same RNG seed', () => {
      const rng1 = createRng(777);
      const rng2 = createRng(777);

      const [result1] = buildPattern('CVCV', rng1);
      const [result2] = buildPattern('CVCV', rng2);

      expect(result1).toBe(result2);
    });

    it('produces different results with different RNG seeds', () => {
      const rng1 = createRng(111);
      const rng2 = createRng(222);

      const [result1] = buildPattern('CVCV', rng1);
      const [result2] = buildPattern('CVCV', rng2);

      expect(result1).not.toBe(result2);
    });

    describe('pattern: ON+T', () => {
      it('generates valid output', () => {
        const rng = createRng(555);
        const [result] = buildPattern('ON+T', rng);

        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('pattern: ON+NU+T', () => {
      it('generates valid output', () => {
        const rng = createRng(555);
        const [result] = buildPattern('ON+NU+T', rng);

        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('pattern: CV', () => {
      it('generates valid output', () => {
        const rng = createRng(555);
        const [result] = buildPattern('CV', rng);

        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('pattern: CVC', () => {
      it('generates valid output', () => {
        const rng = createRng(555);
        const [result] = buildPattern('CVC', rng);

        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('pattern: CVT', () => {
      it('generates valid output', () => {
        const rng = createRng(555);
        const [result] = buildPattern('CVT', rng);

        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('pattern: CVCV', () => {
      it('generates valid output', () => {
        const rng = createRng(555);
        const [result] = buildPattern('CVCV', rng);

        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('pattern: CVCT', () => {
      it('generates valid output', () => {
        const rng = createRng(555);
        const [result] = buildPattern('CVCT', rng);

        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('pattern: CVCVC', () => {
      it('generates valid output', () => {
        const rng = createRng(555);
        const [result] = buildPattern('CVCVC', rng);

        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('pattern: VCVCV', () => {
      it('generates valid output', () => {
        const rng = createRng(555);
        const [result] = buildPattern('VCVCV', rng);

        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('pattern: CVCVT', () => {
      it('generates valid output', () => {
        const rng = createRng(555);
        const [result] = buildPattern('CVCVT', rng);

        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('pattern: CVCTV', () => {
      it('generates valid output', () => {
        const rng = createRng(555);
        const [result] = buildPattern('CVCTV', rng);

        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('pattern: CVCVCT', () => {
      it('generates valid output', () => {
        const rng = createRng(555);
        const [result] = buildPattern('CVCVCT', rng);

        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('pattern: VCVCVC', () => {
      it('generates valid output', () => {
        const rng = createRng(555);
        const [result] = buildPattern('VCVCVC', rng);

        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('pattern: CVCVCV', () => {
      it('generates valid output', () => {
        const rng = createRng(555);
        const [result] = buildPattern('CVCVCV', rng);

        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });

    it('generates varied output for same pattern', () => {
      const results = new Set<string>();
      for (let i = 0; i < 100; i++) {
        const rng = createRng(i);
        const [result] = buildPattern('CVCV', rng);
        results.add(result);
      }

      expect(results.size).toBeGreaterThan(50);
    });

    it('produces only lowercase letters', () => {
      const rng = createRng(999);
      for (const pattern of PATTERNS) {
        const [result] = buildPattern(pattern, rng);
        expect(/^[a-z]+$/.test(result)).toBe(true);
      }
    });

    it('handles all patterns consistently', () => {
      const patterns: Pattern[] = [
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

      const rng = createRng(888);
      for (const pattern of patterns) {
        const [result, nextRng] = buildPattern(pattern, rng);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
        expect(nextRng).toBeDefined();
      }
    });
  });
});
