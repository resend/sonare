import { generateName } from './utils/generator';
import { hashSeed } from './utils/hash';
import { createRng } from './utils/rng';

export interface SonareOptions {
  readonly minLength?: number;
  readonly maxLength?: number;
}

const state = { counter: 0, lastTime: 0 };

function validateLengths(min: number, max: number): void {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new TypeError('minLength and maxLength must be finite numbers');
  }
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new TypeError('minLength and maxLength must be integers');
  }
  if (min < 1 || max < 1) {
    throw new RangeError('minLength and maxLength must be at least 1');
  }
  if (min > max) {
    throw new RangeError('minLength must be less than or equal to maxLength');
  }
  if (max > 256) {
    throw new RangeError('maxLength must be at most 256');
  }
}

export function sonare(options: SonareOptions = {}): string {
  const { minLength = 6, maxLength = 10 } = options;
  validateLengths(minLength, maxLength);
  const now = Date.now();

  if (now === state.lastTime) {
    state.counter += 1;
  } else {
    state.lastTime = now;
    state.counter = 0;
  }

  const seed = `${now}-${state.counter}-${Math.random()}`;
  const rng0 = createRng(hashSeed(seed));
  const [word] = generateName(rng0, { minLength, maxLength });
  return word;
}
