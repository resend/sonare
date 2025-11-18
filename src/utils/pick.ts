import type { RandomGenerator } from './rng';

export function pick<T>(
  arr: readonly T[],
): (rng: RandomGenerator) => readonly [T, RandomGenerator] {
  return (rng: RandomGenerator): readonly [T, RandomGenerator] => {
    const [val, next] = rng.next();
    return [arr[Math.floor(val * arr.length)], next];
  };
}
