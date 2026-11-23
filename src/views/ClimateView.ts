// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { CustomHeaderCardConfig } from '../types/strategy/strategy-cards';
import { SupportedDomains } from '../types/strategy/strategy-generics';
import { ViewConfig } from '../types/strategy/strategy-views';

import { localize } from '../utilities/localize';

import { Registry } from '../Registry';

import AbstractDomainView from './AbstractDomainView';

/**
 * Climate View Class.
 *
 * Used to create a view configuration for entities of the climate domain.
 */
class ClimateView extends AbstractDomainView {
  /** The domain of the entities that the view is representing. */
  public static readonly domain: SupportedDomains = 'climate' as const;

  /**
   * Class constructor.
   *
   * @param {Partial<ViewConfig>} [customConfiguration] Custom view configuration overrides.
   */
  public constructor(customConfiguration?: Partial<ViewConfig>) {
    super(ClimateView.domain, customConfiguration, ClimateView.getViewHeaderCardConfig());
  }

  /**
   * Returns the default configuration of the view's Header card.
   */
  private static getViewHeaderCardConfig(): CustomHeaderCardConfig {
    return {
      title: localize('climate.all_climates'),
      subtitle:
        `${Registry.getCountTemplate(ClimateView.domain, 'ne', 'off')} ${localize('climate.climates')} ` +
        localize('generic.busy'),
    };
  }

  /**
   * Returns the default configuration object for the view.
   */
  protected getDefaultConfig(): Partial<ViewConfig> {
    return {
      title: localize('climate.climates'),
      path: 'climates',
      icon: 'mdi:thermostat',
      subview: false,
      headerCardConfiguration: {
        show_controls: false,
      },
    };
  }
}

export default ClimateView;
