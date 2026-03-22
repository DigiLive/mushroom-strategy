import { deepClone } from './auxiliaries';

/**
 * Log levels for the debug logger.
 *
 * - Off:   Logging is disabled.
 * - Debug: Diagnostic information that can be helpful for troubleshooting and debugging.
 * - Info:  General information about the status of the system
 * - Warn:  Signal for potential issues that are not necessarily a critical error.
 * - Error: Significant problems that happened in the system.
 * - Fatal: severe conditions that cause the system to terminate or operate in a significantly degraded state.
 */
export enum DebugLevel {
  Off = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
}

// noinspection JSUnusedGlobalSymbols
/**
 * Individually exported log level constants.
 *
 * @see DebugLevel
 */
export const {
  Off: lvlOff,
  Debug: lvlDebug,
  Info: lvlInfo,
  Warn: lvlWarn,
  Error: lvlError,
  Fatal: lvlFatal,
} = DebugLevel;

/**
 * The current global log level.
 *
 * Only messages with a level less than or equal to this will be logged.
 *
 * @default DebugLevel.Off
 */
let currentLevel: DebugLevel = DebugLevel.Fatal;

/**
 * Extracts the name of the function or method that called the logger from a stack trace string.
 *
 * Handles both Chrome and Firefox stack trace formats:
 * - Chrome: "at ClassName.methodName (url:line:column)"
 * - Firefox: "methodName@url:line:column"
 *
 * Returns the full caller (including class, if available), or "unknown" if not found.
 *
 * @param stack - The stack trace string, typically from new Error().stack
 * @returns The caller's function/method name (with class if available), or "unknown"
 */
function getCallerName(stack?: string): string {
  if (!stack) {
    return 'unknown function';
  }

  // Filter out empty lines and the logMessage itself to find the true caller
  const caller = stack
    .split('\n')
    .filter(Boolean)
    .map(parseStackLine)
    .find((name) => name !== null && name !== 'logMessage');

  return caller ?? 'unknown function';
}

/**
 * Extracts a caller name from a single stack trace line.
 *
 * @param {string} line The raw stack trace line.
 * @returns {string|null} The function name or null if not found.
 */
function parseStackLine(line: string): string | null {
  // Firefox/Safari: "functionName@url" or "@url"
  if (line.includes('@')) {
    return line.split('@')[0] || 'anonymous';
  }

  // Chrome/Edge/Node: "at functionName (url)"
  const chromeMatch = line.match(/at ([^( ]+)/);
  return chromeMatch ? chromeMatch[1] : null;
}

/**
 * Sets the global log level.
 *
 * @param {DebugLevel} level - The maximum level to log.
 * @see DebugLevel
 */
export function setDebugLevel(level: DebugLevel) {
  currentLevel = level;
}

/**
 * Logs a message in the console at the specified level if allowed by the current global log level.
 *
 * Only messages with a level less than or equal to the currentLevel are logged.
 *
 * @param {DebugLevel} level - The severity of the message.
 * @param {string} message - The message to log.
 * @param {unknown[]} [details] - Optional extra details (e.g., error object).
 *
 * @throws {Error} After logging, if the level is `lvlError` or `lvlFatal`.
 *
 * @remarks
 * It might be required to throw an additional Error after logging with `lvlError ` or `lvlFatal` to satisfy the
 * TypeScript compiler.
 */
export function logMessage(level: DebugLevel, message: string, ...details: unknown[]): void {
  if (currentLevel === DebugLevel.Off || level > currentLevel) {
    return;
  }

  const frontEndMessage: string = 'Mushroom Strategy - An error occurred. Check the console (F12) for details.';
  const prefix = `[${DebugLevel[level].toUpperCase()}]`;
  const safeDetails = details.map(deepClone);
  const caller = `[at ${getCallerName(new Error().stack)}]`;

  switch (level) {
    case DebugLevel.Debug:
      console.debug(`${prefix}${caller} ${message}`, ...safeDetails);
      break;
    case DebugLevel.Info:
      console.info(`${prefix}${caller} ${message}`, ...safeDetails);
      break;
    case DebugLevel.Warn:
      console.warn(`${prefix}${caller} ${message}`, ...safeDetails);
      break;
    case DebugLevel.Error:
      console.error(`${prefix}${caller} ${message}`, ...safeDetails);
      throw frontEndMessage;
    case DebugLevel.Fatal:
      console.error(`${prefix}${caller} ${message}`, ...safeDetails);
      alert?.(`${prefix} ${message}`);
      throw frontEndMessage;
  }
}
