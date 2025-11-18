import { describe, expect, it } from 'vitest';
import { normalize, trimLabel } from './string';

describe('string', () => {
  describe('normalize', () => {
    it('converts to lowercase', () => {
      expect(normalize('HELLO')).toBe('hello');
      expect(normalize('MixedCase')).toBe('mixedcase');
      expect(normalize('ABC123')).toBe('abc123');
    });

    it('removes accents and diacritics', () => {
      expect(normalize('café')).toBe('cafe');
      expect(normalize('résumé')).toBe('resume');
      expect(normalize('naïve')).toBe('naive');
      expect(normalize('Zürich')).toBe('zurich');
    });

    it('keeps only alphanumeric characters', () => {
      expect(normalize('hello-world')).toBe('helloworld');
      expect(normalize('hello_world')).toBe('helloworld');
      expect(normalize('hello world')).toBe('helloworld');
      expect(normalize('hello!world')).toBe('helloworld');
    });

    it('removes special characters', () => {
      expect(normalize('test@#$%^&*()')).toBe('test');
      expect(normalize('!@#$%')).toBe('');
      expect(normalize('a-b_c.d')).toBe('abcd');
    });

    it('keeps numbers', () => {
      expect(normalize('test123')).toBe('test123');
      expect(normalize('123')).toBe('123');
      expect(normalize('test-123')).toBe('test123');
    });

    it('handles empty string', () => {
      expect(normalize('')).toBe('');
    });

    it('handles strings with only special characters', () => {
      expect(normalize('!@#$%^&*()')).toBe('');
      expect(normalize('---')).toBe('');
      expect(normalize('   ')).toBe('');
    });

    it('handles unicode characters', () => {
      expect(normalize('こんにちは')).toBe('');
      expect(normalize('🚀🌟')).toBe('');
      expect(normalize('test🚀test')).toBe('testtest');
    });

    it('combines multiple normalization rules', () => {
      expect(normalize('Café-Résumé_123!')).toBe('caferesume123');
      expect(normalize('HELLO-world_2023')).toBe('helloworld2023');
      expect(normalize('Test@Email.com')).toBe('testemailcom');
    });

    it('handles complex accent removal', () => {
      expect(normalize('à è ì ò ù')).toBe('aeiou');
      expect(normalize('â ê î ô û')).toBe('aeiou');
      expect(normalize('ä ë ï ö ü')).toBe('aeiou');
      expect(normalize('ñ ç')).toBe('nc');
    });
  });

  describe('trimLabel', () => {
    it('does not modify strings under 63 characters', () => {
      const short = 'short';
      expect(trimLabel(short)).toBe('short');
      expect(trimLabel(short).length).toBe(5);
    });

    it('does not modify strings exactly 63 characters', () => {
      const exactly63 = 'a'.repeat(63);
      expect(trimLabel(exactly63)).toBe(exactly63);
      expect(trimLabel(exactly63).length).toBe(63);
    });

    it('trims strings longer than 63 characters', () => {
      const long = 'a'.repeat(100);
      const trimmed = trimLabel(long);
      expect(trimmed.length).toBe(63);
      expect(trimmed).toBe('a'.repeat(63));
    });

    it('trims to exactly 63 characters', () => {
      const long = 'abcdefghijklmnopqrstuvwxyz'.repeat(10);
      const trimmed = trimLabel(long);
      expect(trimmed.length).toBe(63);
    });

    it('preserves content at the start of string', () => {
      const input = 'important' + 'x'.repeat(100);
      const trimmed = trimLabel(input);
      expect(trimmed.startsWith('important')).toBe(true);
      expect(trimmed.length).toBe(63);
    });

    it('handles empty string', () => {
      expect(trimLabel('')).toBe('');
    });

    it('handles single character', () => {
      expect(trimLabel('a')).toBe('a');
    });

    it('handles strings with special characters', () => {
      const special = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`'.repeat(3);
      const trimmed = trimLabel(special);
      expect(trimmed.length).toBe(63);
    });

    it('handles unicode characters', () => {
      const unicode = '🚀'.repeat(100);
      const trimmed = trimLabel(unicode);
      expect(trimmed.length).toBeLessThanOrEqual(63);
    });

    it('works with mixed content', () => {
      const mixed = 'Test-123_ABC' + 'padding'.repeat(20);
      const trimmed = trimLabel(mixed);
      expect(trimmed.length).toBe(63);
      expect(trimmed.startsWith('Test-123_ABC')).toBe(true);
    });
  });
});
