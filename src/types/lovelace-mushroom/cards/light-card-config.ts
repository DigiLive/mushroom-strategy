import { LovelaceCardConfig } from '../../homeassistant/data/lovelace/config/card';
import { ActionsSharedConfig } from '../shared/config/actions-config';
import { AppearanceSharedConfig } from '../shared/config/appearance-config';
import { EntitySharedConfig } from '../shared/config/entity-config';

/**
 * Light Card Configuration
 *
 * @property {string} [icon_color] - Custom color for icon and brightness bar when the lights are on and
 *                                   `use_light_color` is false; Defaults to 'blue'.
 * @property {boolean} [show_brightness_control] - Show a slider to control brightness. Defaults to false.
 * @property {boolean} [show_color_temp_control] - Show a slider to control temperature color; Defaults to false.
 * @property {boolean} [show_color_control] - Show a slider to control RGB color. Defaults to false.
 * @property {boolean} [collapsible_controls] - Collapse controls when off; Defaults to false.
 * @property {boolean} [use_light_color] - Colorize the icon and slider according to light temperature or color.
 *                                         Defaults to false.
 *
 * @see https://github.com/piitaya/lovelace-mushroom/blob/main/docs/cards/light.md
 */
export type LightCardConfig = LovelaceCardConfig &
  EntitySharedConfig &
  AppearanceSharedConfig &
  ActionsSharedConfig & {
    icon_color?: string;
    show_brightness_control?: boolean;
    show_color_temp_control?: boolean;
    show_color_control?: boolean;
    collapsible_controls?: boolean;
    use_light_color?: boolean;
  };
