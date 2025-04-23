// noinspection JSUnusedGlobalSymbols False positive.

import { WeatherChipConfig } from '../types/lovelace-mushroom/utils/lovelace/chip/types';
import AbstractChip from './AbstractChip';

/**
 * Weather Chip class.
 *
 * Used to create a chip configuration to indicate the current weather.
 */
class WeatherChip extends AbstractChip {
  /** Returns the default configuration object for the chip. */
  static getDefaultConfig(entityId: string): WeatherChipConfig {
    return {
      type: 'weather',
      entity: entityId,
      show_temperature: true,
      show_conditions: true,
    };
  }

  /**
   * Class Constructor.
   *
   * @param {string} entityId Id of a weather entity.
   * @param {WeatherChipConfig} [customConfiguration] Custom chip configuration.
   */
  constructor(entityId: string, customConfiguration?: WeatherChipConfig) {
    super();

    this.configuration = { ...this.configuration, ...WeatherChip.getDefaultConfig(entityId), ...customConfiguration };
  }
}

export default WeatherChip;
