// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';
import { EntityCardConfig } from '../types/lovelace-mushroom/cards/entity-card-config';
import SensorCard from './SensorCard';

/**
 * Sensor Card Class
 *
 * Used to create a card configuration to control an entity of the binary_sensor domain.
 */
class BinarySensorCard extends SensorCard {
  /** Returns the default configuration object for the card. */
  static getDefaultConfig(): EntityCardConfig {
    return {
      type: 'custom:mushroom-entity-card',
      icon: 'mdi:power-cycle',
      icon_color: 'green',
    };
  }

  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {EntityCardConfig} [customConfiguration] Custom card configuration.
   */
  constructor(entity: EntityRegistryEntry, customConfiguration?: EntityCardConfig) {
    super(entity);

    this.configuration = { ...this.configuration, ...BinarySensorCard.getDefaultConfig(), ...customConfiguration };
  }
}

export default BinarySensorCard;
