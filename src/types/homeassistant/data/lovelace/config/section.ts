import { Condition } from '../../../panels/common/validate-condition';
import { LovelaceCardConfig } from './card';
import { LovelaceStrategyConfig } from './strategy';

/**
 * Represents the base configuration for a Lovelace section in Home Assistant.
 *
 * @property {Condition[]} [visibility] - An optional array of visibility conditions for the section.
 * @property {number} [column_span] - The number of columns the section spans.
 * @property {number} [row_span] - The number of rows the section spans.
 * @property {string} [title] - The title of the section (deprecated; use heading card instead).
 */
export interface LovelaceBaseSectionConfig {
  visibility?: Condition[];
  column_span?: number;
  row_span?: number;
  /** @deprecated Use heading card instead. */
  title?: string;
}

export interface LovelaceSectionConfig /**
   * Represents the configuration for a Lovelace section in Home Assistant.
   *
   * @property {string} [type] - The type of the section.
   * @property {LovelaceCardConfig[]} [cards] - An optional array of cards contained within the section.
   */
  extends LovelaceBaseSectionConfig {
  type?: string;
  cards?: LovelaceCardConfig[];
}

/**
 * Represents the configuration for a Lovelace strategy section in Home Assistant.
 *
 * @property {LovelaceStrategyConfig} strategy - The strategy configuration for the section.
 */
export interface LovelaceStrategySectionConfig extends LovelaceBaseSectionConfig {
  strategy: LovelaceStrategyConfig;
}

/** Represents the raw configuration for a Lovelace section in Home Assistant. */
export type LovelaceSectionRawConfig = LovelaceSectionConfig | LovelaceStrategySectionConfig;
