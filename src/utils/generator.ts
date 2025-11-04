import { padToLength } from './pad';
import { buildPattern, PATTERNS, WEIGHTS } from './pattern';
import type { RandomGenerator } from './rng';
import { normalize } from './string';
import { weightedPick } from './weighted-pick';

interface Config {
  readonly minLength: number;
  readonly maxLength: number;
}

export function generateName(
  rng: RandomGenerator,
  cfg: Config,
): readonly [string, RandomGenerator] {
  const [pattern, rng1] = weightedPick(PATTERNS, WEIGHTS, rng);
  const [base, rng2] = buildPattern(pattern, rng1);
  const baseWord = padToLength(normalize(base), cfg.minLength, cfg.maxLength, rng2);

  return [baseWord, rng2];
}
