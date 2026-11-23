import { LovelaceBadgeConfig } from '@digilive/home-assistant-frontend-types';

import { logMessage, lvlFatal } from '../utilities/debug';

import { Registry } from '../Registry';

/**
 * Abstract Badge class.
 *
 * To create a badge configuration, this class should be extended by a child class.
 * Child classes should provide their default configuration so the badge correctly reflects the entity.
 *
 * @remarks
 * Before using this class, the Registry module must be initialized by calling {@link Registry.initialize}.
 */
abstract class AbstractBadge<TConfig extends LovelaceBadgeConfig = LovelaceBadgeConfig> {
  /**
   * Configuration of the badge.
   *
   * Child classes provide their own defaults via {@link getDefaultConfig} and can adjust
   * this configuration as needed.
   */
  protected configuration: Partial<TConfig>;

  /**
   * Class constructor.
   *
   * @remarks
   * Before this class can be used, the Registry module must be initialized by calling {@link Registry.initialize}.
   */
  protected constructor() {
    if (!Registry.initialized) {
      logMessage(lvlFatal, 'Registry is not initialized!');
    }

    this.configuration = {
      type: 'template',
    } as Partial<TConfig>;
  }

  /**
   * Get a badge configuration.
   *
   * The configuration should be set by any of the child classes so the badge correctly reflects an entity.
   */
  public getConfiguration(): TConfig {
    return this.configuration as TConfig;
  }

  /**
   * Builds and stores the badge configuration by merging base defaults, child defaults, and custom overrides.
   *
   * @template TConfig Badge configuration type.
   * @param {Partial<TConfig>} [customConfiguration] Custom badge configuration overrides.
   */
  protected setConfiguration(customConfiguration?: Partial<TConfig>): void {
    const baseDefaultConfig = {
      type: 'template',
    } as Partial<TConfig>;

    this.configuration = {
      ...baseDefaultConfig,
      ...this.getDefaultConfig(),
      ...customConfiguration,
    };
  }

  /** Returns the default configuration object for the badge. */
  protected abstract getDefaultConfig(): Partial<TConfig>;
}

export default AbstractBadge;
