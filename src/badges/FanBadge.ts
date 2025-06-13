// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import RegistryFilter from '../utilities/RegistryFilter';
import AbstractBadge from './AbstractBadge';
import { LovelaceBadgeConfig } from '../types/homeassistant/data/lovelace/config/badge';

/**
 * Fan Badge class.
 *
 * Used to create a badge to indicate how many fans are on and to switch them all off.
 */
class FanBadge extends AbstractBadge {
  /**
   * Class Constructor.
   *
   * @param {LovelaceBadgeConfig} [customConfiguration] Custom badge configuration.
   */
  constructor(customConfiguration?: LovelaceBadgeConfig) {
    super();

    this.configuration = { ...this.configuration, ...FanBadge.getDefaultConfig(), ...customConfiguration };
  }

  /** Returns the default configuration object for the badge. */
  static getDefaultConfig(): LovelaceBadgeConfig {
    return {
      type: 'custom:mushroom-template-badge',
      icon: 'mdi:fan',
      color: 'green',
      content: Registry.getCountTemplate('fan', 'eq', 'on'),
      tap_action: {
        action: 'perform-action',
        perform_action: 'fan.turn_off',
        target: {
          entity_id: new RegistryFilter(Registry.entities)
            .whereDomain('fan')
            .getValuesByProperty('entity_id') as string[],
        },
      },
      hold_action: {
        action: 'navigate',
        navigation_path: 'fans',
      },
    };
  }
}

export default FanBadge;
