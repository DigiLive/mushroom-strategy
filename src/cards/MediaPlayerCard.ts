// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { EntityRegistryEntry } from '@digilive/home-assistant-frontend-types';
import { MediaPlayerCardConfig } from '@digilive/lovelace-mushroom-types';

import { CustomCardConfig } from '../types/strategy/strategy-cards';

import AbstractCard from './AbstractCard';

/**
 * Mediaplayer Card Class
 *
 * Used to create a card configuration to control an entity of the media_player domain.
 */
class MediaPlayerCard extends AbstractCard<MediaPlayerCardConfig> {
  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {CustomCardConfig<MediaPlayerCardConfig>} [customConfiguration] Custom card configuration overrides.
   */
  public constructor(entity: EntityRegistryEntry, customConfiguration?: CustomCardConfig<MediaPlayerCardConfig>) {
    super(entity, customConfiguration);
  }

  /** Returns the default configuration object for the card. */
  protected getDefaultConfig(): Partial<MediaPlayerCardConfig> {
    return {
      type: 'custom:mushroom-media-player-card',
      use_media_info: true,
      media_controls: ['on_off', 'play_pause_stop'],
      show_volume_level: true,
      volume_controls: ['volume_mute', 'volume_set', 'volume_buttons'],
    };
  }
}

export default MediaPlayerCard;
