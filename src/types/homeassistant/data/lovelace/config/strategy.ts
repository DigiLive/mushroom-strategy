/**
 * Represents the configuration for a Lovelace strategy in Home Assistant.
 *
 * @property {string} type - The type of the strategy.
 * @property {any} [key] - Additional properties can be included in the configuration.
 */
export interface LovelaceStrategyConfig {
  type: string;

  [key: string]: any;
}
