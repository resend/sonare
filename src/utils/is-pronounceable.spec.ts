import { describe, expect, it } from 'vitest';
import { isPronounceable } from './is-pronounceable';

describe('is-pronounceable', () => {
  describe('isPronounceable', () => {
    it('accepts simple pronounceable words', () => {
      expect(isPronounceable('veluna')).toBe(true);
      expect(isPronounceable('minecho')).toBe(true);
      expect(isPronounceable('quintar')).toBe(true);
      expect(isPronounceable('a')).toBe(true);
    });

    it('rejects words without any vowel', () => {
      expect(isPronounceable('brnt')).toBe(false);
      expect(isPronounceable('s')).toBe(false);
      expect(isPronounceable('')).toBe(false);
    });

    it('rejects vowel runs longer than two', () => {
      expect(isPronounceable('leao')).toBe(false);
      expect(isPronounceable('olkeeostuu')).toBe(false);
      expect(isPronounceable('leano')).toBe(true);
    });

    it('rejects illegal word-initial consonant runs', () => {
      expect(isPronounceable('thdrel')).toBe(false);
      expect(isPronounceable('shsope')).toBe(false);
      expect(isPronounceable('thrandel')).toBe(true);
    });

    it('rejects illegal medial consonant runs', () => {
      expect(isPronounceable('vezkora')).toBe(false);
      expect(isPronounceable('velandra')).toBe(true);
    });

    it('rejects illegal word-final consonant runs', () => {
      expect(isPronounceable('garaihondr')).toBe(false);
      expect(isPronounceable('velask')).toBe(false);
      expect(isPronounceable('velast')).toBe(true);
    });

    it('rejects q without a following u', () => {
      expect(isPronounceable('qanta')).toBe(false);
      expect(isPronounceable('soqa')).toBe(false);
      expect(isPronounceable('quanta')).toBe(true);
    });

    it('rejects illegal final letters', () => {
      expect(isPronounceable('velaj')).toBe(false);
      expect(isPronounceable('velow')).toBe(false);
      expect(isPronounceable('velah')).toBe(false);
      expect(isPronounceable('velav')).toBe(false);
      expect(isPronounceable('soq')).toBe(false);
    });

    it('rejects triple letters', () => {
      expect(isPronounceable('velaaa')).toBe(false);
      expect(isPronounceable('vellla')).toBe(false);
    });
  });
});
