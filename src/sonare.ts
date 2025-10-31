import { generateName } from './utils/generator';
import { hashSeed } from './utils/hash';
import { createRng } from './utils/rng';

export interface SonareOptions {
  readonly minLength?: number;
  readonly maxLength?: number;
}

const state = { counter: 0, lastTime: 0 };

export function sonare(options: SonareOptions = {}): string {
  const { minLength = 6, maxLength = 10 } = options;
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
