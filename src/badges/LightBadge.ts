// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { LovelaceBadgeConfig } from '@digilive/home-assistant-frontend-types';

import RegistryFilter from '../utilities/RegistryFilter';

import { Registry } from '../Registry';

import AbstractBadge from './AbstractBadge';

/**
 * Light Badge class.
 *
 * Used to create a badge configuration to indicate how many lights are on and to switch them all off.
 */
class LightBadge extends AbstractBadge<LovelaceBadgeConfig> {
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
