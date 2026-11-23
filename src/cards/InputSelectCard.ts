// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { EntityRegistryEntry } from '@digilive/home-assistant-frontend-types';
import { SelectCardConfig } from '@digilive/lovelace-mushroom-types';

import { CustomCardConfig } from '../types/strategy/strategy-cards';

import SelectCard from './SelectCard';

/**
 * InputSelect Card Class
 *
 * Used to create a card configuration to control an entity of the input_select domain.
 */
class InputSelectCard extends SelectCard {
  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {CustomCardConfig<SelectCardConfig>} [customConfiguration] Custom card configuration overrides.
   */
  public constructor(entity: EntityRegistryEntry, customConfiguration?: CustomCardConfig<SelectCardConfig>) {
    super(entity, customConfiguration);
  }

  /** Returns the default configuration object for the card. */
  protected getDefaultConfig(): Partial<SelectCardConfig> {
    return {
      type: 'custom:mushroom-select-card',
      icon: undefined,
    };
  }
}

export default InputSelectCard;
