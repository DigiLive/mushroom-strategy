// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { EntityRegistryEntry } from '@digilive/home-assistant-frontend-types';
import { LightCardConfig } from '@digilive/lovelace-mushroom-types';

import { CustomCardConfig } from '../types/strategy/strategy-cards';
import { isCallServiceActionConfig } from '../types/strategy/strategy-generics';

import AbstractCard from './AbstractCard';

/**
 * Light Card Class
 *
 * Used to create a card configuration to control an entity of the light domain.
 */
class LightCard extends AbstractCard<LightCardConfig> {
  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {CustomCardConfig<LightCardConfig>} [customConfiguration] Custom card configuration overrides.
   */
  public constructor(entity: EntityRegistryEntry, customConfiguration?: CustomCardConfig<LightCardConfig>) {
    super(entity, customConfiguration);

    if (isCallServiceActionConfig(this.configuration.double_tap_action)) {
      this.configuration.double_tap_action = {
        ...this.configuration.double_tap_action,
        target: {
          ...this.configuration.double_tap_action.target,
          entity_id: entity.entity_id,
        },
      };
    }
  }

  /** Returns the default configuration object for the card. */
  protected getDefaultConfig(): Partial<LightCardConfig> {
    return {
      type: 'custom:mushroom-light-card',
      icon: undefined,
      show_brightness_control: true,
      show_color_control: true,
      show_color_temp_control: true,
      use_light_color: true,
      double_tap_action: {
        action: 'call-service',
        perform_action: 'light.turn_on',
        target: {
          entity_id: undefined,
        },
        data: {
          rgb_color: [255, 255, 255],
        },
      },
    };
  }
}

export default LightCard;
