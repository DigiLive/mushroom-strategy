import * as de from '../translations/de.json';
import * as en from '../translations/en.json';
import * as es from '../translations/es.json';
import * as nl from '../translations/nl.json';
import { HomeAssistant } from '../types/homeassistant/types';
import { logMessage, lvlWarn } from './debug';

/** Registry of currently supported languages */
const languages: Record<string, unknown> = {
  de,
  en,
  es,
  nl,
};

/** The fallback language if the user-defined language isn't defined */
const DEFAULT_LANG = 'en';

/**
 * Get a string by keyword and language.
 *
 * @param {string} key The key to look for in the object notation of the language file (E.g., `generic.home`).
 * @param {string} lang The language to get the string from (E.g., `en`).
 *
 * @returns {string | undefined} The requested string or undefined if the keyword doesn't exist/on error.
 */
function getTranslatedString(key: string, lang: string): string | undefined {
  try {
    return key.split('.').reduce((o, i) => (o as Record<string, unknown>)[i], languages[lang]) as string;
  } catch {
    return undefined;
  }
}

/**
 * Singleton instance of the localization function.
 *
 * This variable is set by {@link setupCustomLocalize} and used by {@link localize}.
 *
 * - Must be initialized before {@link localize} is called.
 * - Holds a closure that translates keys based on the language set during setup.
 *
 * @private
 */
let _localize: ((key: string) => string) | undefined = undefined;

/**
 * Set up the localization.
 *
 * It reads the user-defined language with a fall-back to English and returns a function to get strings from
 * language-files by keyword.
 *
 * If the keyword is undefined, or on error, the keyword itself is returned.
 *
 * @param {HomeAssistant} hass The Home Assistant object.
 */
export default function setupCustomLocalize(hass?: HomeAssistant): void {
  const lang = hass?.locale.language ?? DEFAULT_LANG;

  _localize = (key: string) => getTranslatedString(key, lang) ?? getTranslatedString(key, DEFAULT_LANG) ?? key;
}

/**
 * Translate a key using the globally configured localize function.
 *
 * @param key - The key to be translated.
 * @param caseType - Optional parameter to specify the case transformation:
 *   - 'upper': Converts the localized key to uppercase.
 *   - 'lower': Converts the localized key to lowercase.
 *   - 'title': Converts the localized key to a title case (capitalizing the first letter of each word).
 *
 * @returns The translated key in the specified case format or the original key if not initialized.
 */
export function localize(key: string, caseType?: 'upper' | 'lower' | 'title'): string {
  if (!_localize) {
    logMessage(lvlWarn, 'localize is not initialized! Call setupCustomLocalize first.');
    return key;
  }

  const localizedKey = _localize(key);

  // Transform the case based on the caseType parameter
  switch (caseType) {
    case 'upper':
      return localizedKey.toUpperCase();
    case 'lower':
      return localizedKey.toLowerCase();
    case 'title':
      return localizedKey
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
  }

  return localizedKey; // Return the original localized key if no caseType is specified
}
