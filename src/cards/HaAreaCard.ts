;
// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { AreaCardConfig } from '@digilive/home-assistant-frontend-types';



import { CustomCardConfig } from '../types/strategy/strategy-cards';
import { StrategyArea } from '../types/strategy/strategy-generics';



import { localize } from '../utilities/localize';



import { Registry } from '../Registry';



import AbstractCard from './AbstractCard';


/**
 * Home Assistant Area Card Class
 *
 * Used to create card configuration for an entry of the HASS area registry.
 */
class HaAreaCard extends AbstractCard<AreaCardConfig> {
  /**
   * Class constructor.
   *
   * @param {StrategyArea} area The HASS area entry to create a card configuration for.
   * @param {CustomCardConfig<AreaCardConfig>} [customConfiguration] Custom card configuration overrides.
   */
  public constructor(area: StrategyArea, customConfiguration?: CustomCardConfig<AreaCardConfig>) {
    super(area, customConfiguration);
  }

  /**
   * Prevent custom configurations from overriding the fixed `area` card type.
   *
   * @returns {boolean} Always `false`.
   */
  protected override allowTypeOverride(): boolean {
    return false;
  }

  /**
   * Returns the default configuration object for the card.
   *
   * @returns {Partial<AreaCardConfig>} The default area card configuration.
   */
  protected override getDefaultConfig(): Partial<AreaCardConfig> {
    const areaEntry = this.entity as StrategyArea;
    const config: Partial<AreaCardConfig> = {
      type: 'area',
      area: areaEntry.area_id,
      navigation_path: areaEntry.area_id,
    };

    if (Registry.strategyOptions.show_positions) {
      config.name = `${areaEntry.name} - ${localize('generic.ordering_position')}: ${areaEntry.order}`;
    }

    return config;
  }
}

export default HaAreaCard;
