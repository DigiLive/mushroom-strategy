// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { TemplateChipConfig } from '../types/lovelace-mushroom/utils/lovelace/chip/types';
import AbstractChip from './AbstractChip';

/**
 * Fan Chip class.
 *
 * Used to create a chip to indicate how many fans are on and to switch them all off.
 */
class FanChip extends AbstractChip {
  /** Returns the default configuration object for the chip. */
  static getDefaultConfig(): TemplateChipConfig {
    return {
      type: 'template',
      icon: 'mdi:fan',
      icon_color: 'green',
      content: Registry.getCountTemplate('fan', 'eq', 'on'),
      tap_action: {
        action: 'call-service',
        perform_action: 'fan.turn_off',
      },
      hold_action: {
        action: 'navigate',
        navigation_path: 'fans',
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

    this.configuration = { ...this.configuration, ...FanChip.getDefaultConfig(), ...customConfiguration };
  }
}

export default FanChip;
