// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { ViewConfig } from '../types/strategy/strategy-views';
import { localize } from '../utilities/localize';
import AbstractView from './AbstractView';
import { HeaderCardConfig } from '../types/strategy/strategy-cards';
import { SingleDomainConfig } from '../types/strategy/strategy-generics';

/**
 * Lock View Class.
 *
 * Used to create a view configuration for entities of the lock domain.
 */
class LockView extends AbstractView {
  /** The domain of the entities that the view is representing. */
  static readonly domain = 'lock' as const;

  /** Returns the default configuration object for the view. */
  static getDefaultConfig(): ViewConfig {
    const domainConfig = Registry.strategyOptions.domains[LockView.domain] as SingleDomainConfig;

    return {
      title: domainConfig.title,
      path: 'locks',
      icon: 'mdi:lock-open',
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
      title: localize('lock.all_locks'),
      subtitle:
        `${Registry.getCountTemplate(LockView.domain, 'ne', 'locked')} ${localize('lock.locks')} ` +
        localize('lock.unlocked'),
    };
  }

  /**
   * Class constructor.
   *
   * @param {ViewConfig} [customConfiguration] Custom view configuration.
   */
  constructor(customConfiguration?: ViewConfig) {
    super();

    this.initializeViewConfig(LockView.getDefaultConfig(), customConfiguration, LockView.getViewHeaderCardConfig());
  }
}

export default LockView;
