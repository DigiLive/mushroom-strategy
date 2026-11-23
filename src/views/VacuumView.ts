// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { CustomHeaderCardConfig } from '../types/strategy/strategy-cards';
import { SupportedDomains } from '../types/strategy/strategy-generics';
import { ViewConfig } from '../types/strategy/strategy-views';

import { localize } from '../utilities/localize';

import { Registry } from '../Registry';

import AbstractDomainView from './AbstractDomainView';

/**
 * Vacuum View Class.
 *
 * Used to create a view configuration for entities of the vacuum domain.
 */
class VacuumView extends AbstractDomainView {
  /** The domain of the entities that the view is representing. */
  public static readonly domain: SupportedDomains = 'vacuum' as const;

  /**
   * Class constructor.
   *
   * @param {Partial<ViewConfig>} [customConfiguration] Custom view configuration overrides.
   */
  public constructor(customConfiguration?: Partial<ViewConfig>) {
    super(VacuumView.domain, customConfiguration, VacuumView.getViewHeaderCardConfig());
  }

  /**
   * Returns the default configuration of the view's Header card.
   */
  private static getViewHeaderCardConfig(): CustomHeaderCardConfig {
    return {
      title: localize('vacuum.all_vacuums'),
      subtitle:
        Registry.getCountTemplate(VacuumView.domain, 'in', '[cleaning, returning]') +
        ` ${localize('vacuum.vacuums')} ${localize('generic.busy')}`,
    };
  }

  /**
   * Returns the default configuration object for the view.
   */
  protected getDefaultConfig(): Partial<ViewConfig> {
    return {
      title: localize('vacuum.vacuums'),
      path: 'vacuums',
      icon: 'mdi:robot-vacuum',
      subview: false,
      headerCardConfiguration: {
        iconOn: 'mdi:robot-vacuum',
        iconOff: 'mdi:robot-vacuum-off',
        onService: 'vacuum.start',
        offService: 'vacuum.stop',
      },
    };
  }
}

export default VacuumView;
