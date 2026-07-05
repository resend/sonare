import { INITIAL_CLUSTERS, MEDIAL_CLUSTERS } from './clusters';

const BANNED_VOWEL_PAIRS: ReadonlySet<string> = new Set(['aa', 'ii', 'uu']);

const isVowel = (char: string): boolean => 'aeiou'.includes(char);

const leadingVowelRun = (s: string): string => s.match(/^[aeiou]+/)?.[0] ?? '';

const trailingVowelRun = (s: string): string => s.match(/[aeiou]+$/)?.[0] ?? '';

const leadingConsonantRun = (s: string): string => s.match(/^[^aeiou]+/)?.[0] ?? '';

const trailingConsonantRun = (s: string): string => s.match(/[^aeiou]+$/)?.[0] ?? '';

export const canJoin = (left: string, right: string): boolean => {
  if (left === '' || right === '') return true;
  const lastChar = left[left.length - 1];
  const firstChar = right[0];
  if (BANNED_VOWEL_PAIRS.has(`${lastChar}${firstChar}`)) return false;
  if (left.endsWith('qu') && !isVowel(firstChar)) return false;
  if (isVowel(lastChar) && isVowel(firstChar)) {
    return trailingVowelRun(left).length + leadingVowelRun(right).length <= 2;
  }
  if (isVowel(lastChar) || isVowel(firstChar)) return true;
  const leftRun = trailingConsonantRun(left);
  const seamCluster = leftRun + leadingConsonantRun(right);
  const seamAtWordStart = leftRun.length === left.length;
  return seamAtWordStart ? INITIAL_CLUSTERS.has(seamCluster) : MEDIAL_CLUSTERS.has(seamCluster);
};
