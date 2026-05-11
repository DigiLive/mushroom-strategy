import { TemplateCardConfig } from '../types/lovelace-mushroom/cards/template-card-config';
import AbstractCard from './AbstractCard';
import { Registry } from '../Registry';
import { StrategyArea } from '../types/strategy/strategy-generics';
import { localize } from '../utilities/localize';

/**
 * Area Card Class
 *
 * Used to create card configuration for an entry of the HASS area registry.
 */
class AreaCard extends AbstractCard {
  /** Returns the default configuration object for the card. */
  static getDefaultConfig(): TemplateCardConfig {
    return {
      type: 'custom:mushroom-template-card',
      primary: undefined,
      icon: 'mdi:floor-plan',
      icon_color: 'blue',
      tap_action: { action: 'navigate', navigation_path: '' },
      hold_action: { action: 'none' },
    };
  }

  /**
   * Class constructor.
   *
   * @param {StrategyArea} area The HASS area to create a card configuration for.
   * @param {TemplateCardConfig} [customConfiguration] Custom card configuration.
   */
  constructor(area: StrategyArea, customConfiguration?: TemplateCardConfig) {
    super(area);

    const configuration = AreaCard.getDefaultConfig();

    let customConfig = customConfiguration;

    configuration.primary = area.name;
    configuration.icon = area.icon ?? configuration.icon;

    if (Registry.strategyOptions.show_positions) {
      configuration.secondary = `${localize('generic.ordering_position')}: ${area.order}`;
    }

    if (configuration.tap_action && 'navigation_path' in configuration.tap_action) {
      configuration.tap_action.navigation_path = area.area_id;
    }

    // Don't override the card type if set differently in the strategy options.
    if (customConfig) {
      customConfig = { ...customConfig, type: configuration.type };
    }

    this.configuration = { ...this.configuration, ...configuration, ...customConfig };
  }
}

export default AreaCard;
