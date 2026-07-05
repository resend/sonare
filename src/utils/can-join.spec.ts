import { describe, expect, it } from 'vitest';
import { canJoin } from './can-join';

describe('canJoin', () => {
  it('allows joining onto an empty left segment', () => {
    expect(canJoin('', 'kra')).toBe(true);
    expect(canJoin('', 'a')).toBe(true);
  });

  it('allows joining an empty right segment', () => {
    expect(canJoin('mor', '')).toBe(true);
  });

  it('rejects illegal consonant clusters at word start', () => {
    expect(canJoin('t', 'kra')).toBe(false);
    expect(canJoin('th', 'drel')).toBe(false);
    expect(canJoin('sh', 'sa')).toBe(false);
    expect(canJoin('ch', 'xa')).toBe(false);
    expect(canJoin('z', 'fi')).toBe(false);
    expect(canJoin('n', 'na')).toBe(false);
  });

  it('accepts legal consonant clusters at word start', () => {
    expect(canJoin('t', 'ra')).toBe(true);
    expect(canJoin('th', 'ren')).toBe(true);
    expect(canJoin('s', 'la')).toBe(true);
    expect(canJoin('c', 'ra')).toBe(true);
    expect(canJoin('ph', 'ra')).toBe(true);
  });

  it('rejects illegal consonant clusters mid-word', () => {
    expect(canJoin('morauz', 'gri')).toBe(false);
    expect(canJoin('velas', 'yan')).toBe(false);
    expect(canJoin('fenax', 'ka')).toBe(false);
  });

  it('accepts legal consonant clusters mid-word', () => {
    expect(canJoin('vel', 'ka')).toBe(true);
    expect(canJoin('bron', 'drel')).toBe(true);
    expect(canJoin('morauz', 'za')).toBe(true);
    expect(canJoin('fenax', 'ta')).toBe(true);
    expect(canJoin('velan', 'yan')).toBe(true);
  });

  it('rejects vowel seams that create a run of three or more vowels', () => {
    expect(canJoin('velau', 'ilo')).toBe(false);
    expect(canJoin('minea', 'oro')).toBe(false);
    expect(canJoin('lunia', 'ei')).toBe(false);
  });

  it('accepts vowel seams that keep vowel runs at two', () => {
    expect(canJoin('vela', 'ilo')).toBe(true);
    expect(canJoin('min', 'oro')).toBe(true);
    expect(canJoin('feno', 'une')).toBe(true);
  });

  it('rejects un-English double vowels at the seam', () => {
    expect(canJoin('vela', 'ava')).toBe(false);
    expect(canJoin('mini', 'ilo')).toBe(false);
    expect(canJoin('lunu', 'ulo')).toBe(false);
  });

  it('requires a single vowel after qu', () => {
    expect(canJoin('qu', 'ara')).toBe(true);
    expect(canJoin('qu', 'a')).toBe(true);
    expect(canJoin('qu', 'kra')).toBe(false);
    expect(canJoin('qu', 'ee')).toBe(false);
    expect(canJoin('velaqu', 'e')).toBe(true);
    expect(canJoin('velaqu', 'ta')).toBe(false);
  });

  it('accepts consonant-vowel and vowel-consonant seams', () => {
    expect(canJoin('vel', 'ara')).toBe(true);
    expect(canJoin('vela', 'kra')).toBe(true);
  });
});
