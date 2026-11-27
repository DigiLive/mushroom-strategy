// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { EntityRegistryEntry } from '@digilive/home-assistant-frontend-types';
import { TemplateCardConfig } from '@digilive/lovelace-mushroom-types';

import { CustomCardConfig } from '../types/strategy/strategy-cards';

import { localize } from '../utilities/localize';

import AbstractCard from './AbstractCard';

/**
 * Valve Card Class
 *
 * Used to create a card configuration to control an entity of the valve domain.
 */
class ValveCard extends AbstractCard<TemplateCardConfig> {
  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {CustomCardConfig<TemplateCardConfig>} [customConfiguration] Custom card configuration overrides.
   */
  public constructor(entity: EntityRegistryEntry, customConfiguration?: CustomCardConfig<TemplateCardConfig>) {
    super(entity, customConfiguration);
  }

  /**
   * Returns the default configuration object for the card.
   *
   * @returns {Partial<TemplateCardConfig>} The default configuration object for the card.
   */
  protected override getDefaultConfig(): Partial<TemplateCardConfig> {
    const registryEntry = this.entity as EntityRegistryEntry;

    return {
      type: 'custom:mushroom-template-card',
      entity: registryEntry.entity_id,
      icon: registryEntry.icon ?? 'mdi:valve',
      icon_color: 'blue',
      primary: registryEntry.name ?? registryEntry.original_name ?? '?',
      secondary: `{%
                    set mapping = {
                      'open': '${localize('valve.open')}',
                      'opening': '${localize('valve.opening')}',
                      'closed': '${localize('valve.closed')}',
                      'closing': '${localize('valve.closing')}',
                      'stopped': '${localize('valve.stopped')}',
                      'unavailable': '${localize('generic.unavailable')}'
                    }
                  %}
                  {{ mapping.get(states('${registryEntry.entity_id}'), '${localize('generic.unknown')}') }}`,
      double_tap_action: {
        action: 'toggle',
      },
    };
  }
}

export default ValveCard;
