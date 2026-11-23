// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { CustomHeaderCardConfig } from '../types/strategy/strategy-cards';
import { SupportedDomains } from '../types/strategy/strategy-generics';
import { ViewConfig } from '../types/strategy/strategy-views';

import { localize } from '../utilities/localize';

import { Registry } from '../Registry';

import AbstractDomainView from './AbstractDomainView';

/**
 * Camera View Class.
 *
 * Used to create a view configuration for entities of the camera domain.
 */
class CameraView extends AbstractDomainView {
  /** The domain of the entities that the view is representing. */
  public static readonly domain: SupportedDomains = 'camera' as const;

  /**
   * Class constructor.
   *
   * @param {Partial<ViewConfig>} [customConfiguration] Custom view configuration overrides.
   */
  public constructor(customConfiguration?: Partial<ViewConfig>) {
    super(CameraView.domain, customConfiguration, CameraView.getViewHeaderCardConfig());
  }

  /**
   * Returns the default configuration of the view's Header card.
   */
  private static getViewHeaderCardConfig(): CustomHeaderCardConfig {
    return {
      title: localize('camera.all_cameras'),
      subtitle:
        `${Registry.getCountTemplate(CameraView.domain, 'ne', 'off')} ${localize('camera.cameras')} ` +
        localize('generic.busy'),
    };
  }

  /**
   * Returns the default configuration object for the view.
   */
  protected getDefaultConfig(): Partial<ViewConfig> {
    return {
      title: localize('camera.cameras'),
      path: 'cameras',
      icon: 'mdi:cctv',
      subview: false,
      headerCardConfiguration: {
        show_controls: false,
      },
    };
  }
}

export default CameraView;
