// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { CustomHeaderCardConfig } from '../types/strategy/strategy-cards';
import { SupportedDomains } from '../types/strategy/strategy-generics';
import { ViewConfig } from '../types/strategy/strategy-views';
import { localize } from '../utilities/localize';
import AbstractView from './AbstractView';

/**
 * Fan View Class.
 *
 * Used to create a view configuration for entities of the fan domain.
 */
class FanView extends AbstractView {
  /** The domain of the entities that the view is representing. */
  static readonly domain: SupportedDomains = 'fan' as const;

  /** Returns the default configuration object for the view. */
  static getDefaultConfig(): ViewConfig {
    return {
      title: localize('fan.fans'),
      path: 'fans',
      icon: 'mdi:fan',
      subview: false,
      headerCardConfiguration: {
        iconOn: 'mdi:fan',
        iconOff: 'mdi:fan-off',
        onService: 'fan.turn_on',
        offService: 'fan.turn_off',
      },
    };
  }

  /** Returns the default configuration of the view's Header card. */
  static getViewHeaderCardConfig(): CustomHeaderCardConfig {
    return {
      title: localize('fan.all_fans'),
      subtitle:
        `${Registry.getCountTemplate(FanView.domain, 'eq', 'on')} ${localize('fan.fans')} ` + localize('generic.on'),
    };
  }

  /**
   * Class constructor.
   *
   * @param {ViewConfig} [customConfiguration] Custom view configuration.
   */
  constructor(customConfiguration?: ViewConfig) {
    super();

    this.initializeViewConfig(FanView.getDefaultConfig(), customConfiguration, FanView.getViewHeaderCardConfig());
  }
}

export default FanView;
