import { Registry } from '../Registry';
import { logMessage, lvlFatal } from '../utilities/debug';
import { LovelaceBadgeConfig } from '../types/homeassistant/data/lovelace/config/badge';

abstract class AbstractBadge {
  /**
   * Abstract Badge class.
   *
   * To create a badge configuration, this class should be extended by a child class.
   * Child classes should override the default configuration so the badge correctly reflects the entity.
   *
   * @remarks
   * Before using this class, the Registry module must be initialized by calling {@link Registry.initialize}.
   */

  /**
   * Configuration of the badge.
   *
   * Child classes should override this property to reflect their own badge type and options.
   */
  protected configuration: LovelaceBadgeConfig = {
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
      logMessage(lvlFatal, 'Registry is not initialized!');
    }
  }

  /**
   * Get a badge configuration.
   *
   * The configuration should be set by any of the child classes so the badge correctly reflects an entity.
   */
  getConfiguration(): LovelaceBadgeConfig {
    return this.configuration;
  }
}

export default AbstractBadge;
