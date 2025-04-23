// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';
import { CoverCardConfig } from '../types/lovelace-mushroom/cards/cover-card-config';
import AbstractCard from './AbstractCard';

/**
 * Cover Card Class
 *
 * Used to create a card configuration to control an entity of the cover domain.
 */
class CoverCard extends AbstractCard {
  /** Returns the default configuration object for the card. */
  static getDefaultConfig(): CoverCardConfig {
    return {
      type: 'custom:mushroom-cover-card',
      icon: undefined,
      show_buttons_control: true,
      show_position_control: true,
      show_tilt_position_control: true,
    };
  }

  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {CoverCardConfig} [customConfiguration] Custom card configuration.
   */
  constructor(entity: EntityRegistryEntry, customConfiguration?: CoverCardConfig) {
    super(entity);

    this.configuration = { ...this.configuration, ...CoverCard.getDefaultConfig(), ...customConfiguration };
  }
}

export default CoverCard;
