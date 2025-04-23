import { LovelaceCardConfig } from '../../homeassistant/data/lovelace/config/card';
import { ActionsSharedConfig } from '../shared/config/actions-config';
import { AppearanceSharedConfig } from '../shared/config/appearance-config';
import { EntitySharedConfig } from '../shared/config/entity-config';

/**
 * Fan Card Configuration
 *
 * @property {boolean} [icon_animation] - Animate the icon when the fan is on. Defaults to false.
 * @property {boolean} [show_percentage_control] - Show a slider to control speed. Defaults to false.
 * @property {boolean} [show_oscillate_control] - Show a button to control oscillation. Defaults to false.
 * @property {boolean} [show_direction_control] - Show a button to control the direction. Defaults to false.
 *
 * @see https://github.com/piitaya/lovelace-mushroom/blob/main/docs/cards/fan.md
 */
export type FanCardConfig = LovelaceCardConfig &
  EntitySharedConfig &
  AppearanceSharedConfig &
  ActionsSharedConfig & {
    icon_animation?: boolean;
    show_percentage_control?: boolean;
    show_oscillate_control?: boolean;
    show_direction_control?: boolean;
  };
