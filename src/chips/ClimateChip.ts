// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { TemplateChipConfig } from '../types/lovelace-mushroom/utils/lovelace/chip/types';
import AbstractChip from './AbstractChip';

/**
 * Climate Chip class.
 *
 * Used to create a chip configuration to indicate how many climates are operating.
 */
class ClimateChip extends AbstractChip {
  /** Returns the default configuration object for the chip. */
  static getDefaultConfig(): TemplateChipConfig {
    return {
      type: 'template',
      icon: 'mdi:thermostat',
      icon_color: 'orange',
      content: Registry.getCountTemplate('climate', 'ne', 'off'),
      tap_action: {
        action: 'none',
      },
      hold_action: {
        action: 'navigate',
        navigation_path: 'climates',
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

    this.configuration = { ...this.configuration, ...ClimateChip.getDefaultConfig(), ...customConfiguration };
  }
}

export default ClimateChip;
