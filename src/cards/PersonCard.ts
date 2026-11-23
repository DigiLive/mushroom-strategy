import { EntityRegistryEntry } from '@digilive/home-assistant-frontend-types';
import { PersonCardConfig } from '@digilive/lovelace-mushroom-types';

import { CustomCardConfig } from '../types/strategy/strategy-cards';

import AbstractCard from './AbstractCard';

/**
 * Person Card Class
 *
 * Used to create a card configuration to control an entity of the person domain.
 */
class PersonCard extends AbstractCard<PersonCardConfig> {
  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {CustomCardConfig<PersonCardConfig>} [customConfiguration] Custom card configuration overrides.
   */
  public constructor(entity: EntityRegistryEntry, customConfiguration?: CustomCardConfig<PersonCardConfig>) {
    super(entity, customConfiguration);
  }

  /** Returns the default configuration object for the card. */
  protected getDefaultConfig(): Partial<PersonCardConfig> {
    return {
      type: 'custom:mushroom-person-card',
      layout: 'vertical',
      primary_info: 'none',
      secondary_info: 'none',
      icon_type: 'entity-picture',
    };
  }
}

export default PersonCard;
