// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { CustomHeaderCardConfig } from '../types/strategy/strategy-cards';
import { ViewConfig } from '../types/strategy/strategy-views';
import { localize } from '../utilities/localize';
import AbstractView from './AbstractView';

/**
 * Vacuum View Class.
 *
 * Used to create a view configuration for entities of the vacuum domain.
 */
class VacuumView extends AbstractView {
  /** The domain of the entities that the view is representing. */
  static readonly domain = 'vacuum' as const;

  /** Returns the default configuration object for the view. */
  static getDefaultConfig(): ViewConfig {
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

  /** Returns the default configuration of the view's Header card. */
  static getViewHeaderCardConfig(): CustomHeaderCardConfig {
    return {
      title: localize('vacuum.all_vacuums'),
      subtitle:
        Registry.getCountTemplate(VacuumView.domain, 'in', '[cleaning, returning]') +
        ` ${localize('vacuum.vacuums')} ${localize('generic.busy')}`,
    };
  }

  /**
   * Class constructor.
   *
   * @param {ViewConfig} [customConfiguration] Custom view configuration.
   */
  constructor(customConfiguration?: ViewConfig) {
    super();

    this.initializeViewConfig(VacuumView.getDefaultConfig(), customConfiguration, VacuumView.getViewHeaderCardConfig());
  }
}

export default VacuumView;
