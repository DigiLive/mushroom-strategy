import { ActionConfig } from '../../../data/lovelace/config/action';
import { LovelaceCardConfig } from '../../../data/lovelace/config/card';

/**
 * Home Assistant Area Card Config.
 *
 * @property {string} area - The area associated with the card.
 * @property {string} [navigation_path] - Optional navigation path for the card.
 * @property {boolean} [show_camera] - Whether to show the camera view.
 * @property {"live" | "auto"} [camera_view] - The camera view mode.
 * @property {string} [aspect_ratio] - The aspect ratio of the card.
 * @see https://www.home-assistant.io/dashboards/area/
 */
export interface AreaCardConfig extends LovelaceCardConfig {
  area: string;
  navigation_path?: string;
  show_camera?: boolean;
  camera_view?: 'live' | 'auto';
  aspect_ratio?: string;
}

/**
 * Home Assistant Picture Entity Config.
 *
 * @property {string} entity - An entity_id used for the picture.
 * @property {string} [name] - Overwrite entity name.
 * @property {string} [image] - URL of an image.
 * @property {string} [camera_image] - Camera entity_id to use.
 * @property {"live" | "auto"} [camera_view] - The camera view mode.
 * @property {Record<string, unknown>} [state_image] - Map entity states to images.
 * @property {string[]} [state_filter] - State-based CSS filters.
 * @property {string} [aspect_ratio] - Forces the height of the image to be a ratio of the width.
 * @property {ActionConfig} [tap_action] - Action taken on card tap.
 * @property {ActionConfig} [hold_action] - Action taken on card tap and hold.
 * @property {ActionConfig} [double_tap_action] - Action taken on card double tap.
 * @property {boolean} [show_name=true] - Shows name in footer.
 * @property {string} [theme=true] - Override the used theme for this card.
 * @property {boolean} [show_state] - Shows state in footer.
 * @see https://www.home-assistant.io/dashboards/picture-entity/
 */
export interface PictureEntityCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: string;
  image?: string;
  camera_image?: string;
  camera_view?: 'live' | 'auto';
  state_image?: Record<string, unknown>;
  state_filter?: string[];
  aspect_ratio?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  show_name?: boolean;
  show_state?: boolean;
  theme?: string;
}

/**
 * Home Assistant Stack Card Config.
 *
 * @property {string} type - The stack type.
 * @property {Object[]} cards - The content of the stack.
 * @see https://www.home-assistant.io/dashboards/horizontal-stack/
 * @see https://www.home-assistant.io/dashboards/vertical-stack/
 */
export interface StackCardConfig extends LovelaceCardConfig {
  type: string;
  cards: LovelaceCardConfig[];
  title?: string;
}
