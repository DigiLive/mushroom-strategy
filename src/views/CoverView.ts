// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { SingleDomainConfig, SupportedDomains } from '../types/strategy/strategy-generics';
import { ViewConfig } from '../types/strategy/strategy-views';
import { localize } from '../utilities/localize';
import AbstractView from './AbstractView';
import { HeaderCardConfig } from '../types/strategy/strategy-cards';

/**
 * Cover View Class.
 *
 * Used to create a view configuration for entities of the cover domain.
 */
class CoverView extends AbstractView {
  /** The domain of the entities that the view is representing. */
  static readonly domain: SupportedDomains = 'cover' as const;

  /** Returns the default configuration object for the view. */
  static getDefaultConfig(): ViewConfig {
    const domainConfig = Registry.strategyOptions.domains[CoverView.domain] as SingleDomainConfig;

    return {
      title: domainConfig.title,
      path: 'covers',
      icon: 'mdi:arrow-up-down-bold-outline',
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
      title: localize('cover.all_covers'),
      subtitle:
        `${Registry.getCountTemplate(CoverView.domain, 'search', '(open|opening|closing)')} ` +
        `${localize('cover.covers')} ` +
        `${localize('generic.unclosed')}`,
    };
  }

  /**
   * Class constructor.
   *
   * @param {ViewConfig} [customConfiguration] Custom view configuration.
   */
  constructor(customConfiguration?: ViewConfig) {
    super();

    this.initializeViewConfig(CoverView.getDefaultConfig(), customConfiguration, CoverView.getViewHeaderCardConfig());
  }
}

export default CoverView;
