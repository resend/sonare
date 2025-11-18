export function hashSeed(input: string): number {
  function hash(h: number, index: number): number {
    if (index >= input.length) {
      return h >>> 0;
    }
    const newHash = Math.imul(h ^ input.charCodeAt(index), 0x01000193);
    return hash(newHash, index + 1);
  }
  return hash(0x811c9dc5, 0);
}
