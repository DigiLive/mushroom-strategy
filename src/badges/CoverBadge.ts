// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { LovelaceBadgeConfig } from '@digilive/home-assistant-frontend-types';

import { Registry } from '../Registry';

import AbstractBadge from './AbstractBadge';

/**
 * Cover Badge class.
 *
 * Used to create a badge configuration to indicate how many covers aren't closed.
 */
class CoverBadge extends AbstractBadge<LovelaceBadgeConfig> {
  /**
   * Class constructor.
   *
   * @param {Partial<LovelaceBadgeConfig>} [customConfiguration] Custom badge configuration overrides.
   */
  public constructor(customConfiguration?: Partial<LovelaceBadgeConfig>) {
    super();

    this.setConfiguration(customConfiguration);
  }

  /** Returns the default configuration object for the badge. */
  protected getDefaultConfig(): Partial<LovelaceBadgeConfig> {
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
