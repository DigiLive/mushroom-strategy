/**
 * Sanitize a classname.
 *
 * The name is sanitized by capitalizing the first character of the name or after an underscore.
 * The underscores are removed.
 *
 * @param {string} className Name of the class to sanitize.
 */
export function sanitizeClassName(className: string): string {
  return className.replace(/^([a-z])|([-_][a-z])/g, (match) => match.toUpperCase().replace(/[-_]/g, ''));
}

/**
 * Creates a deep clone of the provided value.
 *
 * - It uses the native `structuredClone` if available (supports most built-in types, circular references, etc.).
 * - Falls back to `JSON.parse(JSON.stringify(obj))` for plain objects and arrays if `structuredClone` is unavailable
 *   or fails.
 *
 * @template T
 * @param {T} obj - The value to deep clone.
 * @returns {T} A deep clone of the input value, or the original value if cloning fails.
 */
export function deepClone<T>(obj: T): T {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(obj);
    } catch {
      // Ignore error: fallback to the next method
    }
  }

  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return obj;
  }
}

/**
 * Compares two values according to a sort direction.
 *
 * Comparison rules:
 * 1. `null` and `undefined` are ordered first and second respectively.
 * 2. Strings are compared using locale-aware comparison with numeric sorting.
 * 3. Numbers and booleans are compared naturally.
 * 4. Any other types are considered equal (i.e., do not affect sort order).
 *
 * Returns:
 * - A negative number if `a` should come **before** `b` in the specified `direction`.
 * - A positive number if `a` should come **after** `b` in the specified `direction`.
 * - `0` if `a` and `b` are considered equal for sorting.
 *
 * This implementation ensures a deterministic and stable sort for `Array.prototype.sort`.
 *
 * @param {unknown} a The first value.
 * @param {unknown} b The second value.
 * @param {'asc' | 'desc'} [direction='asc'] The sort direction.
 *
 * @returns {number} The comparison result.
 */
export function compareValues(a: unknown, b: unknown, direction: 'asc' | 'desc' = 'asc'): number {
  // Values are equal.
  if (a === b) return 0;

  const sortDirection = direction === 'asc' ? 1 : -1;

  // Handle null / undefined explicitly.
  if (a == null || b == null) {
    return (a == null ? -1 : 1) * sortDirection;
  }

  // Strings.
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }) * sortDirection;
  }

  // Numbers / booleans.
  const isNumeric = (val: unknown) => typeof val === 'number' || typeof val === 'boolean';

  if (isNumeric(a) && isNumeric(b)) {
    return (+a - +b) * sortDirection;
  }

  // All other types: treat as equal.
  return 0;
}

/**
 * Determines a sorting priority for a value.
 *
 * A helper function that prioritizes an object's property value for sorting purposes.
 *
 * Priority levels for the evaluated value:
 *   0. `-Infinity` (force to top)
 *   1. standard values (string, number, boolean).
 *   2. `null` or `undefined` (force to bottom).
 *   3. `+Infinity` (absolute bottom).
 *
 * @template V The type of the value.
 * @param {V | number | string} value The value to evaluate.
 * @returns {[number, V | number | string]} Tuple of [priority, comparable value].
 */
export function getSortPriority<V>(value: V | number | string): [number, V | number | string] {
  if (value === -Infinity) return [0, 0];
  if (value == null) return [2, 0];
  if (value === Infinity) return [3, 0];

  return [1, value];
}
