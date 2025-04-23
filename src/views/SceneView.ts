// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { CustomHeaderCardConfig } from '../types/strategy/strategy-cards';
import { ViewConfig } from '../types/strategy/strategy-views';
import { localize } from '../utilities/localize';
import AbstractView from './AbstractView';

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
    return {
      title: localize('scene.scenes'),
      path: 'scenes',
      icon: 'mdi:palette',
      subview: false,
      headerCardConfiguration: {
        showControls: false,
      },
    };
  }

  /** Returns the default configuration of the view's Header card. */
  static getViewHeaderCardConfig(): CustomHeaderCardConfig {
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
