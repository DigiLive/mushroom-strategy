// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { CustomHeaderCardConfig } from '../types/strategy/strategy-cards';
import { SupportedDomains } from '../types/strategy/strategy-generics';
import { ViewConfig } from '../types/strategy/strategy-views';

import { localize } from '../utilities/localize';

import AbstractDomainView from './AbstractDomainView';

/**
 * Scene View Class.
 *
 * Used to create a view configuration for entities of the scene domain.
 */
class SceneView extends AbstractDomainView {
  /** The domain of the entities that the view is representing. */
  public static readonly domain: SupportedDomains = 'scene' as const;

  /**
   * Class constructor.
   *
   * @param {Partial<ViewConfig>} [customConfiguration] Custom view configuration overrides.
   */
  public constructor(customConfiguration?: Partial<ViewConfig>) {
    super(SceneView.domain, customConfiguration, SceneView.getViewHeaderCardConfig());
  }

  /**
   * Returns the default configuration of the view's Header card.
   */
  private static getViewHeaderCardConfig(): CustomHeaderCardConfig {
    return {};
  }

  /**
   * Returns the default configuration object for the view.
   */
  protected getDefaultConfig(): Partial<ViewConfig> {
    return {
      title: localize('scene.scenes'),
      path: 'scenes',
      icon: 'mdi:palette',
      subview: false,
      headerCardConfiguration: {
        show_controls: false,
      },
    };
  }
}

export default SceneView;
