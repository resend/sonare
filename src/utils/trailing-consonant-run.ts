export const trailingConsonantRun = (s: string): string => s.match(/[^aeiou]+$/)?.[0] ?? '';
