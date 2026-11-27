// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { EntityRegistryEntry } from '@digilive/home-assistant-frontend-types';
import { FanCardConfig } from '@digilive/lovelace-mushroom-types';

import { CustomCardConfig } from '../types/strategy/strategy-cards';

import AbstractCard from './AbstractCard';

/**
 * Fan Card Class
 *
 * Used to create a card configuration to control an entity of the fan domain.
 */
class FanCard extends AbstractCard<FanCardConfig> {
  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {CustomCardConfig<FanCardConfig>} [customConfiguration] Custom card configuration.
   */
  public constructor(entity: EntityRegistryEntry, customConfiguration?: CustomCardConfig<FanCardConfig>) {
    super(entity, customConfiguration);
  }

  /**
   * Returns the default configuration object for the card.
   *
   * @returns {Partial<FanCardConfig>} The default configuration object for the card.
   */
  protected override getDefaultConfig(): Partial<FanCardConfig> {
    return {
      type: 'custom:mushroom-fan-card',
      icon: undefined,
      show_percentage_control: true,
      show_oscillate_control: true,
      icon_animation: true,
    };
  }
}

export default FanCard;
