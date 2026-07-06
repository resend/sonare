import { buildPattern, PATTERNS, type Pattern } from './pattern';
import { createRng } from './rng';

const SAMPLE_COUNT = 512;
const MAX_TRACKED_LENGTH = 40;

interface LengthStats {
  readonly mean: number;
  readonly cumulative: readonly number[];
}

const sampleLengths = (pattern: Pattern): readonly number[] =>
  Array.from({ length: SAMPLE_COUNT }, (_, index) => {
    const [word] = buildPattern(pattern, createRng(index + 1));
    return word.length;
  });

const statsFor = (pattern: Pattern): LengthStats => {
  const lengths = sampleLengths(pattern);
  return {
    mean: lengths.reduce((sum, length) => sum + length, 0) / lengths.length,
    cumulative: Array.from(
      { length: MAX_TRACKED_LENGTH + 1 },
      (_, bound) => lengths.filter((length) => length <= bound).length / lengths.length,
    ),
  };
};

export const PATTERN_LENGTH_STATS: Readonly<Record<Pattern, LengthStats>> = Object.freeze(
  Object.fromEntries(PATTERNS.map((pattern) => [pattern, statsFor(pattern)])),
) as Readonly<Record<Pattern, LengthStats>>;
