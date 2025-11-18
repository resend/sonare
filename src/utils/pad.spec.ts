import { describe, expect, it } from 'vitest';
import { padToLength } from './pad';
import { createRng } from './rng';

describe('pad', () => {
  describe('padToLength', () => {
    it('pads short strings to minimum length', () => {
      const input = 'ab';
      const rng = createRng(42);
      const result = padToLength(input, 6, 10, rng);

      expect(result.length).toBeGreaterThanOrEqual(6);
      expect(result.length).toBeLessThanOrEqual(10);
      expect(result.startsWith('ab')).toBe(true);
    });

    it('does not modify strings within min-max range', () => {
      const input = 'testword';
      const rng = createRng(100);
      const result = padToLength(input, 6, 10, rng);

      expect(result).toBe('testword');
      expect(result.length).toBe(8);
    });

    it('truncates strings longer than max length', () => {
      const input = 'verylongstring';
      const rng = createRng(777);
      const result = padToLength(input, 5, 10, rng);

      expect(result.length).toBe(10);
      expect(result).toBe('verylongst');
    });

    it('respects exact minimum length', () => {
      const input = 'abc';
      const rng = createRng(555);
      const result = padToLength(input, 5, 5, rng);

      expect(result.length).toBe(5);
      expect(result.startsWith('abc')).toBe(true);
    });

    it('returns string at min length when string equals min', () => {
      const input = 'exact';
      const rng = createRng(999);
      const result = padToLength(input, 5, 10, rng);

      expect(result).toBe('exact');
    });

    it('handles empty string', () => {
      const input = '';
      const rng = createRng(321);
      const result = padToLength(input, 5, 10, rng);

      expect(result.length).toBeGreaterThanOrEqual(5);
      expect(result.length).toBeLessThanOrEqual(10);
    });

    it('is deterministic with same RNG seed', () => {
      const input = 'test';
      const rng1 = createRng(888);
      const rng2 = createRng(888);

      const result1 = padToLength(input, 8, 12, rng1);
      const result2 = padToLength(input, 8, 12, rng2);

      expect(result1).toBe(result2);
    });

    it('produces different results with different RNG seeds', () => {
      const input = 'test';
      const rng1 = createRng(111);
      const rng2 = createRng(222);

      const result1 = padToLength(input, 10, 15, rng1);
      const result2 = padToLength(input, 10, 15, rng2);

      // Very likely to be different
      expect(result1).not.toBe(result2);
    });

    it('pads with valid syllables', () => {
      const input = 'a';
      const rng = createRng(444);
      const result = padToLength(input, 10, 20, rng);

      expect(result.length).toBeGreaterThanOrEqual(10);
      expect(result.startsWith('a')).toBe(true);
      // Result should only contain lowercase letters
      expect(/^[a-z]+$/.test(result)).toBe(true);
    });

    it('handles min equals max', () => {
      const input = 'short';
      const rng = createRng(666);
      const result = padToLength(input, 10, 10, rng);

      expect(result.length).toBe(10);
      expect(result.startsWith('short')).toBe(true);
    });

    it('handles very small min and max', () => {
      const input = 'test';
      const rng = createRng(222);
      const result = padToLength(input, 2, 3, rng);

      expect(result.length).toBe(3);
      expect(result).toBe('tes');
    });

    it('handles large min and max values', () => {
      const input = 'start';
      const rng = createRng(1111);
      const result = padToLength(input, 50, 60, rng);

      expect(result.length).toBeGreaterThanOrEqual(50);
      expect(result.length).toBeLessThanOrEqual(60);
      expect(result.startsWith('start')).toBe(true);
    });

    it('pads single character to longer string', () => {
      const input = 'x';
      const rng = createRng(7777);
      const result = padToLength(input, 15, 20, rng);

      expect(result.length).toBeGreaterThanOrEqual(15);
      expect(result.length).toBeLessThanOrEqual(20);
      expect(result.startsWith('x')).toBe(true);
    });

    it('handles string exactly at max length', () => {
      const input = 'exactten!!';
      const rng = createRng(3333);
      const result = padToLength(input, 5, 10, rng);

      expect(result.length).toBe(10);
      expect(result).toBe('exactten!!');
    });

    it('consistently produces valid output', () => {
      const rng = createRng(5555);
      for (let i = 0; i < 100; i++) {
        const input = 'test';
        const result = padToLength(input, 8, 12, rng);
        expect(result.length).toBeGreaterThanOrEqual(8);
        expect(result.length).toBeLessThanOrEqual(12);
        expect(result.startsWith('test')).toBe(true);
      }
    });
  });
});
