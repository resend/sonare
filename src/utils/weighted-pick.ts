import type { RandomGenerator } from './rng';

export function weightedPick<T>(
  arr: readonly T[],
  weights: readonly number[],
  rng: RandomGenerator,
): readonly [T, RandomGenerator] {
  const total = weights.reduce((a, b) => a + b, 0);
  const [r, next] = rng.next();
  const target = r * total;

  function findIndex(index: number, accumulated: number): number {
    if (index >= arr.length) return arr.length - 1;
    const newAccumulated = accumulated + weights[index];
    return newAccumulated >= target ? index : findIndex(index + 1, newAccumulated);
  }

  return [arr[findIndex(0, 0)], next];
}
