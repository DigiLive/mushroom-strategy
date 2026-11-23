// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { EntityRegistryEntry } from '@digilive/home-assistant-frontend-types';
import { NumberCardConfig } from '@digilive/lovelace-mushroom-types';

import { CustomCardConfig } from '../types/strategy/strategy-cards';

import AbstractCard from './AbstractCard';

/**
 * Number Card Class
 *
 * Used to create a card configuration to control an entity of the number domain.
 */
class NumberCard extends AbstractCard<NumberCardConfig> {
  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {CustomCardConfig<NumberCardConfig>} [customConfiguration] Custom card configuration overrides.
   */
  public constructor(entity: EntityRegistryEntry, customConfiguration?: CustomCardConfig<NumberCardConfig>) {
    super(entity, customConfiguration);
  }

  /** Returns the default configuration object for the card. */
  protected getDefaultConfig(): Partial<NumberCardConfig> {
    return {
      type: 'custom:mushroom-number-card',
      icon: undefined,
    };
  }
}

export default NumberCard;
