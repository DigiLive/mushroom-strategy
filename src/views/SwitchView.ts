// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { ViewConfig } from '../types/strategy/strategy-views';
import { localize } from '../utilities/localize';
import AbstractView from './AbstractView';
import { HeaderCardConfig } from '../types/strategy/strategy-cards';
import { SingleDomainConfig } from '../types/strategy/strategy-generics';

/**
 * Switch View Class.
 *
 * Used to create a view configuration for entities of the switch domain.
 */
class SwitchView extends AbstractView {
  /** The domain of the entities that the view is representing. */
  static readonly domain = 'switch' as const;

  /**
   * Class constructor.
   *
   * @param {ViewConfig} [customConfiguration] Custom view configuration.
   */
  constructor(customConfiguration?: ViewConfig) {
    super();

    this.initializeViewConfig(SwitchView.getDefaultConfig(), customConfiguration, SwitchView.getViewHeaderCardConfig());
  }

  /** Returns the default configuration object for the view. */
  static getDefaultConfig(): ViewConfig {
    const domainConfig = Registry.strategyOptions.domains[SwitchView.domain] as SingleDomainConfig;

    return {
      title: domainConfig.title,
      path: 'switches',
      icon: 'mdi:dip-switch',
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
      title: localize('switch.all_switches'),
      subtitle:
        `${Registry.getCountTemplate(SwitchView.domain, 'eq', 'on')} ${localize('switch.switches')} ` +
        localize('generic.on'),
    };
  }
}

export default SwitchView;
