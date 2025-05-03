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
    return 'unknown';
  }

  const lines = stack.split('\n').filter(Boolean);

  // Find the first line that contains '@' and is not logMessage itself
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.includes('@') && !line.startsWith('logMessage')) {
      return line.split('@')[0] || 'anonymous';
    }
    // Fallback for anonymous functions
    if (line.startsWith('@')) {
      return 'anonymous function';
    }
  }

  // Chrome fallback
  for (let i = 1; i < lines.length; i++) {
    const match = lines[i].match(/at ([^( ]+)/);
    if (match && match[1] && match[1] !== 'logMessage') {
      return match[1];
    }
  }

  return 'unknown function';
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
 * It might be required to throw an additional Error after logging with `lvlError ` or `lvlFatal` to satify the
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
