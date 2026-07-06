import { PATTERNS, type Pattern, WEIGHTS } from './pattern';
import { PATTERN_LENGTH_STATS } from './pattern-length-stats';
import type { RandomGenerator } from './rng';
import { weightedPick } from './weighted-pick';

const NEARNESS_TOLERANCE = 1;
const RICHNESS_EXPONENT = 2.5;
const OVERSHOOT_PENALTY_EXPONENT = 10;

const distanceToRange = (value: number, lower: number, upper: number): number =>
  value < lower ? lower - value : value > upper ? value - upper : 0;

const probabilityAtMost = (pattern: Pattern, bound: number): number => {
  const { cumulative } = PATTERN_LENGTH_STATS[pattern];
  return bound < 0 ? 0 : cumulative[Math.min(bound, cumulative.length - 1)];
};

const fitWeight = (pattern: Pattern, index: number, minLength: number, maxLength: number): number =>
  WEIGHTS[index] *
  Math.max(1, PATTERN_LENGTH_STATS[pattern].mean - minLength + 1) ** RICHNESS_EXPONENT *
  probabilityAtMost(pattern, maxLength) ** OVERSHOOT_PENALTY_EXPONENT;

export const selectPattern = (
  minLength: number,
  maxLength: number,
  rng: RandomGenerator,
): readonly [Pattern, RandomGenerator] => {
  const distances = PATTERNS.map((pattern) =>
    distanceToRange(PATTERN_LENGTH_STATS[pattern].mean, minLength, maxLength),
  );
  const nearest = Math.min(...distances);
  const candidates = PATTERNS.map((pattern, index) => ({
    pattern,
    weight: fitWeight(pattern, index, minLength, maxLength),
    distance: distances[index],
  })).filter(({ distance, weight }) => distance <= nearest + NEARNESS_TOLERANCE && weight > 0);
  return candidates.length > 0
    ? weightedPick(
        candidates.map(({ pattern }) => pattern),
        candidates.map(({ weight }) => weight),
        rng,
      )
    : weightedPick(PATTERNS, WEIGHTS, rng);
};
