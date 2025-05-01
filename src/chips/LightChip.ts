// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { TemplateChipConfig } from '../types/lovelace-mushroom/utils/lovelace/chip/types';
import AbstractChip from './AbstractChip';
import RegistryFilter from '../utilities/RegistryFilter';

/**
 * Light Chip class.
 *
 * Used to create a chip configuration to indicate how many lights are on and to switch them all off.
 */
class LightChip extends AbstractChip {
  /** Returns the default configuration object for the chip. */
  static getDefaultConfig(): TemplateChipConfig {
    return {
      type: 'template',
      icon: 'mdi:lightbulb-group',
      icon_color: 'amber',
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

  /**
   * Class Constructor.
   *
   * @param {TemplateChipConfig} [customConfiguration] Custom chip configuration.
   */
  constructor(customConfiguration?: TemplateChipConfig) {
    super();

    this.configuration = { ...this.configuration, ...LightChip.getDefaultConfig(), ...customConfiguration };
  }
}

export default LightChip;
