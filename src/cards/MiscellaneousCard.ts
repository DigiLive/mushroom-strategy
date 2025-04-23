import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';
import { EntityCardConfig } from '../types/lovelace-mushroom/cards/entity-card-config';
import AbstractCard from './AbstractCard';

/**
 * Miscellaneous Card Class
 *
 * Used to create a card configuration to control an entity of any domain.
 */
class MiscellaneousCard extends AbstractCard {
  /** Returns the default configuration object for the card. */
  static getDefaultConfig(): EntityCardConfig {
    return {
      type: 'custom:mushroom-entity-card',
      icon_color: 'blue-grey',
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

    this.configuration = { ...this.configuration, ...MiscellaneousCard.getDefaultConfig(), ...customConfiguration };
  }
}

export default MiscellaneousCard;
