// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { CustomHeaderCardConfig } from '../types/strategy/strategy-cards';
import { SupportedDomains } from '../types/strategy/strategy-generics';
import { ViewConfig } from '../types/strategy/strategy-views';

import { localize } from '../utilities/localize';

import { Registry } from '../Registry';

import AbstractDomainView from './AbstractDomainView';

/**
 * Switch View Class.
 *
 * Used to create a view configuration for entities of the switch domain.
 */
class SwitchView extends AbstractDomainView {
  /** The domain of the entities that the view is representing. */
  public static readonly domain: SupportedDomains = 'switch' as const;

  /**
   * Class constructor.
   *
   * @param {Partial<ViewConfig>} [customConfiguration] Custom view configuration overrides.
   */
  public constructor(customConfiguration?: Partial<ViewConfig>) {
    super(SwitchView.domain, customConfiguration, SwitchView.getViewHeaderCardConfig());
  }

  /**
   * Returns the default configuration of the view's Header card.
   */
  private static getViewHeaderCardConfig(): CustomHeaderCardConfig {
    return {
      title: localize('switch.all_switches'),
      subtitle:
        `${Registry.getCountTemplate(SwitchView.domain, 'eq', 'on')} ${localize('switch.switches')} ` +
        localize('generic.on'),
    };
  }

  /**
   * Returns the default configuration object for the view.
   */
  protected getDefaultConfig(): Partial<ViewConfig> {
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
}

export default SwitchView;
