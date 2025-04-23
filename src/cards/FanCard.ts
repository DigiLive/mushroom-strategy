// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';
import { FanCardConfig } from '../types/lovelace-mushroom/cards/fan-card-config';
import AbstractCard from './AbstractCard';

/**
 * Fan Card Class
 *
 * Used to create a card configuration to control an entity of the fan domain.
 */
class FanCard extends AbstractCard {
  /** Returns the default configuration object for the card. */
  static getDefaultConfig(): FanCardConfig {
    return {
      type: 'custom:mushroom-fan-card',
      icon: undefined,
      show_percentage_control: true,
      show_oscillate_control: true,
      icon_animation: true,
    };
  }

  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {FanCardConfig} [customConfiguration] Custom card configuration.
   */
  constructor(entity: EntityRegistryEntry, customConfiguration?: FanCardConfig) {
    super(entity);

    this.configuration = { ...this.configuration, ...FanCard.getDefaultConfig(), ...customConfiguration };
  }
}

export default FanCard;
