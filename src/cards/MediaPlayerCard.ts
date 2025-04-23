// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';
import { MediaPlayerCardConfig } from '../types/lovelace-mushroom/cards/media-player-card-config';
import AbstractCard from './AbstractCard';

/**
 * Mediaplayer Card Class
 *
 * Used to create a card configuration to control an entity of the media_player domain.
 */
class MediaPlayerCard extends AbstractCard {
  /** Returns the default configuration object for the card. */
  static getDefaultConfig(): MediaPlayerCardConfig {
    return {
      type: 'custom:mushroom-media-player-card',
      use_media_info: true,
      media_controls: ['on_off', 'play_pause_stop'],
      show_volume_level: true,
      volume_controls: ['volume_mute', 'volume_set', 'volume_buttons'],
    };
  }

  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {MediaPlayerCardConfig} [customConfiguration] Custom card configuration.
   */
  constructor(entity: EntityRegistryEntry, customConfiguration?: MediaPlayerCardConfig) {
    super(entity);

    this.configuration = { ...this.configuration, ...MediaPlayerCard.getDefaultConfig(), ...customConfiguration };
  }
}

export default MediaPlayerCard;
