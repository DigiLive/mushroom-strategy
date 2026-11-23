// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { CustomHeaderCardConfig } from '../types/strategy/strategy-cards';
import { SupportedDomains } from '../types/strategy/strategy-generics';
import { ViewConfig } from '../types/strategy/strategy-views';

import { localize } from '../utilities/localize';

import { Registry } from '../Registry';

import AbstractDomainView from './AbstractDomainView';

/**
 * Fan View Class.
 *
 * Used to create a view configuration for entities of the fan domain.
 */
class FanView extends AbstractDomainView {
  /** The domain of the entities that the view is representing. */
  public static readonly domain: SupportedDomains = 'fan' as const;

  /**
   * Class constructor.
   *
   * @param {Partial<ViewConfig>} [customConfiguration] Custom view configuration overrides.
   */
  public constructor(customConfiguration?: Partial<ViewConfig>) {
    super(FanView.domain, customConfiguration, FanView.getViewHeaderCardConfig());
  }

  /**
   * Returns the default configuration of the view's Header card.
   */
  private static getViewHeaderCardConfig(): CustomHeaderCardConfig {
    return {
      title: localize('fan.all_fans'),
      subtitle:
        `${Registry.getCountTemplate(FanView.domain, 'eq', 'on')} ${localize('fan.fans')} ` + localize('generic.on'),
    };
  }

  /**
   * Returns the default configuration object for the view.
   */
  protected getDefaultConfig(): Partial<ViewConfig> {
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
}

export default FanView;
