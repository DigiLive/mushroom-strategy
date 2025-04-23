// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { TemplateChipConfig } from '../types/lovelace-mushroom/utils/lovelace/chip/types';
import AbstractChip from './AbstractChip';

/**
 * Switch Chip class.
 *
 * Used to create a chip configuration to indicate how many switches are on and to switch them all off.
 */
class SwitchChip extends AbstractChip {
  /** Returns the default configuration object for the chip. */
  static getDefaultConfig(): TemplateChipConfig {
    return {
      type: 'template',
      icon: 'mdi:dip-switch',
      icon_color: 'blue',
      content: Registry.getCountTemplate('switch', 'eq', 'on'),
      tap_action: {
        action: 'call-service',
        perform_action: 'switch.turn_off',
      },
      hold_action: {
        action: 'navigate',
        navigation_path: 'switches',
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

    this.configuration = { ...this.configuration, ...SwitchChip.getDefaultConfig(), ...customConfiguration };
  }
}

export default SwitchChip;
