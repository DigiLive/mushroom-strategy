// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { EntityRegistryEntry } from '@digilive/home-assistant-frontend-types';
import type { SelectCardConfig } from '@digilive/lovelace-mushroom-types';

import { CustomCardConfig } from '../types/strategy/strategy-cards';

import AbstractCard from './AbstractCard';

/**
 * Select Card Class
 *
 * Used to create a card configuration to control an entity of the select domain.
 */
class SelectCard extends AbstractCard<SelectCardConfig> {
  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {CustomCardConfig<SelectCardConfig>} [customConfiguration] Custom card configuration overrides.
   */
  public constructor(entity: EntityRegistryEntry, customConfiguration?: CustomCardConfig<SelectCardConfig>) {
    super(entity, customConfiguration);
  }

  /**
   * Returns the default configuration object for the card.
   *
   * @returns {Partial<SelectCardConfig>} The default configuration object for the card.
   */
  protected override getDefaultConfig(): Partial<SelectCardConfig> {
    return {
      type: 'custom:mushroom-select-card',
      icon: undefined,
    };
  }
}

export default SelectCard;
