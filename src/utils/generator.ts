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
  const [shouldAddNumber, rng3] = rng2.next();

  const baseWord = padToLength(normalize(base), cfg.minLength, cfg.maxLength, rng3);

  if (shouldAddNumber < 0.98 && baseWord.length < cfg.maxLength) {
    const [numVal, rng4] = rng3.next();
    const number = Math.floor(numVal * 10000000);
    const wordWithNumber = `${baseWord}${number}`;
    return [wordWithNumber.slice(0, cfg.maxLength), rng4];
  }

  return [baseWord, rng3];
}
