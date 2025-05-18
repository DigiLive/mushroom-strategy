// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { SingleDomainConfig, SupportedDomains } from '../types/strategy/strategy-generics';
import { ViewConfig } from '../types/strategy/strategy-views';
import { localize } from '../utilities/localize';
import AbstractView from './AbstractView';
import { HeaderCardConfig } from '../types/strategy/strategy-cards';

/**
 * Fan View Class.
 *
 * Used to create a view configuration for entities of the fan domain.
 */
class FanView extends AbstractView {
  /** The domain of the entities that the view is representing. */
  static readonly domain: SupportedDomains = 'fan' as const;

  /**
   * Class constructor.
   *
   * @param {ViewConfig} [customConfiguration] Custom view configuration.
   */
  constructor(customConfiguration?: ViewConfig) {
    super();

    this.initializeViewConfig(FanView.getDefaultConfig(), customConfiguration, FanView.getViewHeaderCardConfig());
  }

  /** Returns the default configuration object for the view. */
  static getDefaultConfig(): ViewConfig {
    const domainConfig = Registry.strategyOptions.domains[FanView.domain] as SingleDomainConfig;

    return {
      title: domainConfig.title,
      path: 'fans',
      icon: 'mdi:fan',
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
    return {
      title: localize('fan.all_fans'),
      subtitle:
        `${Registry.getCountTemplate(FanView.domain, 'eq', 'on')} ${localize('fan.fans')} ` + localize('generic.on'),
    };
  }
}

export default FanView;
