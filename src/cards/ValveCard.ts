// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';
import { TemplateCardConfig } from '../types/lovelace-mushroom/cards/template-card-config';
import { localize } from '../utilities/localize';
import AbstractCard from './AbstractCard';

/**
 * Valve Card Class
 *
 * Used to create a card configuration to control an entity of the valve domain.
 */
class ValveCard extends AbstractCard {
  /** Returns the default configuration object for the card. */
  static getDefaultConfig(): TemplateCardConfig {
    return {
      type: 'custom:mushroom-template-card',
      icon: 'mdi:valve',
      icon_color: 'blue',
      double_tap_action: {
        action: 'toggle',
      },
    };
  }

  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {VacuumCardConfig} [customConfiguration] Custom card configuration.
   */
  constructor(entity: EntityRegistryEntry, customConfiguration?: TemplateCardConfig) {
    super(entity);

    // Initialize the default configuration.
    const configuration = ValveCard.getDefaultConfig();

    configuration.entity = entity.entity_id;
    configuration.icon = entity.icon ?? configuration.icon;
    configuration.primary = entity.name ?? entity.original_name ?? '?';
    configuration.secondary = `{% 
                                 set mapping = {
                                   'open': '${localize('valve.open')}',
                                   'opening': '${localize('valve.opening')}',
                                   'closed': '${localize('valve.closed')}',
                                   'closing': '${localize('valve.closing')}',
                                   'stopped': '${localize('valve.stopped')}',
                                   'unavailable': '${localize('generic.unavailable')}'
                                 }
                               %}
                               {{ mapping.get(states('${entity.entity_id}'), '${localize('generic.unknown')}') }}`;

    this.configuration = { ...this.configuration, ...configuration, ...customConfiguration };
  }
}

export default ValveCard;
