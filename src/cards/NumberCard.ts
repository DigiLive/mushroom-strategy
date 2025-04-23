// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';
import { NumberCardConfig } from '../types/lovelace-mushroom/cards/number-card-config';
import AbstractCard from './AbstractCard';

/**
 * Number Card Class
 *
 * Used to create a card configuration to control an entity of the number domain.
 */
class NumberCard extends AbstractCard {
  /** Returns the default configuration object for the card. */
  static getDefaultConfig(): NumberCardConfig {
    return {
      type: 'custom:mushroom-number-card',
      icon: undefined,
    };
  }

  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {NumberCardConfig} [customConfiguration] Custom card configuration.
   */
  constructor(entity: EntityRegistryEntry, customConfiguration?: NumberCardConfig) {
    super(entity);

    this.configuration = { ...this.configuration, ...NumberCard.getDefaultConfig(), ...customConfiguration };
  }
}

export default NumberCard;
