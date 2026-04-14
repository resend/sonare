export function validateLengths(min: number, max: number): void {
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
