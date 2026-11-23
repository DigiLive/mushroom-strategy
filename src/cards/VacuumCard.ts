// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { EntityRegistryEntry } from '@digilive/home-assistant-frontend-types';
import { VacuumCardConfig } from '@digilive/lovelace-mushroom-types';

import { CustomCardConfig, VacuumCommand } from '../types/strategy/strategy-cards';

import AbstractCard from './AbstractCard';

const VACUUM_COMMANDS = [
  'on_off',
  'start_pause',
  'stop',
  'locate',
  'clean_spot',
  'return_home',
] as const satisfies readonly VacuumCommand[];

/**
 * Vacuum Card Class
 *
 * Used to create a card configuration to control an entity of the vacuum domain.
 */
class VacuumCard extends AbstractCard<VacuumCardConfig> {
  /**
   * Class constructor.
   *
   * @param {EntityRegistryEntry} entity The HASS entity to create a card configuration for.
   * @param {CustomCardConfig<VacuumCardConfig>} [customConfiguration] Custom card configuration overrides.
   */
  public constructor(entity: EntityRegistryEntry, customConfiguration?: CustomCardConfig<VacuumCardConfig>) {
    super(entity, customConfiguration);
  }

  /** Returns the default configuration object for the card. */
  protected getDefaultConfig(): Partial<VacuumCardConfig> {
    return {
      type: 'custom:mushroom-vacuum-card',
      icon: undefined,
      icon_animation: true,
      commands: [...VACUUM_COMMANDS],
      tap_action: {
        action: 'more-info',
      },
    };
  }
}

export default VacuumCard;
