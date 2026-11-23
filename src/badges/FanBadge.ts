// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { LovelaceBadgeConfig } from '@digilive/home-assistant-frontend-types';

import RegistryFilter from '../utilities/RegistryFilter';

import { Registry } from '../Registry';

import AbstractBadge from './AbstractBadge';

/**
 * Fan Badge class.
 *
 * Used to create a badge to indicate how many fans are on and to switch them all off.
 */
class FanBadge extends AbstractBadge<LovelaceBadgeConfig> {
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
