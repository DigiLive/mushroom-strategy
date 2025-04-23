// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { CustomHeaderCardConfig } from '../types/strategy/strategy-cards';
import { SupportedDomains } from '../types/strategy/strategy-generics';
import { ViewConfig } from '../types/strategy/strategy-views';
import { localize } from '../utilities/localize';
import AbstractView from './AbstractView';

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
    return {
      title: localize('cover.covers'),
      path: 'covers',
      icon: 'mdi:window-open',
      subview: false,
      headerCardConfiguration: {
        iconOn: 'mdi:arrow-up',
        iconOff: 'mdi:arrow-down',
        onService: 'cover.open_cover',
        offService: 'cover.close_cover',
      },
    };
  }

  /** Returns the default configuration of the view's Header card. */
  static getViewHeaderCardConfig(): CustomHeaderCardConfig {
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
