import { padToLength } from './pad';
import { buildPattern } from './pattern';
import type { RandomGenerator } from './rng';
import { selectPattern } from './select-pattern';
import { normalize } from './string';

interface Config {
  readonly minLength: number;
  readonly maxLength: number;
}

export function generateName(
  rng: RandomGenerator,
  cfg: Config,
): readonly [string, RandomGenerator] {
  const [pattern, rng1] = selectPattern(cfg.minLength, cfg.maxLength, rng);
  const [base, rng2] = buildPattern(pattern, rng1);
  const baseWord = padToLength(normalize(base), cfg.minLength, cfg.maxLength, rng2);

  return [baseWord, rng2];
}
