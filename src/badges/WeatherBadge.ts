// noinspection JSUnusedGlobalSymbols False positive.

import { LovelaceBadgeConfig } from '../types/homeassistant/data/lovelace/config/badge';
import { EntityBadgeConfig } from '../types/homeassistant/panels/lovelace/badges/types';
import AbstractBadge from './AbstractBadge';

/**
 * Weather Badge class.
 *
 * Used to create a badge configuration to indicate the current weather.
 */
class WeatherBadge extends AbstractBadge {
  /**
   * Class Constructor.
   *
   * @param {string} entityId Id of a weather entity.
   * @param {LovelaceBadgeConfig} [customConfiguration] Custom badge configuration.
   */
  constructor(entityId: string, customConfiguration?: LovelaceBadgeConfig) {
    super();

    this.configuration = { ...this.configuration, ...WeatherBadge.getDefaultConfig(entityId), ...customConfiguration };
  }

  /** Returns the default configuration object for the badge. */
  static getDefaultConfig(entityId: string): EntityBadgeConfig {
    return {
      type: 'entity',
      entity: entityId,
      state_content: ['state', 'temperature'],
    };
  }
}

export default WeatherBadge;
