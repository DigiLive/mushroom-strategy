// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { TemplateChipConfig } from '../types/lovelace-mushroom/utils/lovelace/chip/types';
import AbstractChip from './AbstractChip';

/**
 * Cover Chip class.
 *
 * Used to create a chip configuration to indicate how many covers aren't closed.
 */
class CoverChip extends AbstractChip {
  /** Returns the default configuration object for the chip. */
  static getDefaultConfig(): TemplateChipConfig {
    return {
      type: 'template',
      icon: 'mdi:window-open',
      icon_color: 'cyan',
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

  /**
   * Class Constructor.
   *
   * @param {TemplateChipConfig} [customConfiguration] Custom chip configuration.
   */
  constructor(customConfiguration?: TemplateChipConfig) {
    super();

    this.configuration = { ...this.configuration, ...CoverChip.getDefaultConfig(), ...customConfiguration };
  }
}

export default CoverChip;
