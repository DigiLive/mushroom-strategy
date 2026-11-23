// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { CustomHeaderCardConfig } from '../types/strategy/strategy-cards';
import { SupportedDomains } from '../types/strategy/strategy-generics';
import { ViewConfig } from '../types/strategy/strategy-views';

import { localize } from '../utilities/localize';

import { Registry } from '../Registry';

import AbstractDomainView from './AbstractDomainView';

/**
 * Cover View Class.
 *
 * Used to create a view configuration for entities of the cover domain.
 */
class CoverView extends AbstractDomainView {
  /** The domain of the entities that the view is representing. */
  public static readonly domain: SupportedDomains = 'cover' as const;

  /**
   * Class constructor.
   *
   * @param {Partial<ViewConfig>} [customConfiguration] Custom view configuration overrides.
   */
  public constructor(customConfiguration?: Partial<ViewConfig>) {
    super(CoverView.domain, customConfiguration, CoverView.getViewHeaderCardConfig());
  }

  /**
   * Returns the default configuration of the view's Header card.
   */
  private static getViewHeaderCardConfig(): CustomHeaderCardConfig {
    return {
      title: localize('cover.all_covers'),
      subtitle:
        `${Registry.getCountTemplate(CoverView.domain, 'search', '(open|opening|closing)')} ` +
        `${localize('cover.covers')} ` +
        `${localize('generic.unclosed')}`,
    };
  }

  /**
   * Returns the default configuration object for the view.
   */
  protected getDefaultConfig(): Partial<ViewConfig> {
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
}

export default CoverView;
