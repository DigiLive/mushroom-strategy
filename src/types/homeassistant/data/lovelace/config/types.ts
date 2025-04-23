import { LovelaceViewRawConfig } from './view';

/** Represents the base configuration for a Lovelace dashboard in Home Assistant. */
export interface LovelaceDashboardBaseConfig {}

/**
 * Represents the configuration for a Lovelace dashboard in Home Assistant.
 *
 * @property {string} [background] - An optional background image or color for the dashboard.
 * @property {LovelaceViewRawConfig[]} views - An array of views contained within the dashboard.
 */
export interface LovelaceConfig extends LovelaceDashboardBaseConfig {
  background?: string;
  views: LovelaceViewRawConfig[];
}
