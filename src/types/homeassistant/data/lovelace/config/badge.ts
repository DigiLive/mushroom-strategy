import { Condition } from '../../../panels/common/validate-condition';

/**
 * Represents the configuration for a Lovelace badge in Home Assistant.
 *
 * @property {string} type - The type of the badge.
 * @property {Condition[]} [visibility] - An optional array of visibility conditions for the badge.
 * @property {any} [key] - Additional properties can be included in the configuration.
 */
export interface LovelaceBadgeConfig {
  type: string;
  visibility?: Condition[];

  [key: string]: any;
}
