import { describe, expect, it } from 'vitest';
import { createRng } from './rng';

describe('rng', () => {
  describe('createRng', () => {
    it('produces values between 0 and 1', () => {
      const rng = createRng(12345);
      const [val1] = rng.next();
      const [val2] = rng.next();
      const [val3] = rng.next();

      expect(val1).toBeGreaterThanOrEqual(0);
      expect(val1).toBeLessThan(1);
      expect(val2).toBeGreaterThanOrEqual(0);
      expect(val2).toBeLessThan(1);
      expect(val3).toBeGreaterThanOrEqual(0);
      expect(val3).toBeLessThan(1);
    });

    it('is deterministic with same seed', () => {
      const rng1 = createRng(42);
      const rng2 = createRng(42);

      const [val1a, next1a] = rng1.next();
      const [val1b, next1b] = rng2.next();

      expect(val1a).toBe(val1b);

      const [val2a] = next1a.next();
      const [val2b] = next1b.next();

      expect(val2a).toBe(val2b);
    });

    it('produces different values for different seeds', () => {
      const rng1 = createRng(100);
      const rng2 = createRng(200);

      const [val1] = rng1.next();
      const [val2] = rng2.next();

      expect(val1).not.toBe(val2);
    });

    it('returns a new generator state with each next call', () => {
      const rng = createRng(999);
      const [val1, next1] = rng.next();
      const [val2, next2] = next1.next();
      const [val3] = next2.next();

      expect(val1).not.toBe(val2);
      expect(val2).not.toBe(val3);
      expect(val1).not.toBe(val3);
    });

    it('produces a sequence of values', () => {
      const rng = createRng(777);
      const values: number[] = [];
      let current = rng;

      for (let i = 0; i < 10; i++) {
        const [val, next] = current.next();
        values.push(val);
        current = next;
      }

      // All values should be unique (very high probability)
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(10);
    });

    it('has reasonable distribution properties', () => {
      const rng = createRng(555);
      let current = rng;
      const samples = 10000;
      let countBelow05 = 0;

      for (let i = 0; i < samples; i++) {
        const [val, next] = current.next();
        if (val < 0.5) countBelow05++;
        current = next;
      }

      // Should be roughly 50% below 0.5 (within 5% tolerance)
      const ratio = countBelow05 / samples;
      expect(ratio).toBeGreaterThan(0.45);
      expect(ratio).toBeLessThan(0.55);
    });

    it('handles seed value of 0', () => {
      const rng = createRng(0);
      const [val] = rng.next();

      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    });

    it('handles large seed values', () => {
      const rng = createRng(2147483647); // Max 32-bit signed int
      const [val] = rng.next();

      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    });
  });
});
