// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { EntityRegistryEntry } from '@digilive/home-assistant-frontend-types';
import { EntityCardConfig } from '@digilive/lovelace-mushroom-types';

import { CustomCardConfig } from '../types/strategy/strategy-cards';
import { isCallServiceActionConfig } from '../types/strategy/strategy-generics';

import { Registry } from '../Registry';

import AbstractCard from './AbstractCard';
import SwitchCard from './SwitchCard';

/**
 * Scene Card Class
 *
 * Used to create a card configuration to control an entity of the scene domain.
 *
 * Supports Stateful scenes from https://github.com/hugobloem/stateful_scenes.
 * If the stateful scene entity is available, it will be used instead of the original scene entity.
 */
class SceneCard extends AbstractCard<EntityCardConfig> {
  /** The original scene entity registry entry. */
  protected readonly sceneEntity: EntityRegistryEntry;

  /** Whether a stateful scene switch was found for this scene. */
  protected readonly isStatefulScene: boolean;

  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {CustomCardConfig<EntityCardConfig>} [customConfiguration] Custom card configuration overrides.
   */
  public constructor(entity: EntityRegistryEntry, customConfiguration?: CustomCardConfig<EntityCardConfig>) {
    const sceneName = entity.entity_id.split('.').pop();
    const statefulScene = Registry.entities.find((entry) => entry.entity_id === `switch.${sceneName}_stateful_scene`);

    super(statefulScene ?? entity, customConfiguration);

    this.sceneEntity = entity;
    this.isStatefulScene = Boolean(statefulScene);

    if (this.isStatefulScene && statefulScene) {
      const { hidden: _hidden, ...customCardConfig } = customConfiguration ?? {};
      this.configuration = {
        ...new SwitchCard(statefulScene).getCard(),
        ...customCardConfig,
      } as Partial<EntityCardConfig>; // FIXME: Remove type assertion once @digilive/lovelace-mushroom-types updates EntityCardConfig['name'] to match home-assistant-frontend-types.
    }
  }

  /**
   * Returns the default configuration object for the card.
   *
   * @returns {Partial<EntityCardConfig>} The default configuration object for the card.
   */
  protected override getDefaultConfig(): Partial<EntityCardConfig> {
    if (this.isStatefulScene) {
      return {};
    }

    const entity = this.sceneEntity ?? (this.entity as EntityRegistryEntry);
    const defaultConfig: Partial<EntityCardConfig> = {
      type: 'custom:mushroom-entity-card',
      icon: Registry.hassStates[entity.entity_id]?.attributes.icon,
      tap_action: {
        action: 'call-service',
        perform_action: 'scene.turn_on',
        target: {
          entity_id: entity.entity_id,
        },
      },
    };

    if (isCallServiceActionConfig(defaultConfig.tap_action)) {
      defaultConfig.tap_action = {
        ...defaultConfig.tap_action,
        target: {
          entity_id: entity.entity_id,
        },
      };
    }

    return defaultConfig;
  }
}

export default SceneCard;
