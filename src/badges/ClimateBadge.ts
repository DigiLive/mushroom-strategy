// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { LovelaceBadgeConfig } from '@digilive/home-assistant-frontend-types';

import { Registry } from '../Registry';

import AbstractBadge from './AbstractBadge';

/**
 * Climate Badge class.
 *
 * Used to create a badge configuration to indicate how many climates are operating.
 */
class ClimateBadge extends AbstractBadge<LovelaceBadgeConfig> {
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
