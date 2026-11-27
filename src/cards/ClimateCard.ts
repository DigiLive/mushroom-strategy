// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { EntityRegistryEntry } from '@digilive/home-assistant-frontend-types';
import { ClimateCardConfig } from '@digilive/lovelace-mushroom-types';

import { CustomCardConfig } from '../types/strategy/strategy-cards';

import AbstractCard from './AbstractCard';

/**
 * Climate Card Class
 *
 * Used to create a card configuration to control an entity of the climate domain.
 */
class ClimateCard extends AbstractCard<ClimateCardConfig> {
  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {CustomCardConfig<ClimateCardConfig>} [customConfiguration] Custom card configuration.
   */
  public constructor(entity: EntityRegistryEntry, customConfiguration?: CustomCardConfig<ClimateCardConfig>) {
    super(entity, customConfiguration);
  }

  /**
   * Returns the default configuration object for the card.
   *
   * @returns {Partial<ClimateCardConfig>} The default configuration for the climate card.
   */
  protected override getDefaultConfig(): Partial<ClimateCardConfig> {
    return {
      type: 'custom:mushroom-climate-card',
      icon: undefined,
      hvac_modes: ['off', 'cool', 'heat', 'fan_only'],
      show_temperature_control: true,
    };
  }
}

export default ClimateCard;
