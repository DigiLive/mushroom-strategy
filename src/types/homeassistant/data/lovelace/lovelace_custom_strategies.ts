/**
 * Represents an entry in the custom Lovelace strategy registry in Home Assistant.
 *
 * @property {string} type - The unique strategy type identifier.
 * @property {string} [name] - The display name of the strategy.
 * @property {string} [description] - The description of the strategy.
 * @property {string} [documentationURL] - The URL to the strategy documentation.
 * @property {'dashboard'} strategyType - The strategy type.
 */
export interface CustomStrategyEntry {
  type: string;
  name?: string;
  description?: string;
  documentationURL?: string;
  strategyType: 'dashboard';
}

declare global {
  //noinspection JSUnusedGlobalSymbols This extends global Window and is used in mushroom-strategy.ts
  /**
   * Represents the browser window object for custom Lovelace strategy registration.
   *
   * @property {CustomStrategyEntry[]} [customStrategies] - The registered custom Lovelace strategies.
   */
  interface Window {
    customStrategies?: CustomStrategyEntry[];
  }
}
