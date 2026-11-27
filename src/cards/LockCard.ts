// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { EntityRegistryEntry } from '@digilive/home-assistant-frontend-types';
import { LockCardConfig } from '@digilive/lovelace-mushroom-types';

import { CustomCardConfig } from '../types/strategy/strategy-cards';

import AbstractCard from './AbstractCard';

/**
 * Lock Card Class
 *
 * Used to create a card configuration to control an entity of the lock domain.
 */
class LockCard extends AbstractCard<LockCardConfig> {
  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {CustomCardConfig<LockCardConfig>} [customConfiguration] Custom card configuration overrides.
   */
  public constructor(entity: EntityRegistryEntry, customConfiguration?: CustomCardConfig<LockCardConfig>) {
    super(entity, customConfiguration);
  }

  /**
   * Returns the default configuration object for the card.
   *
   * @returns {Partial<LockCardConfig>} The default configuration object for the card.
   */
  protected override getDefaultConfig(): Partial<LockCardConfig> {
    return {
      type: 'custom:mushroom-lock-card',
      icon: undefined,
    };
  }
}

export default LockCard;
