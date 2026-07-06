import { describe, expect, it } from 'vitest';
import { INITIAL_CLUSTERS, MEDIAL_CLUSTERS } from './clusters';

describe('cluster whitelists', () => {
  it.each([
    ['INITIAL_CLUSTERS', INITIAL_CLUSTERS],
    ['MEDIAL_CLUSTERS', MEDIAL_CLUSTERS],
  ])('%s contains only lowercase consonant sequences', (_, clusters) => {
    expect([...clusters].filter((cluster) => !/^[b-df-hj-np-tv-z]+$/.test(cluster))).toEqual([]);
  });

  it.each([
    ['INITIAL_CLUSTERS', INITIAL_CLUSTERS],
    ['MEDIAL_CLUSTERS', MEDIAL_CLUSTERS],
  ])('%s contains only clusters of two or three consonants', (_, clusters) => {
    expect([...clusters].filter((cluster) => cluster.length < 2 || cluster.length > 3)).toEqual([]);
  });

  it('INITIAL_CLUSTERS excludes clusters English never starts words with', () => {
    expect(INITIAL_CLUSTERS.has('tk')).toBe(false);
    expect(INITIAL_CLUSTERS.has('zf')).toBe(false);
    expect(INITIAL_CLUSTERS.has('vr')).toBe(false);
    expect(INITIAL_CLUSTERS.has('nn')).toBe(false);
  });

  it('MEDIAL_CLUSTERS excludes clusters English never uses mid-word', () => {
    expect(MEDIAL_CLUSTERS.has('zg')).toBe(false);
    expect(MEDIAL_CLUSTERS.has('zgr')).toBe(false);
    expect(MEDIAL_CLUSTERS.has('xk')).toBe(false);
  });
});
