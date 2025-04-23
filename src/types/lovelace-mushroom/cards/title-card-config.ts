import { ActionConfig } from '../../homeassistant/data/lovelace/config/action';
import { LovelaceCardConfig } from '../../homeassistant/data/lovelace/config/card';

/**
 * Title Card Configuration
 *
 * @property {string} [title] - Title to render.
 *                              This May contain templates.
 * @property {string} [subtitle] - Subtitle to render.
 *                                 This May contain templates.
 * @property {ActionConfig} [title_tap_action] - Home assistant action to perform on title tap.
 * @property {ActionConfig} [subtitle_tap_action] - Home assistant action to perform on subtitle tap.
 * @property {string} [alignment] - Alignment of the title and subtitle.
 *
 * @see https://github.com/piitaya/lovelace-mushroom/blob/main/docs/cards/title.md
 */
export interface TitleCardConfig extends LovelaceCardConfig {
  title?: string;
  subtitle?: string;
  alignment?: string;
  title_tap_action?: ActionConfig;
  subtitle_tap_action?: ActionConfig;
}
