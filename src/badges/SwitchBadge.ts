// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import RegistryFilter from '../utilities/RegistryFilter';
import AbstractBadge from './AbstractBadge';
import { LovelaceBadgeConfig } from '../types/homeassistant/data/lovelace/config/badge';

/**
 * Switch Badge class.
 *
 * Used to create a badge configuration to indicate how many switches are on and to switch them all off.
 */
class SwitchBadge extends AbstractBadge {
  /**
   * Class Constructor.
   *
   * @param {LovelaceBadgeConfig} [customConfiguration] Custom badge configuration.
   */
  constructor(customConfiguration?: LovelaceBadgeConfig) {
    super();

    this.configuration = { ...this.configuration, ...SwitchBadge.getDefaultConfig(), ...customConfiguration };
  }

  /** Returns the default configuration object for the badge. */
  static getDefaultConfig(): LovelaceBadgeConfig {
    return {
      type: 'custom:mushroom-template-badge',
      icon: 'mdi:dip-switch',
      color: 'blue',
      content: Registry.getCountTemplate('switch', 'eq', 'on'),
      tap_action: {
        action: 'perform-action',
        perform_action: 'switch.turn_off',
        target: {
          entity_id: new RegistryFilter(Registry.entities)
            .whereDomain('switch')
            .getValuesByProperty('entity_id') as string[],
        },
      },
      hold_action: {
        action: 'navigate',
        navigation_path: 'switches',
      },
    };
  }
}

export default SwitchBadge;
