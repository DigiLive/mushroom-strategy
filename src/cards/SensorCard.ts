import { EntityRegistryEntry } from '@digilive/home-assistant-frontend-types';

import type { CustomCardConfig, SensorCardConfig } from '../types/strategy/strategy-cards';

import { Registry } from '../Registry';

import AbstractCard from './AbstractCard';

/**
 * Sensor Card Class
 *
 * Used to create a card for controlling an entity of the sensor domain.
 */
class SensorCard extends AbstractCard<SensorCardConfig> {
  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {CustomCardConfig<SensorCardConfig>} [customConfiguration] Custom card configuration overrides.
   */
  public constructor(entity: EntityRegistryEntry, customConfiguration?: CustomCardConfig<SensorCardConfig>) {
    super(entity, customConfiguration);

    if (this.configuration.type === 'custom:mini-graph-card' && this.configuration.name) {
      this.configuration.name = Registry.getDisplayName(entity, this.configuration.name);
    }
  }

  /** Returns the default configuration object for the card. */
  protected getDefaultConfig(): Partial<SensorCardConfig> {
    return {
      type: 'custom:mini-graph-card',
      animate: true,
      icon: 'mdi:information',
      line_color: 'green',
    };
  }
}

export default SensorCard;
