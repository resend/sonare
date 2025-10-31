import { bench, describe } from 'vitest';
import { sonare } from '../src/sonare';

describe('sonare benchmarks', () => {
  bench(
    'generate single word',
    () => {
      sonare();
    },
    { iterations: 100000 },
  );

  bench(
    'generate single word with custom options',
    () => {
      sonare({ minLength: 8, maxLength: 12 });
    },
    { iterations: 100000 },
  );

  bench(
    'generate 100 words',
    () => {
      Array.from({ length: 100 }, () => sonare());
    },
    { iterations: 1000 },
  );

  bench(
    'generate 1k words',
    () => {
      Array.from({ length: 1000 }, () => sonare());
    },
    { iterations: 100 },
  );

  bench(
    'generate 10k words',
    () => {
      Array.from({ length: 10000 }, () => sonare());
    },
    { iterations: 10 },
  );

  bench(
    'generate 100k words',
    () => {
      Array.from({ length: 100000 }, () => sonare());
    },
    { iterations: 5 },
  );
});

