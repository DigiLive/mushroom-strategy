// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { CustomHeaderCardConfig } from '../types/strategy/strategy-cards';
import { SupportedDomains } from '../types/strategy/strategy-generics';
import { ViewConfig } from '../types/strategy/strategy-views';
import { localize } from '../utilities/localize';
import AbstractView from './AbstractView';

/**
 * Camera View Class.
 *
 * Used to create a view configuration for entities of the camera domain.
 */
class CameraView extends AbstractView {
  /** The domain of the entities that the view is representing. */
  static readonly domain: SupportedDomains = 'camera' as const;

  /** Returns the default configuration object for the view. */
  static getDefaultConfig(): ViewConfig {
    return {
      title: localize('camera.cameras'),
      path: 'cameras',
      icon: 'mdi:cctv',
      subview: false,
      headerCardConfiguration: {
        showControls: false,
      },
    };
  }

  /** Returns the default configuration of the view's Header card. */
  static getViewHeaderCardConfig(): CustomHeaderCardConfig {
    return {
      title: localize('camera.all_cameras'),
      subtitle:
        `${Registry.getCountTemplate(CameraView.domain, 'ne', 'off')} ${localize('camera.cameras')} ` +
        localize('generic.busy'),
    };
  }

  /**
   * Class constructor.
   *
   * @param {ViewConfig} [customConfiguration] Custom view configuration.
   */
  constructor(customConfiguration?: ViewConfig) {
    super();

    this.initializeViewConfig(CameraView.getDefaultConfig(), customConfiguration, CameraView.getViewHeaderCardConfig());
  }
}

export default CameraView;
