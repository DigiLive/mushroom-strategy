// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { EntityRegistryEntry } from '@digilive/home-assistant-frontend-types';
import { EntityCardConfig } from '@digilive/lovelace-mushroom-types';

import { CustomCardConfig } from '../types/strategy/strategy-cards';

import AbstractCard from './AbstractCard';

/**
 * Sensor Card Class
 *
 * Used to create a card configuration to control an entity of the binary_sensor domain.
 */
class BinarySensorCard extends AbstractCard<EntityCardConfig> {
  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {CustomCardConfig<EntityCardConfig>} [customConfiguration] Custom card configuration.
   */
  public constructor(entity: EntityRegistryEntry, customConfiguration?: CustomCardConfig<EntityCardConfig>) {
    super(entity, customConfiguration);
  }

  /**
   * Returns the default configuration object for the card.
   *
   * @returns {Partial<EntityCardConfig>} The default configuration object for the card.
   */
  protected override getDefaultConfig(): Partial<EntityCardConfig> {
    return {
      type: 'custom:mushroom-entity-card',
      icon: 'mdi:power-cycle',
      icon_color: 'green',
    };
  }
}

export default BinarySensorCard;
