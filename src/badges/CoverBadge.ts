// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import AbstractBadge from './AbstractBadge';
import { LovelaceBadgeConfig } from '../types/homeassistant/data/lovelace/config/badge';

/**
 * Cover Badge class.
 *
 * Used to create a badge configuration to indicate how many covers aren't closed.
 */
class CoverBadge extends AbstractBadge {
  /**
   * Class Constructor.
   *
   * @param {LovelaceBadgeConfig} [customConfiguration] Custom badge configuration.
   */
  constructor(customConfiguration?: LovelaceBadgeConfig) {
    super();

    this.configuration = { ...this.configuration, ...CoverBadge.getDefaultConfig(), ...customConfiguration };
  }

  /** Returns the default configuration object for the badge. */
  static getDefaultConfig(): LovelaceBadgeConfig {
    return {
      type: 'custom:mushroom-template-badge',
      icon: 'mdi:window-open',
      color: 'cyan',
      content: Registry.getCountTemplate('cover', 'search', '(open|opening|closing)'),
      tap_action: {
        action: 'none',
      },
      hold_action: {
        action: 'navigate',
        navigation_path: 'covers',
      },
    };
  }
}

export default CoverBadge;
