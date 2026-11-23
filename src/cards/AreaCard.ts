// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { TemplateCardConfig } from '@digilive/lovelace-mushroom-types';

import { CustomCardConfig } from '../types/strategy/strategy-cards';
import { StrategyArea } from '../types/strategy/strategy-generics';

import { localize } from '../utilities/localize';

import { Registry } from '../Registry';

import AbstractCard from './AbstractCard';

/**
 * Area Card Class
 *
 * Used to create card configuration for an entry of the HASS area registry.
 */
class AreaCard extends AbstractCard<TemplateCardConfig> {
  /**
   * Class constructor.
   *
   * @param {StrategyArea} area The HASS area to create a card configuration for.
   * @param {CustomCardConfig<TemplateCardConfig>} [customConfiguration] Custom card configuration.
   */
  public constructor(area: StrategyArea, customConfiguration?: CustomCardConfig<TemplateCardConfig>) {
    super(area, customConfiguration);

    this.configuration.primary = area.name;
    this.configuration.icon = area.icon ?? this.configuration.icon;

    if (Registry.strategyOptions.show_positions) {
      this.configuration.secondary = `${localize('generic.ordering_position')}: ${area.order}`;
    }

    if (this.configuration.tap_action && 'navigation_path' in this.configuration.tap_action) {
      this.configuration.tap_action.navigation_path = area.area_id;
    }

    // Don't override the card type if set differently in the strategy options.
    if (this.configuration.type !== undefined) {
      this.configuration.type = this.getDefaultConfig().type ?? this.configuration.type;
    }
  }

  /** Returns the default configuration object for the card. */
  protected getDefaultConfig(): Partial<TemplateCardConfig> {
    return {
      type: 'custom:mushroom-template-card',
      primary: undefined,
      icon: 'mdi:floor-plan',
      icon_color: 'blue',
      tap_action: { action: 'navigate', navigation_path: '' },
      hold_action: { action: 'none' },
    };
  }
}

export default AreaCard;
