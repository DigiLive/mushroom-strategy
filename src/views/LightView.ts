// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { ViewConfig } from '../types/strategy/strategy-views';
import { localize } from '../utilities/localize';
import AbstractView from './AbstractView';
import { HeaderCardConfig } from '../types/strategy/strategy-cards';
import { SingleDomainConfig } from '../types/strategy/strategy-generics';

/**
 * Light View Class.
 *
 * Used to create a view for entities of the light domain.
 *
 * @class LightView
 * @extends AbstractView
 */
class LightView extends AbstractView {
  /** The domain of the entities that the view is representing. */
  static readonly domain = 'light' as const;

  constructor(customConfiguration?: ViewConfig) {
    super();

    this.initializeViewConfig(LightView.getDefaultConfig(), customConfiguration, LightView.getViewHeaderCardConfig());
  }

  /** Returns the default configuration object for the view. */
  static getDefaultConfig(): ViewConfig {
    const domainConfig = Registry.strategyOptions.domains[LightView.domain] as SingleDomainConfig;

    return {
      title: domainConfig.title,
      path: 'lights',
      icon: 'mdi:lightbulb-group',
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
      title: localize('light.all_lights'),
      subtitle:
        `${Registry.getCountTemplate(LightView.domain, 'eq', 'on')} ${localize('light.lights')} ` +
        localize('generic.on'),
    };
  }
}

export default LightView;
