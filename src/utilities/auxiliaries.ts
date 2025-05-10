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
 * Get the keys of nested objects by its property value.
 *
 * @param {Object<string, any>} object An object of objects.
 * @param {string|number} property The name of the property to evaluate.
 * @param {*} value The value which the property should match.
 *
 * @return {string[]} An array with keys.
 */
export function getObjectKeysByPropertyValue(
  object: Record<string, unknown>,
  property: string,
  value: unknown,
): string[] {
  const keys: string[] = [];

  for (const key of Object.keys(object)) {
    if (object[key] && (object[key] as Record<string, unknown>)[property] === value) {
      keys.push(key);
    }
  }

  return keys;
}

/**
 * Filters out null values from an array.
 *
 * @template T The type of the array elements.
 * @param {Array<T | null>} arr The array to filter.
 * @returns {Array<T>} An array containing the non-null elements.
 */
export function filterNonNullValues<T>(arr: (T | null)[]): T[] {
  return arr.filter((item): item is T => item !== null);
}
