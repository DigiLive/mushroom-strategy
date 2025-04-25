// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';
import { EntityCardConfig } from '../types/lovelace-mushroom/cards/entity-card-config';
import { TemplateCardConfig } from '../types/lovelace-mushroom/cards/template-card-config';
import { isCallServiceActionConfig, isCallServiceActionTarget } from '../types/strategy/strategy-generics';
import AbstractCard from './AbstractCard';

/**
 * Scene Card Class
 *
 * Used to create a card configuration to control an entity of the scene domain.
 */
class SceneCard extends AbstractCard {
  /** Returns the default configuration object for the card. */
  static getDefaultConfig(): TemplateCardConfig {
    return {
      type: 'custom:mushroom-template-card',
      icon: 'mdi:palette',
      icon_color: 'disabled',
      tap_action: {
        action: 'call-service',
        perform_action: 'scene.turn_on',
        target: {
          entity_id: undefined,
        },
      },
    };
  }

  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {EntityCardConfig} [customConfiguration] Custom card configuration.
   */
  constructor(entity: EntityRegistryEntry, customConfiguration?: EntityCardConfig) {
    super(entity);

    const sceneName = entity.entity_id.split('.').pop();
    const configuration = SceneCard.getDefaultConfig();

    // Initialize the default configuration.
    configuration.primary = entity.name ?? entity.original_name ?? '?';

    if (
      isCallServiceActionConfig(configuration.tap_action) &&
      isCallServiceActionTarget(configuration.tap_action.target)
    ) {
      configuration.tap_action.target.entity_id = entity.entity_id;
    }
    configuration.icon = Registry.hassStates[entity.entity_id]?.attributes.icon ?? configuration.icon;

    // Stateful Scenes support. (https://github.com/hugobloem/stateful_scenes)
    configuration.icon_color = `
        {% set state = states('switch.${sceneName}_stateful_scene') %}
          {% if state == 'on' %}
            blue
          {% else %}
            disabled
          {% endif %}
        `;

    this.configuration = { ...this.configuration, ...configuration, ...customConfiguration };
  }
}

export default SceneCard;
