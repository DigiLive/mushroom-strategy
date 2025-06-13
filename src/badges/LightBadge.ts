// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import RegistryFilter from '../utilities/RegistryFilter';
import AbstractBadge from './AbstractBadge';
import { LovelaceBadgeConfig } from '../types/homeassistant/data/lovelace/config/badge';

/**
 * Light Badge class.
 *
 * Used to create a badge configuration to indicate how many lights are on and to switch them all off.
 */
class LightBadge extends AbstractBadge {
  /**
   * Class Constructor.
   *
   * @param {LovelaceBadgeConfig} [customConfiguration] Custom badge configuration.
   */
  constructor(customConfiguration?: LovelaceBadgeConfig) {
    super();

    this.configuration = { ...this.configuration, ...LightBadge.getDefaultConfig(), ...customConfiguration };
  }

  /** Returns the default configuration object for the badge. */
  static getDefaultConfig(): LovelaceBadgeConfig {
    return {
      type: 'custom:mushroom-template-badge',
      icon: 'mdi:lightbulb-group',
      color: 'amber',
      content: Registry.getCountTemplate('light', 'eq', 'on'),
      tap_action: {
        action: 'perform-action',
        perform_action: 'light.turn_off',
        target: {
          entity_id: new RegistryFilter(Registry.entities)
            .whereDomain('light')
            .getValuesByProperty('entity_id') as string[],
        },
      },
      hold_action: {
        action: 'navigate',
        navigation_path: 'lights',
      },
    };
  }
}

export default LightBadge;
