// noinspection JSUnusedGlobalSymbols False positive.

import { EntityBadgeConfig, LovelaceBadgeConfig } from '@digilive/home-assistant-frontend-types';

import AbstractBadge from './AbstractBadge';

/**
 * Weather Badge class.
 *
 * Used to create a badge configuration to indicate the current weather.
 */
class WeatherBadge extends AbstractBadge<EntityBadgeConfig> {
  /** ID of a weather entity. */
  private readonly entityId: string;

  /**
   * Class constructor.
   *
   * @param {string} entityId ID of a weather entity.
   * @param {LovelaceBadgeConfig} [customConfiguration] Custom badge configuration overrides.
   */
  public constructor(entityId: string, customConfiguration?: LovelaceBadgeConfig) {
    super();

    this.entityId = entityId;
    this.setConfiguration(customConfiguration as Partial<EntityBadgeConfig>);
  }

  /** Returns the default configuration object for the badge. */
  protected getDefaultConfig(): Partial<EntityBadgeConfig> {
    return {
      type: 'entity',
      entity: this.entityId,
      state_content: ['state', 'temperature'],
    };
  }
}

export default WeatherBadge;
