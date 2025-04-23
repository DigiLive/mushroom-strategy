// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { AreaRegistryEntry } from '../types/homeassistant/data/area_registry';
import { AreaCardConfig } from '../types/homeassistant/panels/lovelace/cards/types';
import AbstractCard from './AbstractCard';

/**
 * HA Area Card Class
 *
 * Used to create card configuration for an entry of the HASS area registry.
 */
class AreaCard extends AbstractCard {
  /** Returns the default configuration object for the card. */
  static getDefaultConfig(): AreaCardConfig {
    return {
      type: 'area',
      area: '',
    };
  }

  /**
   * Class constructor.
   *
   * @param {AreaRegistryEntry} area The HASS entity to create a card configuration for.
   * @param {AreaCardConfig} [customConfiguration] Custom card configuration.
   */
  constructor(area: AreaRegistryEntry, customConfiguration?: AreaCardConfig) {
    super(area);

    // Initialize the default configuration.
    const configuration = AreaCard.getDefaultConfig();

    configuration.area = area.area_id;
    configuration.navigation_path = configuration.area;

    this.configuration = {
      ...this.configuration,
      ...configuration,
      ...customConfiguration,
      type: configuration.type, // Enforce the card type.
    };
  }
}

export default AreaCard;
