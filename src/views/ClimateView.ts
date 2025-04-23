// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { CustomHeaderCardConfig } from '../types/strategy/strategy-cards';
import { SupportedDomains } from '../types/strategy/strategy-generics';
import { ViewConfig } from '../types/strategy/strategy-views';
import { localize } from '../utilities/localize';
import AbstractView from './AbstractView';

/**
 * Climate View Class.
 *
 * Used to create a view configuration for entities of the climate domain.
 */
class ClimateView extends AbstractView {
  /**The domain of the entities that the view is representing. */
  static readonly domain: SupportedDomains = 'climate' as const;

  /** Returns the default configuration object for the view. */
  static getDefaultConfig(): ViewConfig {
    return {
      title: localize('climate.climates'),
      path: 'climates',
      icon: 'mdi:thermostat',
      subview: false,
      headerCardConfiguration: {
        showControls: false,
      },
    };
  }

  /** Returns the default configuration of the view's Header card. */
  static getViewHeaderCardConfig(): CustomHeaderCardConfig {
    return {
      title: localize('climate.all_climates'),
      subtitle:
        `${Registry.getCountTemplate(ClimateView.domain, 'ne', 'off')} ${localize('climate.climates')} ` +
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

    this.initializeViewConfig(
      ClimateView.getDefaultConfig(),
      customConfiguration,
      ClimateView.getViewHeaderCardConfig(),
    );
  }
}

export default ClimateView;
