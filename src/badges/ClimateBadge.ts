// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import AbstractBadge from './AbstractBadge';
import { Registry } from '../Registry';
import { LovelaceBadgeConfig } from '../types/homeassistant/data/lovelace/config/badge';

/**
 * Climate Badge class.
 *
 * Used to create a badge configuration to indicate how many climates are operating.
 */
class ClimateBadge extends AbstractBadge {
  /**
   * Class Constructor.
   *
   * @param {LovelaceBadgeConfig} [customConfiguration] Custom badge configuration.
   */
  constructor(customConfiguration?: LovelaceBadgeConfig) {
    super();

    this.configuration = { ...this.configuration, ...ClimateBadge.getDefaultConfig(), ...customConfiguration };
  }

  /** Returns the default configuration object for the badge. */
  static getDefaultConfig(): LovelaceBadgeConfig {
    return {
      type: 'custom:mushroom-template-badge',
      icon: 'mdi:thermostat',
      color: 'orange',
      content: Registry.getCountTemplate('climate', 'ne', 'off'),
      /*      `
      🔄${Registry.getCountTemplate('climate', 'eq', 'auto')}
      ↕️❄️${Registry.getCountTemplate('climate', 'eq', 'heat_cool')}
      🔥${Registry.getCountTemplate('climate', 'eq', 'heat')}
      ❄️${Registry.getCountTemplate('climate', 'eq', 'cool')}
      💧${Registry.getCountTemplate('climate', 'eq', 'dry')}
      💨${Registry.getCountTemplate('climate', 'eq', 'fan_only')}
      ⭕${Registry.getCountTemplate('climate', 'eq', 'off')}
      `,*/
      tap_action: {
        action: 'none',
      },
      hold_action: {
        action: 'navigate',
        navigation_path: 'climates',
      },
    };
  }
}

export default ClimateBadge;
