import { EntityRegistryEntry } from '@digilive/home-assistant-frontend-types';
import { EntityCardConfig } from '@digilive/lovelace-mushroom-types';

import { CustomCardConfig } from '../types/strategy/strategy-cards';

import AbstractCard from './AbstractCard';

/**
 * Miscellaneous Card Class
 *
 * Used to create a card configuration to control an entity of any domain.
 */
class MiscellaneousCard extends AbstractCard<EntityCardConfig> {
  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {CustomCardConfig<EntityCardConfig>} [customConfiguration] Custom card configuration overrides.
   */
  public constructor(entity: EntityRegistryEntry, customConfiguration?: CustomCardConfig<EntityCardConfig>) {
    super(entity, customConfiguration);
  }

  /** Returns the default configuration object for the card. */
  protected getDefaultConfig(): Partial<EntityCardConfig> {
    return {
      type: 'custom:mushroom-entity-card',
      icon: undefined,
    };
  }
}

export default MiscellaneousCard;
