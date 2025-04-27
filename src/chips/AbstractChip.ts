import { HassServiceTarget } from 'home-assistant-js-websocket';
import { Registry } from '../Registry';
import { LovelaceChipConfig } from '../types/lovelace-mushroom/utils/lovelace/chip/types';
import { isCallServiceActionConfig } from '../types/strategy/strategy-generics';
import { logMessage, lvlFatal, lvlWarn } from '../utilities/debug';

abstract class AbstractChip {
  /**
   * Abstract Chip class.
   *
   * To create a chip configuration, this class should be extended by a child class.
   * Child classes should override the default configuration so the chip correctly reflects the entity.
   *
   * @remarks
   * Before using this class, the Registry module must be initialized by calling {@link Registry.initialize}.
   */

  /**
   * Configuration of the chip.
   *
   * Child classes should override this property to reflect their own card type and options.
   */
  protected configuration: LovelaceChipConfig = {
    // TODO: Check if this is correct vs custom:mushroom-template-badge. Also in child classes.
    type: 'template',
  };

  /**
   * Class Constructor.
   *
   * @remarks
   * Before using this class, the Registry module must be initialized by calling {@link Registry.initialize}.
   */
  protected constructor() {
    if (!Registry.initialized) {
      logMessage(lvlFatal, 'Registry not initialized!');
    }
  }

  /**
   * Get a chip configuration.
   *
   * The configuration should be set by any of the child classes so the chip correctly reflects an entity.
   */
  getChipConfiguration(): LovelaceChipConfig {
    return this.configuration;
  }

  /**
   * Set the target for the tap action.
   *
   * @param {HassServiceTarget} target Target of the tap action.
   */
  setTapActionTarget(target: HassServiceTarget) {
    if ('tap_action' in this.configuration && isCallServiceActionConfig(this.configuration.tap_action)) {
      this.configuration.tap_action.target = target;

      return;
    }

    logMessage(lvlWarn, 'Target not set: Invalid target or tap action.');
  }
}

export default AbstractChip;
