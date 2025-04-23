import { LovelaceCardConfig } from '../../homeassistant/data/lovelace/config/card';
import { ActionsSharedConfig } from '../shared/config/actions-config';
import { AppearanceSharedConfig } from '../shared/config/appearance-config';
import { EntitySharedConfig } from '../shared/config/entity-config';

export const VACUUM_COMMANDS = ['on_off', 'start_pause', 'stop', 'locate', 'clean_spot', 'return_home'] as const;

export type VacuumCommand = (typeof VACUUM_COMMANDS)[number];

/**
 * Vacuum Card Configuration
 *
 * @property {boolean} [icon_animation] - Animate the icon when vacuum is cleaning.
 * @property {VacuumCommand[]} [commands] - List of commands to display.
 *                                          (on_off, start_pause, stop, locate, clean_spot, return_home).
 *
 * @see https://github.com/piitaya/lovelace-mushroom/blob/main/docs/cards/vacuum.md
 */
export interface VacuumCardConfig
  extends LovelaceCardConfig,
    EntitySharedConfig,
    AppearanceSharedConfig,
    ActionsSharedConfig {
  icon_animation?: boolean;
  commands?: VacuumCommand[];
}
