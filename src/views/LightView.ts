// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { CustomHeaderCardConfig } from '../types/strategy/strategy-cards';
import { SupportedDomains } from '../types/strategy/strategy-generics';
import { ViewConfig } from '../types/strategy/strategy-views';

import { localize } from '../utilities/localize';

import { Registry } from '../Registry';

import AbstractDomainView from './AbstractDomainView';

/**
 * Light View Class.
 *
 * Used to create a view for entities of the light domain.
 *
 * @class LightView
 * @extends AbstractDomainView
 */
class LightView extends AbstractDomainView {
  /** The domain of the entities that the view is representing. */
  public static readonly domain: SupportedDomains = 'light' as const;

  /**
   * Class constructor.
   *
   * @param {Partial<ViewConfig>} [customConfiguration] Custom view configuration overrides.
   */
  public constructor(customConfiguration?: Partial<ViewConfig>) {
    super(LightView.domain, customConfiguration, LightView.getViewHeaderCardConfig());
  }

  /**
   * Returns the default configuration of the view's Header card.
   */
  private static getViewHeaderCardConfig(): CustomHeaderCardConfig {
    return {
      title: localize('light.all_lights'),
      subtitle:
        `${Registry.getCountTemplate(LightView.domain, 'eq', 'on')} ${localize('light.lights')} ` +
        localize('generic.on'),
    };
  }

  /**
   * Returns the default configuration object for the view.
   */
  protected getDefaultConfig(): Partial<ViewConfig> {
    return {
      title: localize('light.lights'),
      path: 'lights',
      icon: 'mdi:lightbulb-group',
      subview: false,
      headerCardConfiguration: {
        iconOn: 'mdi:lightbulb',
        iconOff: 'mdi:lightbulb-off',
        onService: 'light.turn_on',
        offService: 'light.turn_off',
      },
    };
  }
}

export default LightView;
