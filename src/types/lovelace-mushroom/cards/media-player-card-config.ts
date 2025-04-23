import { LovelaceCardConfig } from '../../homeassistant/data/lovelace/config/card';
import { ActionsSharedConfig } from '../shared/config/actions-config';
import { AppearanceSharedConfig } from '../shared/config/appearance-config';
import { EntitySharedConfig } from '../shared/config/entity-config';

/** List of available media controls. */
export const MEDIA_LAYER_MEDIA_CONTROLS = [
  'on_off',
  'shuffle',
  'previous',
  'play_pause_stop',
  'next',
  'repeat',
] as const;

/** Represents a single media control option. */
export type MediaPlayerMediaControl = (typeof MEDIA_LAYER_MEDIA_CONTROLS)[number];
/** List of available volume controls. */
export const MEDIA_PLAYER_VOLUME_CONTROLS = ['volume_mute', 'volume_set', 'volume_buttons'] as const;
/** Represents a single volume control option. */
export type MediaPlayerVolumeControl = (typeof MEDIA_PLAYER_VOLUME_CONTROLS)[number];

/**
 * Media Player Card Configuration.
 *
 * @property {boolean} [use_media_info] - Use media info instead of name, state, and icon when media is playing.
 *                                        Defaults to false.
 * @property {boolean} [show_volume_level] - Show volume level next to media state when media is playing.
 *                                           Defaults to false.
 * @property {MediaPlayerVolumeControl[]} [volume_controls] - List of controls to display.
 *                                                            (volume_mute, volume_set, volume_buttons)
 * @property {MediaPlayerMediaControl[]} [media_controls] - List of controls to display
 *                                                          (on_off, shuffle, previous, play_pause_stop, next, repeat)
 * @property {boolean} [collapsible_controls] - Collapse controls when off; Defaults to false.
 *
 * @see https://github.com/piitaya/lovelace-mushroom/blob/main/docs/cards/media-player.md
 */
export type MediaPlayerCardConfig = LovelaceCardConfig &
  EntitySharedConfig &
  AppearanceSharedConfig &
  ActionsSharedConfig & {
    use_media_info?: boolean;
    show_volume_level?: boolean;
    volume_controls?: MediaPlayerVolumeControl[];
    media_controls?: MediaPlayerMediaControl[];
    collapsible_controls?: boolean;
  };
