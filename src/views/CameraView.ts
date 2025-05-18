// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { SingleDomainConfig, SupportedDomains } from '../types/strategy/strategy-generics';
import { ViewConfig } from '../types/strategy/strategy-views';
import { localize } from '../utilities/localize';
import AbstractView from './AbstractView';
import { HeaderCardConfig } from '../types/strategy/strategy-cards';

/**
 * Camera View Class.
 *
 * Used to create a view configuration for entities of the camera domain.
 */
class CameraView extends AbstractView {
  /** The domain of the entities that the view is representing. */
  static readonly domain: SupportedDomains = 'camera' as const;

  /**
   * Class constructor.
   *
   * @param {ViewConfig} [customConfiguration] Custom view configuration.
   */
  constructor(customConfiguration?: ViewConfig) {
    super();

    this.initializeViewConfig(CameraView.getDefaultConfig(), customConfiguration, CameraView.getViewHeaderCardConfig());
  }

  /** Returns the default configuration object for the view. */
  static getDefaultConfig(): ViewConfig {
    const domainConfig = Registry.strategyOptions.domains[CameraView.domain] as SingleDomainConfig;

    return {
      title: domainConfig.title,
      path: 'cameras',
      icon: 'mdi:cctv',
      subview: false,
      headerCardConfiguration: {
        // FIXME: This should be named "show_controls". Also in other files and Wiki.
        showControls: domainConfig.showControls,
        on: domainConfig.on,
        off: domainConfig.off,
      },
    };
  }

  /** Returns the default configuration of the view's Header card. */
  static getViewHeaderCardConfig(): HeaderCardConfig {
    return {
      title: localize('camera.all_cameras'),
      subtitle:
        `${Registry.getCountTemplate(CameraView.domain, 'ne', 'off')} ${localize('camera.cameras')} ` +
        localize('generic.busy'),
    };
  }
}

export default CameraView;
