// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';
import { LockCardConfig } from '../types/lovelace-mushroom/cards/lock-card-config';
import AbstractCard from './AbstractCard';

/**
 * Lock Card Class
 *
 * Used to create a card configuration to control an entity of the lock domain.
 */
class LockCard extends AbstractCard {
  /** Returns the default configuration object for the card. */
  static getDefaultConfig(): LockCardConfig {
    return {
      type: 'custom:mushroom-lock-card',
      icon: undefined,
    };
  }

  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {LockCardConfig} [customConfiguration] Custom card configuration.
   */
  constructor(entity: EntityRegistryEntry, customConfiguration?: LockCardConfig) {
    super(entity);

    this.configuration = { ...this.configuration, ...LockCard.getDefaultConfig(), ...customConfiguration };
  }
}

export default LockCard;
