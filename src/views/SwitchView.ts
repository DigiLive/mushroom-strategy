// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { CustomHeaderCardConfig } from '../types/strategy/strategy-cards';
import { ViewConfig } from '../types/strategy/strategy-views';
import { localize } from '../utilities/localize';
import AbstractView from './AbstractView';

/**
 * Switch View Class.
 *
 * Used to create a view configuration for entities of the switch domain.
 */
class SwitchView extends AbstractView {
  /** The domain of the entities that the view is representing. */
  static readonly domain = 'switch' as const;

  /** Returns the default configuration object for the view. */
  static getDefaultConfig(): ViewConfig {
    return {
      title: localize('switch.switches'),
      path: 'switches',
      icon: 'mdi:dip-switch',
      subview: false,
      headerCardConfiguration: {
        iconOn: 'mdi:power-plug',
        iconOff: 'mdi:power-plug-off',
        onService: 'switch.turn_on',
        offService: 'switch.turn_off',
      },
    };
  }

  /** Returns the default configuration of the view's Header card. */
  static getViewHeaderCardConfig(): CustomHeaderCardConfig {
    return {
      title: localize('switch.all_switches'),
      subtitle:
        `${Registry.getCountTemplate(SwitchView.domain, 'eq', 'on')} ${localize('switch.switches')} ` +
        localize('generic.on'),
    };
  }

  /**
   * Class constructor.
   *
   * @param {ViewConfig} [customConfiguration] Custom view configuration.
   */
  constructor(customConfiguration?: ViewConfig) {
    super();

    this.initializeViewConfig(SwitchView.getDefaultConfig(), customConfiguration, SwitchView.getViewHeaderCardConfig());
  }
}

export default SwitchView;
