// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { EntityRegistryEntry, PictureEntityCardConfig } from '@digilive/home-assistant-frontend-types';

import { CustomCardConfig } from '../types/strategy/strategy-cards';

import AbstractCard from './AbstractCard';

/**
 * Camera Card Class
 *
 * Used to create a card configuration to control an entity of the camera domain.
 */
class CameraCard extends AbstractCard<PictureEntityCardConfig> {
  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {CustomCardConfig<PictureEntityCardConfig>} [customConfiguration] Custom card configuration.
   */
  public constructor(entity: EntityRegistryEntry, customConfiguration?: CustomCardConfig<PictureEntityCardConfig>) {
    super(entity, customConfiguration);
  }

  /** Returns the default configuration object for the card. */
  protected getDefaultConfig(): Partial<PictureEntityCardConfig> {
    return {
      type: 'picture-entity',
      show_name: false,
      show_state: false,
      camera_view: 'live',
    };
  }
}

export default CameraCard;
