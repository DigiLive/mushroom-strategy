// noinspection JSUnusedGlobalSymbols

import { HomeAssistant } from '../types';

/** Represents the different formats for numbers in Home Assistant. */
export enum NumberFormat {
  language = 'language',
  system = 'system',
  comma_decimal = 'comma_decimal',
  decimal_comma = 'decimal_comma',
  space_comma = 'space_comma',
  none = 'none',
}

/**Represents the different formats for time in Home Assistant. */
export enum TimeFormat {
  language = 'language',
  system = 'system',
  am_pm = '12',
  twenty_four = '24',
}

/** Represents the different time zones in Home Assistant. */
export enum TimeZone {
  local = 'local',
  server = 'server',
}

/** Represents the different formats for dates in Home Assistant. */
export enum DateFormat {
  language = 'language',
  system = 'system',
  DMY = 'DMY',
  MDY = 'MDY',
  YMD = 'YMD',
}

/**Represents the first weekday in Home Assistant. */
export enum FirstWeekday {
  language = 'language',
  monday = 'monday',
  tuesday = 'tuesday',
  wednesday = 'wednesday',
  thursday = 'thursday',
  friday = 'friday',
  saturday = 'saturday',
  sunday = 'sunday',
}

/**
 * Represents the locale data for the frontend in Home Assistant.
 *
 * @property {string} language - The language of the frontend.
 * @property {NumberFormat} number_format - The format for numbers.
 * @property {TimeFormat} time_format - The format for time.
 * @property {DateFormat} date_format - The format for dates.
 * @property {FirstWeekday} first_weekday - The first weekday.
 * @property {TimeZone} time_zone - The time zone.
 */
export interface FrontendLocaleData {
  language: string;
  number_format: NumberFormat;
  time_format: TimeFormat;
  date_format: DateFormat;
  first_weekday: FirstWeekday;
  time_zone: TimeZone;
}

/** Represents a category for translations in Home Assistant. */
export type TranslationCategory =
  | 'title'
  | 'state'
  | 'entity'
  | 'entity_component'
  | 'exceptions'
  | 'config'
  | 'config_subentries'
  | 'config_panel'
  | 'options'
  | 'device_automation'
  | 'mfa_setup'
  | 'system_health'
  | 'application_credentials'
  | 'issues'
  | 'selector'
  | 'services';

/**
 * Retrieves the translations for Home Assistant.
 *
 * @async
 *
 * @param {HomeAssistant} hass - The Home Assistant instance.
 * @param {string} language - The language for translations.
 * @param {TranslationCategory} category - The category of translations.
 * @param {string | string[]} [integration] - Optional integration name(s).
 * @param {boolean} [config_flow] - Optional flag for config flow.
 *
 * @returns {Promise<Record<string, unknown>>} A promise resolving to an object containing translation key-value pairs.
 */
export const getHassTranslations = async (
  hass: HomeAssistant,
  language: string,
  category: TranslationCategory,
  integration?: string | string[],
  config_flow?: boolean,
): Promise<Record<string, unknown>> => {
  const result = await hass.callWS<{ resources: Record<string, unknown> }>({
    type: 'frontend/get_translations',
    language,
    category,
    integration,
    config_flow,
  });
  return result.resources;
};
