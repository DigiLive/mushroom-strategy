// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';
import { EntityCardConfig } from '../types/lovelace-mushroom/cards/entity-card-config';
import AbstractCard from './AbstractCard';
import SwitchCard from './SwitchCard';
import { isCallServiceActionConfig } from '../types/strategy/strategy-generics';

/**
 * Scene Card Class
 *
 * Used to create a card configuration to control an entity of the scene domain.
 *
 * Supports Stateful scenes from https://github.com/hugobloem/stateful_scenes.
 * If the stateful scene entity is available, it will be used instead of the original scene entity.
 */
class SceneCard extends AbstractCard {
  /** Returns the default configuration object for the card. */
  static getDefaultConfig(): EntityCardConfig {
    return {
      type: 'custom:mushroom-entity-card',
      tap_action: {
        action: 'perform-action',
        perform_action: 'scene.turn_on',
        target: {},
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
    const sceneName = entity.entity_id.split('.').pop();
    const statefulScene = Registry.entities.find((entity) => entity.entity_id === `switch.${sceneName}_stateful_scene`);

    super(statefulScene ?? entity);

    // Stateful scene support.
    if (statefulScene) {
      this.configuration = new SwitchCard(statefulScene).getCard();

      return;
    }

    // Initialize the default configuration.
    const configuration = SceneCard.getDefaultConfig();

    if (isCallServiceActionConfig(configuration.tap_action)) {
      configuration.tap_action.target = { entity_id: entity.entity_id };
    }

    configuration.icon = Registry.hassStates[entity.entity_id]?.attributes.icon ?? configuration.icon;

    this.configuration = { ...this.configuration, ...configuration, ...customConfiguration };
  }
}

export default SceneCard;
