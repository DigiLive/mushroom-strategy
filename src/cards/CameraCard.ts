// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';
import { PictureEntityCardConfig } from '../types/homeassistant/panels/lovelace/cards/types';
import AbstractCard from './AbstractCard';

/**
 * Camera Card Class
 *
 * Used to create a card configuration to control an entity of the camera domain.
 */
class CameraCard extends AbstractCard {
  /** Returns the default configuration object for the card. */
  static getDefaultConfig(): PictureEntityCardConfig {
    return {
      entity: '',
      type: 'picture-entity',
      show_name: false,
      show_state: false,
      camera_view: 'live',
    };
  }

  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {PictureEntityCardConfig} [customConfiguration] Custom card configuration.
   */
  constructor(entity: EntityRegistryEntry, customConfiguration?: PictureEntityCardConfig) {
    super(entity);

    this.configuration = { ...this.configuration, ...CameraCard.getDefaultConfig(), ...customConfiguration };
  }
}

export default CameraCard;
