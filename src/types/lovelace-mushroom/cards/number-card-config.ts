import { LovelaceCardConfig } from '../../homeassistant/data/lovelace/config/card';
import { ActionsSharedConfig } from '../shared/config/actions-config';
import { AppearanceSharedConfig } from '../shared/config/appearance-config';
import { EntitySharedConfig } from '../shared/config/entity-config';

export const DISPLAY_MODES = ['slider', 'buttons'] as const;

type DisplayMode = (typeof DISPLAY_MODES)[number];

/**
 * Number Card Configuration
 *
 * @property {string} [icon_color] - Custom color for the icon when the entity state is active. Defaults to 'blue'.
 * @property {DisplayMode} [display_mode] - Slider or Button controls. Defaults to 'slider'.
 *
 * @see https://github.com/piitaya/lovelace-mushroom/blob/main/docs/cards/number.md
 */
export type NumberCardConfig = LovelaceCardConfig &
  EntitySharedConfig &
  AppearanceSharedConfig &
  ActionsSharedConfig & {
    icon_color?: string;
    display_mode?: DisplayMode;
  };
