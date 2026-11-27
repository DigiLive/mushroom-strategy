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
  }

  /**
   * Prevent custom configurations from overriding the fixed `custom:mushroom-template-card` type.
   *
   * @returns {boolean} Always `false`.
   */
  protected override allowTypeOverride(): boolean {
    return false;
  }

  /**
   * Returns the default configuration object for the card.
   *
   * @returns {Partial<TemplateCardConfig>} The default mushroom template card configuration.
   */
  protected override getDefaultConfig(): Partial<TemplateCardConfig> {
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
