// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { CustomHeaderCardConfig } from '../types/strategy/strategy-cards';
import { SupportedDomains } from '../types/strategy/strategy-generics';
import { ViewConfig } from '../types/strategy/strategy-views';

import { localize } from '../utilities/localize';

import { Registry } from '../Registry';

import AbstractDomainView from './AbstractDomainView';

/**
 * Valve View Class.
 *
 * Used to create a view configuration for entities of the valve domain.
 */
class ValveView extends AbstractDomainView {
  /** The domain of the entities that the view is representing. */
  public static readonly domain: SupportedDomains = 'valve' as const;

  /**
   * Class constructor.
   *
   * @param {Partial<ViewConfig>} [customConfiguration] Custom view configuration overrides.
   */
  public constructor(customConfiguration?: Partial<ViewConfig>) {
    super(ValveView.domain, customConfiguration, ValveView.getViewHeaderCardConfig());
  }

  /**
   * Returns the default configuration of the view's Header card.
   */
  private static getViewHeaderCardConfig(): CustomHeaderCardConfig {
    return {
      title: localize('valve.all_valves'),
      subtitle:
        Registry.getCountTemplate(ValveView.domain, 'in', '[closed]') +
        ` ${localize('valve.valves')} ${localize('valve.unclosed')}`,
    };
  }

  /**
   * Returns the default configuration object for the view.
   */
  protected getDefaultConfig(): Partial<ViewConfig> {
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
}

export default ValveView;
