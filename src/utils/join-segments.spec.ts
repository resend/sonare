import { describe, expect, it } from 'vitest';
import { joinSegments } from './join-segments';
import { createRng } from './rng';

const sampleJoins = (choices: readonly (readonly string[])[], count: number): readonly string[] =>
  Array.from({ length: count }, (_, i) => {
    const [result] = joinSegments(choices, createRng(i));
    return result;
  });

describe('joinSegments', () => {
  it('concatenates one segment from each choice list', () => {
    const rng = createRng(42);
    const [result] = joinSegments([['vel'], ['a'], ['ka']], rng);

    expect(result).toBe('velaka');
  });

  it('returns an empty string for no choice lists', () => {
    const rng = createRng(42);
    const [result, finalRng] = joinSegments([], rng);

    expect(result).toBe('');
    expect(finalRng).toBe(rng);
  });

  it('joins legal seams without inserting anything', () => {
    const results = sampleJoins([['t'], ['ra']], 20);

    expect(new Set(results)).toEqual(new Set(['tra']));
  });

  it('repairs illegal consonant seams with a linking vowel', () => {
    const results = sampleJoins([['t'], ['kra']], 200);

    expect(new Set(results)).toEqual(new Set(['takra', 'tekra', 'tikra', 'tokra', 'tukra']));
  });

  it('repairs digraph collisions with a linking vowel', () => {
    const results = sampleJoins([['th'], ['drel']], 200);

    expect(new Set(results)).toEqual(
      new Set(['thadrel', 'thedrel', 'thidrel', 'thodrel', 'thudrel']),
    );
  });

  it('repairs vowel pileups with a linking consonant', () => {
    const results = sampleJoins([['velau'], ['ilo']], 200);

    expect(new Set(results)).toEqual(new Set(['velaulilo', 'velaunilo', 'velaurilo']));
  });

  it('repairs un-English double vowels with a linking consonant', () => {
    const results = sampleJoins([['vela'], ['ava']], 200);

    expect(new Set(results)).toEqual(new Set(['velalava', 'velanava', 'velarava']));
  });

  it('repairs consonants after qu with a linking vowel that is not u', () => {
    const results = sampleJoins([['qu'], ['kra']], 200);

    expect(new Set(results)).toEqual(new Set(['quakra', 'quekra', 'quikra', 'quokra']));
  });

  it('repairs vowel pileups after qu with a vowel-consonant bridge', () => {
    const results = sampleJoins([['qu'], ['ee']], 400);
    const bridged = /^qu[aeio][lnr]ee$/;

    expect(results.filter((result) => !bridged.test(result))).toEqual([]);
  });

  it('never produces a vowel run of three or more', () => {
    const choices = [
      ['qu', 'vel', 't'],
      ['a', 'ea', 'oo'],
      ['ara', 'kra', 'ilo'],
    ];

    expect(sampleJoins(choices, 500).filter((result) => /[aeiou]{3,}/.test(result))).toEqual([]);
  });

  it('is deterministic with the same seed', () => {
    const choices = [
      ['vel', 't', 'th'],
      ['a', 'ea'],
      ['kra', 'ara'],
    ];

    const [result1] = joinSegments(choices, createRng(777));
    const [result2] = joinSegments(choices, createRng(777));

    expect(result1).toBe(result2);
  });

  it('returns a new RNG state after picking', () => {
    const rng = createRng(100);
    const [, nextRng] = joinSegments([['ba'], ['ne']], rng);

    expect(nextRng).toBeDefined();
    expect(nextRng).not.toBe(rng);
  });
});
