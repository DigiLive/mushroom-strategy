// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { CustomHeaderCardConfig } from '../types/strategy/strategy-cards';
import { ViewConfig } from '../types/strategy/strategy-views';
import { localize } from '../utilities/localize';
import AbstractView from './AbstractView';

/**
 * Valve View Class.
 *
 * Used to create a view configuration for entities of the valve domain.
 */
class ValveView extends AbstractView {
  /** The domain of the entities that the view is representing. */
  static readonly domain = 'valve' as const;

  /**
   * Class constructor.
   *
   * @param {ViewConfig} [customConfiguration] Custom view configuration.
   */
  constructor(customConfiguration?: ViewConfig) {
    super();

    this.initializeViewConfig(ValveView.getDefaultConfig(), customConfiguration, ValveView.getViewHeaderCardConfig());
  }

  /** Returns the default configuration object for the view. */
  static getDefaultConfig(): ViewConfig {
    return {
      title: localize('valve.valves'),
      path: 'valves',
      icon: 'mdi:valve',
      subview: false,
      headerCardConfiguration: {
        iconOn: 'mdi:valve-open',
        iconOff: 'mdi:valve-closed',
        onService: 'valve.open_valve',
        offService: 'valve.close_valve',
      },
    };
  }

  /** Returns the default configuration of the view's Header card. */
  static getViewHeaderCardConfig(): CustomHeaderCardConfig {
    return {
      title: localize('valve.all_valves'),
      subtitle:
        Registry.getCountTemplate(ValveView.domain, 'in', '[closed]') +
        ` ${localize('valve.valves')} ${localize('valve.unclosed')}`,
    };
  }
}

export default ValveView;
