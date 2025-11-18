import type { RandomGenerator } from './rng';

export function sequence(
  fns: readonly ((rng: RandomGenerator) => readonly [string, RandomGenerator])[],
  rng: RandomGenerator,
): readonly [string, RandomGenerator] {
  return fns.reduce<readonly [string, RandomGenerator]>(
    ([acc, state], fn) => {
      const [s, next] = fn(state);
      return [acc + s, next] as const;
    },
    ['', rng] as readonly [string, RandomGenerator],
  );
}
