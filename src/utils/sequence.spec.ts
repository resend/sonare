import { describe, expect, it } from 'vitest';
import { createRng, type RandomGenerator } from './rng';
import { sequence } from './sequence';

describe('sequence', () => {
  it('executes functions in order', () => {
    const fn1 = (rng: RandomGenerator) => ['a', rng] as const;
    const fn2 = (rng: RandomGenerator) => ['b', rng] as const;
    const fn3 = (rng: RandomGenerator) => ['c', rng] as const;

    const rng = createRng(42);
    const [result] = sequence([fn1, fn2, fn3], rng);

    expect(result).toBe('abc');
  });

  it('concatenates strings from all functions', () => {
    const fn1 = (rng: RandomGenerator) => ['hello', rng] as const;
    const fn2 = (rng: RandomGenerator) => [' ', rng] as const;
    const fn3 = (rng: RandomGenerator) => ['world', rng] as const;

    const rng = createRng(100);
    const [result] = sequence([fn1, fn2, fn3], rng);

    expect(result).toBe('hello world');
  });

  it('threads RNG state through sequence', () => {
    let callCount = 0;
    const fn1 = (rng: RandomGenerator) => {
      callCount++;
      const [val, next] = rng.next();
      return [`${val}`, next] as const;
    };
    const fn2 = (rng: RandomGenerator) => {
      callCount++;
      const [val, next] = rng.next();
      return [`-${val}`, next] as const;
    };

    const rng = createRng(777);
    const [result, finalRng] = sequence([fn1, fn2], rng);

    expect(callCount).toBe(2);
    expect(result).toMatch(/^0\.\d+-0\.\d+$/);
    expect(finalRng).toBeDefined();
  });

  it('returns final RNG state', () => {
    const fn1 = (rng: RandomGenerator) => {
      const [, next] = rng.next();
      return ['x', next] as const;
    };
    const fn2 = (rng: RandomGenerator) => {
      const [, next] = rng.next();
      return ['y', next] as const;
    };

    const rng = createRng(555);
    const [, finalRng] = sequence([fn1, fn2], rng);

    // Should be able to continue using the RNG
    const [val] = finalRng.next();
    expect(val).toBeGreaterThanOrEqual(0);
    expect(val).toBeLessThan(1);
  });

  it('handles empty sequence', () => {
    const rng = createRng(999);
    const [result, finalRng] = sequence([], rng);

    expect(result).toBe('');
    expect(finalRng).toBe(rng);
  });

  it('handles single function', () => {
    const fn = (rng: RandomGenerator) => ['single', rng] as const;
    const rng = createRng(321);
    const [result] = sequence([fn], rng);

    expect(result).toBe('single');
  });

  it('is deterministic with same seed', () => {
    const fn1 = (rng: RandomGenerator) => {
      const [val, next] = rng.next();
      return [`${Math.floor(val * 10)}`, next] as const;
    };
    const fn2 = (rng: RandomGenerator) => {
      const [val, next] = rng.next();
      return [`${Math.floor(val * 10)}`, next] as const;
    };

    const rng1 = createRng(888);
    const rng2 = createRng(888);

    const [result1] = sequence([fn1, fn2], rng1);
    const [result2] = sequence([fn1, fn2], rng2);

    expect(result1).toBe(result2);
  });

  it('works with functions that generate different length strings', () => {
    const fn1 = (rng: RandomGenerator) => ['a', rng] as const;
    const fn2 = (rng: RandomGenerator) => ['bb', rng] as const;
    const fn3 = (rng: RandomGenerator) => ['ccc', rng] as const;
    const fn4 = (rng: RandomGenerator) => ['dddd', rng] as const;

    const rng = createRng(444);
    const [result] = sequence([fn1, fn2, fn3, fn4], rng);

    expect(result).toBe('abbcccdddd');
    expect(result.length).toBe(10);
  });

  it('maintains function order with many functions', () => {
    const fns = Array.from(
      { length: 10 },
      (_, i) => (rng: RandomGenerator) => [`${i}`, rng] as const,
    );

    const rng = createRng(1234);
    const [result] = sequence(fns, rng);

    expect(result).toBe('0123456789');
  });

  it('properly passes state between functions', () => {
    const states: number[] = [];

    const fn1 = (rng: RandomGenerator) => {
      const [val, next] = rng.next();
      states.push(val);
      return ['a', next] as const;
    };
    const fn2 = (rng: RandomGenerator) => {
      const [val, next] = rng.next();
      states.push(val);
      return ['b', next] as const;
    };
    const fn3 = (rng: RandomGenerator) => {
      const [val, next] = rng.next();
      states.push(val);
      return ['c', next] as const;
    };

    const rng = createRng(666);
    sequence([fn1, fn2, fn3], rng);

    // All three functions should have been called with different RNG states
    expect(states.length).toBe(3);
    expect(states[0]).not.toBe(states[1]);
    expect(states[1]).not.toBe(states[2]);
  });
});
