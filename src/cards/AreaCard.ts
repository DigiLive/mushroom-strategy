import { AreaRegistryEntry } from '../types/homeassistant/data/area_registry';
import { TemplateCardConfig } from '../types/lovelace-mushroom/cards/template-card-config';
import AbstractCard from './AbstractCard';

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
   * @param {AreaRegistryEntry} area The HASS area to create a card configuration for.
   * @param {TemplateCardConfig} [customConfiguration] Custom card configuration.
   */
  constructor(area: AreaRegistryEntry, customConfiguration?: TemplateCardConfig) {
    super(area);

    const configuration = AreaCard.getDefaultConfig();

    let customConfig = customConfiguration;

    configuration.primary = area.name;
    configuration.icon = area.icon || configuration.icon;

    if (configuration.tap_action && 'navigation_path' in configuration.tap_action) {
      configuration.tap_action.navigation_path = area.area_id;
    }

    // Don't override the default card type if default is set in the strategy options.
    if (customConfig && customConfig.type === 'default') {
      customConfig = { ...customConfig, type: configuration.type };
    }

    this.configuration = { ...this.configuration, ...configuration, ...customConfig };
  }
}

export default AreaCard;
