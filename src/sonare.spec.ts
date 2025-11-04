import { describe, expect, it } from 'vitest';
import { sonare } from './sonare';

describe('sonare', () => {
  it('generates a word', () => {
    const word = sonare();
    expect(word).toBeDefined();
    expect(typeof word).toBe('string');
    expect(word.length).toBeGreaterThan(0);
  });

  it('generates words with default length between 6 and 10', () => {
    const word = sonare();
    expect(word.length).toBeGreaterThanOrEqual(6);
    expect(word.length).toBeLessThanOrEqual(10);
  });

  it('generates words with custom minLength and maxLength', () => {
    const shortWord = sonare({ minLength: 4, maxLength: 6 });
    expect(shortWord.length).toBeGreaterThanOrEqual(4);
    expect(shortWord.length).toBeLessThanOrEqual(6);

    const longWord = sonare({ minLength: 10, maxLength: 15 });
    expect(longWord.length).toBeGreaterThanOrEqual(10);
    expect(longWord.length).toBeLessThanOrEqual(15);
  });

  it('generates words with only lowercase letters', () => {
    const words = Array.from({ length: 100 }, () => sonare());
    const allValid = words.every((word) => /^[a-z]+$/.test(word));
    expect(allValid).toBe(true);
  });

  it('generates unique words (high probability)', () => {
    const words = Array.from({ length: 1000 }, () => sonare());
    const uniqueWords = new Set(words);
    expect(uniqueWords.size).toBeGreaterThan(990);
  });

  it('generates 1M words with high uniqueness (>85%)', () => {
    const words = Array.from({ length: 1000000 }, () => sonare());
    const uniqueWords = new Set(words);
    expect(uniqueWords.size).toBeGreaterThan(850000);
  });
});
