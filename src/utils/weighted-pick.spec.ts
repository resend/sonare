import { describe, expect, it } from 'vitest';
import { createRng } from './rng';
import { weightedPick } from './weighted-pick';

describe('weighted-pick', () => {
  describe('weightedPick', () => {
    it('returns an item from the array', () => {
      const arr = ['a', 'b', 'c'];
      const weights = [1, 1, 1];
      const rng = createRng(42);
      const [item] = weightedPick(arr, weights, rng);

      expect(arr).toContain(item);
    });

    it('returns a new RNG state', () => {
      const arr = ['x', 'y'];
      const weights = [1, 1];
      const rng = createRng(100);
      const [, nextRng] = weightedPick(arr, weights, rng);

      expect(nextRng).toBeDefined();
      expect(nextRng).not.toBe(rng);
    });

    it('is deterministic with same RNG state', () => {
      const arr = ['apple', 'banana', 'cherry'];
      const weights = [2, 3, 1];
      const rng1 = createRng(777);
      const rng2 = createRng(777);

      const [item1] = weightedPick(arr, weights, rng1);
      const [item2] = weightedPick(arr, weights, rng2);

      expect(item1).toBe(item2);
    });

    it('respects weight distribution', () => {
      const arr = ['low', 'high'];
      const weights = [1, 9];
      let rng = createRng(12345);
      const counts: Record<string, number> = { low: 0, high: 0 };

      for (let i = 0; i < 10000; i++) {
        const [item, next] = weightedPick(arr, weights, rng);
        counts[item]++;
        rng = next;
      }

      expect(counts.high / 10000).toBeGreaterThan(0.85);
      expect(counts.high / 10000).toBeLessThan(0.95);
      expect(counts.low / 10000).toBeGreaterThan(0.05);
      expect(counts.low / 10000).toBeLessThan(0.15);
    });

    it('handles equal weights', () => {
      const arr = ['a', 'b', 'c', 'd'];
      const weights = [1, 1, 1, 1];
      let rng = createRng(555);
      const counts: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 };

      for (let i = 0; i < 4000; i++) {
        const [item, next] = weightedPick(arr, weights, rng);
        counts[item]++;
        rng = next;
      }

      expect(counts.a).toBeGreaterThan(800);
      expect(counts.a).toBeLessThan(1200);
      expect(counts.b).toBeGreaterThan(800);
      expect(counts.b).toBeLessThan(1200);
      expect(counts.c).toBeGreaterThan(800);
      expect(counts.c).toBeLessThan(1200);
      expect(counts.d).toBeGreaterThan(800);
      expect(counts.d).toBeLessThan(1200);
    });

    it('handles zero weight (item should rarely be picked)', () => {
      const arr = ['never', 'always'];
      const weights = [0, 10];
      let rng = createRng(999);
      const counts: Record<string, number> = { never: 0, always: 0 };

      for (let i = 0; i < 1000; i++) {
        const [item, next] = weightedPick(arr, weights, rng);
        counts[item]++;
        rng = next;
      }

      expect(counts.always).toBeGreaterThan(990);
    });

    it('works with single item', () => {
      const arr = ['only'];
      const weights = [1];
      const rng = createRng(321);
      const [item] = weightedPick(arr, weights, rng);

      expect(item).toBe('only');
    });

    it('handles different weight magnitudes', () => {
      const arr = ['tiny', 'huge'];
      const weights = [1, 1000];
      let rng = createRng(777);
      const counts: Record<string, number> = { tiny: 0, huge: 0 };

      for (let i = 0; i < 10000; i++) {
        const [item, next] = weightedPick(arr, weights, rng);
        counts[item]++;
        rng = next;
      }

      expect(counts.huge).toBeGreaterThan(9900);
      expect(counts.tiny).toBeLessThan(100);
    });

    it('handles fractional weights', () => {
      const arr = ['a', 'b'];
      const weights = [0.3, 0.7];
      let rng = createRng(444);
      const counts: Record<string, number> = { a: 0, b: 0 };

      for (let i = 0; i < 10000; i++) {
        const [item, next] = weightedPick(arr, weights, rng);
        counts[item]++;
        rng = next;
      }

      expect(counts.a / 10000).toBeGreaterThan(0.25);
      expect(counts.a / 10000).toBeLessThan(0.35);
      expect(counts.b / 10000).toBeGreaterThan(0.65);
      expect(counts.b / 10000).toBeLessThan(0.75);
    });

    it('covers all non-zero weighted items eventually', () => {
      const arr = ['a', 'b', 'c', 'd', 'e'];
      const weights = [1, 2, 3, 4, 5];
      let rng = createRng(888);
      const picked = new Set<string>();

      for (let i = 0; i < 500; i++) {
        const [item, next] = weightedPick(arr, weights, rng);
        picked.add(item);
        rng = next;
      }

      expect(picked.size).toBe(5);
    });

    it('works with large arrays and complex weights', () => {
      const arr = Array.from({ length: 100 }, (_, i) => `item${i}`);
      const weights = Array.from({ length: 100 }, (_, i) => i + 1);
      const rng = createRng(1111);
      const [item] = weightedPick(arr, weights, rng);

      expect(arr).toContain(item);
      expect(item).toMatch(/^item\d+$/);
    });
  });
});
