import {
  LovelaceCardConfig,
  LovelaceSectionRawConfig,
  LovelaceViewConfig,
} from '@digilive/home-assistant-frontend-types';

import { ViewConfig } from '../types/strategy/strategy-views';

import { logMessage, lvlFatal } from '../utilities/debug';

import { Registry } from '../Registry';

/**
 * Abstract View Class.
 *
 * To create a view configuration, this class should be extended by a child class.
 * Child classes should provide their default configuration via {@link getDefaultConfig}.
 *
 * @remarks
 * Before this class can be used, the Registry module must be initialized by calling {@link Registry.initialize}.
 */
export default abstract class AbstractView<TConfig extends ViewConfig = ViewConfig> {
  /**
   * The view configuration.
   *
   * Child classes provide their own defaults via {@link getDefaultConfig} and can adjust
   * this configuration as needed.
   */
  protected configuration: Partial<TConfig>;

  /**
   * Class constructor.
   *
   * @template TConfig The configuration of the type of the view.
   * @param {Partial<TConfig>} [customConfiguration] Custom view configuration overrides.
   *
   * @remarks
   * Before this class can be used, the Registry module must be initialized by calling {@link Registry.initialize}.
   */
  protected constructor(customConfiguration?: Partial<TConfig>) {
    if (!Registry.initialized) {
      logMessage(lvlFatal, 'Registry is not initialized!');
    }

    const baseDefaultConfig = {
      icon: 'mdi:view-dashboard',
      subview: false,
    } as Partial<TConfig>;

    this.configuration = {
      ...baseDefaultConfig,
      ...this.getDefaultConfig(),
      ...customConfiguration,
    };
  }

  // noinspection JSUnusedGlobalSymbols Method is dynamically called.
  /**
   * Get a view configuration.
   */
  public abstract getView(): Promise<LovelaceViewConfig | false>;

  /** Returns the default configuration object for the view. */
  protected abstract getDefaultConfig(): Partial<TConfig>;

  /**
   * Create the configuration of the cards or sections to include in the view.
   */
  protected abstract createSections(): Promise<LovelaceCardConfig[] | LovelaceSectionRawConfig[]>;
}
