import { describe, expect, it } from 'vitest';
import { FINAL_CLUSTERS, INITIAL_CLUSTERS } from './clusters';
import { generateName } from './generator';
import { buildPattern } from './pattern';
import { createRng } from './rng';
import { selectPattern } from './select-pattern';
import { normalize } from './string';

describe('generator', () => {
  describe('generateName', () => {
    it('generates a name within length bounds', () => {
      const rng = createRng(42);
      const config = { minLength: 6, maxLength: 10 };
      const [name] = generateName(rng, config);

      expect(name.length).toBeGreaterThanOrEqual(6);
      expect(name.length).toBeLessThanOrEqual(10);
    });

    it('returns a new RNG state', () => {
      const rng = createRng(100);
      const config = { minLength: 5, maxLength: 15 };
      const [, nextRng] = generateName(rng, config);

      expect(nextRng).toBeDefined();
      expect(nextRng).not.toBe(rng);
    });

    it('is deterministic with same RNG seed', () => {
      const rng1 = createRng(777);
      const rng2 = createRng(777);
      const config = { minLength: 6, maxLength: 10 };

      const [name1] = generateName(rng1, config);
      const [name2] = generateName(rng2, config);

      expect(name1).toBe(name2);
    });

    it('produces different names with different RNG seeds', () => {
      const rng1 = createRng(111);
      const rng2 = createRng(222);
      const config = { minLength: 6, maxLength: 10 };

      const [name1] = generateName(rng1, config);
      const [name2] = generateName(rng2, config);

      expect(name1).not.toBe(name2);
    });

    it('generates only lowercase letters', () => {
      const rng = createRng(555);
      const config = { minLength: 6, maxLength: 10 };

      for (let i = 0; i < 100; i++) {
        const [name] = generateName(rng, config);
        expect(/^[a-z]+$/.test(name)).toBe(true);
      }
    });

    it('respects minimum length', () => {
      const rng = createRng(999);
      const config = { minLength: 8, maxLength: 12 };
      const [name] = generateName(rng, config);

      expect(name.length).toBeGreaterThanOrEqual(8);
    });

    it('respects maximum length', () => {
      const rng = createRng(888);
      const config = { minLength: 5, maxLength: 8 };
      const [name] = generateName(rng, config);

      expect(name.length).toBeLessThanOrEqual(8);
    });

    it('handles small length ranges', () => {
      const rng = createRng(321);
      const config = { minLength: 4, maxLength: 6 };
      const [name] = generateName(rng, config);

      expect(name.length).toBeGreaterThanOrEqual(4);
      expect(name.length).toBeLessThanOrEqual(6);
    });

    it('handles large length ranges', () => {
      const rng = createRng(654);
      const config = { minLength: 10, maxLength: 20 };
      const [name] = generateName(rng, config);

      expect(name.length).toBeGreaterThanOrEqual(10);
      expect(name.length).toBeLessThanOrEqual(20);
    });

    it('handles equal min and max length', () => {
      const rng = createRng(444);
      const config = { minLength: 10, maxLength: 10 };
      const [name] = generateName(rng, config);

      expect(name.length).toBe(10);
    });

    it('generates diverse names', () => {
      const config = { minLength: 6, maxLength: 10 };
      const names = new Set<string>();

      for (let i = 0; i < 100; i++) {
        const rng = createRng(i);
        const [name] = generateName(rng, config);
        names.add(name);
      }

      expect(names.size).toBeGreaterThan(90);
    });

    it('produces consistent output for sequential RNG states', () => {
      const rng = createRng(12345);
      const config = { minLength: 6, maxLength: 10 };

      const [name1, next1] = generateName(rng, config);
      const [name2, next2] = generateName(next1, config);
      const [name3] = generateName(next2, config);

      expect(name1).toBeDefined();
      expect(name2).toBeDefined();
      expect(name3).toBeDefined();
      expect(name1).not.toBe(name2);
      expect(name2).not.toBe(name3);
    });

    it('handles very short length requirements', () => {
      const rng = createRng(7777);
      const config = { minLength: 3, maxLength: 5 };
      const [name] = generateName(rng, config);

      expect(name.length).toBeGreaterThanOrEqual(3);
      expect(name.length).toBeLessThanOrEqual(5);
    });

    it('normalizes output', () => {
      const rng = createRng(5555);
      const config = { minLength: 6, maxLength: 10 };
      const [name] = generateName(rng, config);

      expect(/^[a-z]+$/.test(name)).toBe(true);
      expect(name).toBe(name.toLowerCase());
    });

    it('never starts a name with an illegal consonant cluster', () => {
      const config = { minLength: 6, maxLength: 10 };
      const offenders = Array.from({ length: 5000 }, (_, i) => {
        const [name] = generateName(createRng(i), config);
        return name;
      }).filter((name) => {
        const run = name.match(/^[^aeiou]+/)?.[0] ?? '';
        return run.length >= 2 && !INITIAL_CLUSTERS.has(run);
      });

      expect(offenders).toEqual([]);
    });

    it('generates high-quality unique names', () => {
      const config = { minLength: 6, maxLength: 10 };
      const names = new Set<string>();

      for (let i = 0; i < 10000; i++) {
        const rng = createRng(i);
        const [name] = generateName(rng, config);
        names.add(name);
      }

      expect(names.size).toBeGreaterThan(9500);
    });

    it('never ends a name with an illegal cluster or naked q', () => {
      const config = { minLength: 6, maxLength: 10 };
      const offenders = Array.from({ length: 20000 }, (_, i) => {
        const [name] = generateName(createRng(i), config);
        return name;
      }).filter((name) => {
        const run = name.match(/[^aeiou]+$/)?.[0] ?? '';
        return (run.length >= 2 && !FINAL_CLUSTERS.has(run)) || /[jqwhv]$/.test(name);
      });

      expect(offenders).toEqual([]);
    });

    it('rarely picks patterns that overshoot maxLength', () => {
      const config = { minLength: 6, maxLength: 10 };
      const overshoots = Array.from({ length: 20000 }, (_, i) => {
        const [pattern, rng1] = selectPattern(config.minLength, config.maxLength, createRng(i));
        const [base] = buildPattern(pattern, rng1);
        return normalize(base).length;
      }).filter((length) => length > config.maxLength);

      expect(overshoots.length / 20000).toBeLessThan(0.1);
    });

    it('does not pile words up at exactly maxLength', () => {
      const config = { minLength: 6, maxLength: 10 };
      const atMax = Array.from({ length: 20000 }, (_, i) => {
        const [name] = generateName(createRng(i), config);
        return name;
      }).filter((name) => name.length === config.maxLength);

      expect(atMax.length / 20000).toBeLessThan(0.3);
    });
  });
});
