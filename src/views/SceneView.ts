// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { ViewConfig } from '../types/strategy/strategy-views';
import AbstractView from './AbstractView';
import { HeaderCardConfig } from '../types/strategy/strategy-cards';
import { Registry } from '../Registry';
import { SingleDomainConfig } from '../types/strategy/strategy-generics';

/**
 * Scene View Class.
 *
 * sed to create a view configuration for entities of the scene domain.
 */
class SceneView extends AbstractView {
  /** The domain of the entities that the view is representing. */
  static readonly domain = 'scene' as const;

  /** Returns the default configuration object for the view. */
  static getDefaultConfig(): ViewConfig {
    const domainConfig = Registry.strategyOptions.domains[SceneView.domain] as SingleDomainConfig;

    return {
      title: domainConfig.title,
      path: 'scenes',
      icon: 'mdi:palette',
      subview: false,
      headerCardConfiguration: {
        showControls: domainConfig.showControls,
        on: domainConfig.on,
        off: domainConfig.off,
      },
    };
  }

  /** Returns the default configuration of the view's Header card. */
  static getViewHeaderCardConfig(): HeaderCardConfig {
    return {};
  }

  /**
   * Class constructor.
   *
   * @param {ViewConfig} [customConfiguration] Custom view configuration.
   */
  constructor(customConfiguration?: ViewConfig) {
    super();

    this.initializeViewConfig(SceneView.getDefaultConfig(), customConfiguration, SceneView.getViewHeaderCardConfig());
  }
}

export default SceneView;
