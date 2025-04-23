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
let currentLevel: DebugLevel = DebugLevel.Off;

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
 * @throws {Error} After logging, if the level is `Fatal` or `Error`.
 */
export function logMessage(level: DebugLevel, message: string, ...details: unknown[]): void {
  if (currentLevel === DebugLevel.Off || level > currentLevel) {
    return;
  }

  const frontEndMessage: string = 'Mushroom Strategy - An error occurred. Check the console (F12) for details.';
  const prefix = `[${DebugLevel[level].toUpperCase()}]`;
  const safeDetails = details.map(deepClone);

  switch (level) {
    case DebugLevel.Debug:
      console.debug(`${prefix} ${message}`, ...safeDetails);
      break;
    case DebugLevel.Info:
      console.info(`${prefix} ${message}`, ...safeDetails);
      break;
    case DebugLevel.Warn:
      console.warn(`${prefix} ${message}`, ...safeDetails);
      break;
    case DebugLevel.Error:
      console.error(`${prefix} ${message}`, ...safeDetails);
      throw frontEndMessage;
    case DebugLevel.Fatal:
      console.error(`${prefix} ${message}`, ...safeDetails);
      alert?.(`${prefix} ${message}`);
      throw frontEndMessage;
  }
}
