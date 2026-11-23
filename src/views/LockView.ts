// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { CustomHeaderCardConfig } from '../types/strategy/strategy-cards';
import { SupportedDomains } from '../types/strategy/strategy-generics';
import { ViewConfig } from '../types/strategy/strategy-views';

import { localize } from '../utilities/localize';

import { Registry } from '../Registry';

import AbstractDomainView from './AbstractDomainView';

/**
 * Lock View Class.
 *
 * Used to create a view configuration for entities of the lock domain.
 */
class LockView extends AbstractDomainView {
  /** The domain of the entities that the view is representing. */
  public static readonly domain: SupportedDomains = 'lock' as const;

  /**
   * Class constructor.
   *
   * @param {Partial<ViewConfig>} [customConfiguration] Custom view configuration overrides.
   */
  public constructor(customConfiguration?: Partial<ViewConfig>) {
    super(LockView.domain, customConfiguration, LockView.getViewHeaderCardConfig());
  }

  /**
   * Returns the default configuration of the view's Header card.
   */
  private static getViewHeaderCardConfig(): CustomHeaderCardConfig {
    return {
      title: localize('lock.all_locks'),
      subtitle:
        `${Registry.getCountTemplate(LockView.domain, 'ne', 'locked')} ${localize('lock.locks')} ` +
        localize('lock.unlocked'),
    };
  }

  /**
   * Returns the default configuration object for the view.
   */
  protected getDefaultConfig(): Partial<ViewConfig> {
    return {
      title: localize('lock.locks'),
      path: 'locks',
      icon: 'mdi:lock-open',
      subview: false,
      headerCardConfiguration: {
        iconOn: 'mdi:lock-open',
        iconOff: 'mdi:lock',
        onService: 'lock.lock',
        offService: 'lock.unlock',
      },
    };
  }
}

export default LockView;
