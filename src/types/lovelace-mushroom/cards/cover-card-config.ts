import { LovelaceCardConfig } from '../../homeassistant/data/lovelace/config/card';
import { ActionsSharedConfig } from '../shared/config/actions-config';
import { AppearanceSharedConfig } from '../shared/config/appearance-config';
import { EntitySharedConfig } from '../shared/config/entity-config';

/**
 * Cover Card Configuration
 *
 * @property {boolean} [show_buttons_control] - Show buttons to open, close, and stop the cover. Defaults to false.
 * @property {boolean} [show_position_control] - Show a slider to control the position of the cover. Defaults to false.
 * @property {boolean} [show_tilt_position_control] - Show a slider to control the tilt position of the cover. Defaults
 *                                                    to false.
 *
 * @see https://github.com/piitaya/lovelace-mushroom/blob/main/docs/cards/cover.md
 */
export type CoverCardConfig = LovelaceCardConfig &
  EntitySharedConfig &
  AppearanceSharedConfig &
  ActionsSharedConfig & {
    show_buttons_control?: boolean;
    show_position_control?: boolean;
    show_tilt_position_control?: boolean;
  };
