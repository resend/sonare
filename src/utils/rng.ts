export interface RandomGenerator {
  readonly next: () => readonly [number, RandomGenerator];
}

export function createRng(seed: number): RandomGenerator {
  function next(): readonly [number, RandomGenerator] {
    const t = (seed + 0x6d2b79f5) >>> 0;
    const x = Math.imul(t ^ (t >>> 15), 1 | t);
    const y = (x ^ (x >>> 7) ^ (x >>> 14)) >>> 0;
    const value = y / 4294967296;
    return [value, createRng(t)];
  }
  return { next };
}
