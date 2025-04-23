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
