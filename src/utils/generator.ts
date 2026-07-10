import { isPronounceable } from './is-pronounceable';
import { padToLength } from './pad';
import { buildPattern } from './pattern';
import type { RandomGenerator } from './rng';
import { selectPattern } from './select-pattern';
import { normalize } from './string';

interface Config {
  readonly minLength: number;
  readonly maxLength: number;
}

const MAX_GENERATION_ATTEMPTS = 16;

const attemptName = (rng: RandomGenerator, cfg: Config): readonly [string, RandomGenerator] => {
  const [pattern, rng1] = selectPattern(cfg.minLength, cfg.maxLength, rng);
  const [base, rng2] = buildPattern(pattern, rng1);
  const baseWord = padToLength(normalize(base), cfg.minLength, cfg.maxLength, rng2);

  return [baseWord, rng2];
};

const retryUntilPronounceable = (
  rng: RandomGenerator,
  cfg: Config,
  attemptsLeft: number,
): readonly [string, RandomGenerator] => {
  const [word, next] = attemptName(rng, cfg);
  if (isPronounceable(word) || attemptsLeft <= 1) return [word, next];
  return retryUntilPronounceable(next, cfg, attemptsLeft - 1);
};

export const generateName = (
  rng: RandomGenerator,
  cfg: Config,
): readonly [string, RandomGenerator] => retryUntilPronounceable(rng, cfg, MAX_GENERATION_ATTEMPTS);
