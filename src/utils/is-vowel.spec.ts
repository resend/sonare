import { describe, expect, it } from 'vitest';
import { isVowel } from './is-vowel';

describe('is-vowel', () => {
  describe('isVowel', () => {
    it('returns true for every vowel', () => {
      expect(['a', 'e', 'i', 'o', 'u'].filter(isVowel)).toEqual(['a', 'e', 'i', 'o', 'u']);
    });

    it('returns false for consonants', () => {
      expect(['b', 'q', 'w', 'y', 'z'].filter(isVowel)).toEqual([]);
    });

    it('returns false for the empty string', () => {
      expect(isVowel('')).toBe(false);
    });

    it('returns false for multi-character strings', () => {
      expect(isVowel('ae')).toBe(false);
      expect(isVowel('eio')).toBe(false);
    });
  });
});
