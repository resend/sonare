import { describe, expect, it } from 'vitest';
import { pick } from './pick';
import { createRng } from './rng';

describe('pick', () => {
  it('returns an item from the array', () => {
    const arr = ['a', 'b', 'c', 'd', 'e'];
    const rng = createRng(42);
    const pickFn = pick(arr);
    const [item] = pickFn(rng);

    expect(arr).toContain(item);
  });

  it('returns a new RNG state', () => {
    const arr = ['x', 'y', 'z'];
    const rng = createRng(100);
    const pickFn = pick(arr);
    const [, nextRng] = pickFn(rng);

    expect(nextRng).toBeDefined();
    expect(nextRng).not.toBe(rng);
  });

  it('is deterministic with same RNG state', () => {
    const arr = ['apple', 'banana', 'cherry', 'date'];
    const rng1 = createRng(777);
    const rng2 = createRng(777);
    const pickFn = pick(arr);

    const [item1] = pickFn(rng1);
    const [item2] = pickFn(rng2);

    expect(item1).toBe(item2);
  });

  it('produces different items with different RNG states', () => {
    const arr = ['one', 'two', 'three', 'four', 'five'];
    const rng = createRng(123);
    const pickFn = pick(arr);

    const [item1, next1] = pickFn(rng);
    const [item2, next2] = pickFn(next1);
    const [item3] = pickFn(next2);

    // Very unlikely all three are the same
    const unique = new Set([item1, item2, item3]);
    expect(unique.size).toBeGreaterThan(1);
  });

  it('works with single-item array', () => {
    const arr = ['only'];
    const rng = createRng(999);
    const pickFn = pick(arr);
    const [item] = pickFn(rng);

    expect(item).toBe('only');
  });

  it('works with different data types', () => {
    const numbers = [1, 2, 3, 4, 5];
    const rng = createRng(555);
    const pickFn = pick(numbers);
    const [num] = pickFn(rng);

    expect(numbers).toContain(num);
    expect(typeof num).toBe('number');
  });

  it('covers all items over many picks', () => {
    const arr = ['a', 'b', 'c'];
    let rng = createRng(42);
    const pickFn = pick(arr);
    const picked = new Set<string>();

    for (let i = 0; i < 100; i++) {
      const [item, next] = pickFn(rng);
      picked.add(item);
      rng = next;
    }

    // Should have picked all items at some point
    expect(picked.size).toBe(3);
    expect(picked.has('a')).toBe(true);
    expect(picked.has('b')).toBe(true);
    expect(picked.has('c')).toBe(true);
  });

  it('has reasonable distribution', () => {
    const arr = ['x', 'y'];
    let rng = createRng(12345);
    const pickFn = pick(arr);
    const counts: Record<string, number> = { x: 0, y: 0 };

    for (let i = 0; i < 1000; i++) {
      const [item, next] = pickFn(rng);
      counts[item]++;
      rng = next;
    }

    // Should be roughly 50/50 (within 10% tolerance)
    expect(counts.x).toBeGreaterThan(400);
    expect(counts.x).toBeLessThan(600);
    expect(counts.y).toBeGreaterThan(400);
    expect(counts.y).toBeLessThan(600);
  });

  it('works with large arrays', () => {
    const largeArr = Array.from({ length: 1000 }, (_, i) => i);
    const rng = createRng(9999);
    const pickFn = pick(largeArr);
    const [item] = pickFn(rng);

    expect(largeArr).toContain(item);
    expect(item).toBeGreaterThanOrEqual(0);
    expect(item).toBeLessThan(1000);
  });

  it('can be called multiple times with the same array', () => {
    const arr = ['red', 'green', 'blue'];
    const pickFn = pick(arr);
    const rng1 = createRng(111);
    const rng2 = createRng(222);

    const [item1] = pickFn(rng1);
    const [item2] = pickFn(rng2);

    expect(arr).toContain(item1);
    expect(arr).toContain(item2);
  });
});
