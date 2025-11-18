import { describe, expect, it } from 'vitest';
import { hashSeed } from './hash';

describe('hash', () => {
  describe('hashSeed', () => {
    it('produces consistent output for same input', () => {
      const hash1 = hashSeed('test');
      const hash2 = hashSeed('test');
      const hash3 = hashSeed('test');

      expect(hash1).toBe(hash2);
      expect(hash2).toBe(hash3);
    });

    it('produces different hashes for different inputs', () => {
      const hash1 = hashSeed('test');
      const hash2 = hashSeed('test2');
      const hash3 = hashSeed('another');

      expect(hash1).not.toBe(hash2);
      expect(hash2).not.toBe(hash3);
      expect(hash1).not.toBe(hash3);
    });

    it('handles empty string', () => {
      const hash = hashSeed('');
      expect(typeof hash).toBe('number');
      expect(hash).toBeGreaterThanOrEqual(0);
    });

    it('handles single character strings', () => {
      const hashA = hashSeed('a');
      const hashB = hashSeed('b');

      expect(typeof hashA).toBe('number');
      expect(typeof hashB).toBe('number');
      expect(hashA).not.toBe(hashB);
    });

    it('handles special characters', () => {
      const hash1 = hashSeed('!@#$%^&*()');
      const hash2 = hashSeed('[]{}|\\');
      const hash3 = hashSeed('`~-_=+');

      expect(typeof hash1).toBe('number');
      expect(typeof hash2).toBe('number');
      expect(typeof hash3).toBe('number');
      expect(hash1).not.toBe(hash2);
    });

    it('handles unicode characters', () => {
      const hash1 = hashSeed('こんにちは');
      const hash2 = hashSeed('🚀🌟');
      const hash3 = hashSeed('café');

      expect(typeof hash1).toBe('number');
      expect(typeof hash2).toBe('number');
      expect(typeof hash3).toBe('number');
      expect(hash1).not.toBe(hash2);
      expect(hash2).not.toBe(hash3);
    });

    it('handles long strings', () => {
      const longString = 'a'.repeat(1000);
      const hash = hashSeed(longString);

      expect(typeof hash).toBe('number');
      expect(hash).toBeGreaterThanOrEqual(0);
    });

    it('produces different hashes for similar strings', () => {
      const hash1 = hashSeed('test');
      const hash2 = hashSeed('Test');
      const hash3 = hashSeed('test ');
      const hash4 = hashSeed(' test');

      expect(hash1).not.toBe(hash2);
      expect(hash1).not.toBe(hash3);
      expect(hash1).not.toBe(hash4);
    });

    it('returns a non-negative 32-bit integer', () => {
      const inputs = ['test', 'hello', '123', 'abc', ''];
      for (const input of inputs) {
        const hash = hashSeed(input);
        expect(hash).toBeGreaterThanOrEqual(0);
        expect(hash).toBeLessThanOrEqual(4294967295); // Max 32-bit unsigned int
        expect(Number.isInteger(hash)).toBe(true);
      }
    });

    it('has good distribution properties', () => {
      const hashes = new Set<number>();
      for (let i = 0; i < 1000; i++) {
        hashes.add(hashSeed(`string${i}`));
      }
      // Should have very high uniqueness
      expect(hashes.size).toBeGreaterThan(990);
    });
  });
});
