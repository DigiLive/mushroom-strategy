// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { EntityRegistryEntry } from '@digilive/home-assistant-frontend-types';
import { CoverCardConfig } from '@digilive/lovelace-mushroom-types';

import { CustomCardConfig } from '../types/strategy/strategy-cards';

import AbstractCard from './AbstractCard';

/**
 * Cover Card Class
 *
 * Used to create a card configuration to control an entity of the cover domain.
 */
class CoverCard extends AbstractCard<CoverCardConfig> {
  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {CustomCardConfig<CoverCardConfig>} [customConfiguration] Custom card configuration.
   */
  public constructor(entity: EntityRegistryEntry, customConfiguration?: CustomCardConfig<CoverCardConfig>) {
    super(entity, customConfiguration);
  }

  /**
   * Returns the default configuration object for the card.
   *
   * @returns {Partial<CoverCardConfig>} The default configuration for the cover card.
   */
  protected override getDefaultConfig(): Partial<CoverCardConfig> {
    return {
      type: 'custom:mushroom-cover-card',
      icon: undefined,
      show_buttons_control: true,
      show_position_control: true,
      show_tilt_position_control: true,
    };
  }
}

export default CoverCard;
