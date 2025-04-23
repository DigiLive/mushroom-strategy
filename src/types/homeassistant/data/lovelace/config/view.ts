import { LovelaceBadgeConfig } from './badge';
import { LovelaceCardConfig } from './card';
import { LovelaceSectionRawConfig } from './section';
import { LovelaceStrategyConfig } from './strategy';

/**
 * Represents the configuration for showing a view in Home Assistant.
 *
 * @property {string} [user] - The user associated with the view.
 */
export interface ShowViewConfig {
  user?: string;
}

/**
 * Represents the background configuration for a Lovelace view in Home Assistant.
 *
 * @property {string} [image] - The background image URL.
 * @property {number} [opacity] - The opacity of the background.
 * @property {'auto' | 'cover' | 'contain'} [size] - The size of the background image.
 * @property {'top left' | 'top center' | 'top right' | 'center left' | 'center' | 'center right' | 'bottom left' |
 *   'bottom center' | 'bottom right'} [alignment] - The alignment of the background image.
 * @property {'repeat' | 'no-repeat'} [repeat] - The repeat behavior of the background image.
 * @property {'scroll' | 'fixed'} [attachment] - The attachment behavior of the background image.
 */
export interface LovelaceViewBackgroundConfig {
  image?: string;
  opacity?: number;
  size?: 'auto' | 'cover' | 'contain';
  alignment?:
    | 'top left'
    | 'top center'
    | 'top right'
    | 'center left'
    | 'center'
    | 'center right'
    | 'bottom left'
    | 'bottom center'
    | 'bottom right';
  repeat?: 'repeat' | 'no-repeat';
  attachment?: 'scroll' | 'fixed';
}

/**
 * Represents the header configuration for a Lovelace view in Home Assistant.
 *
 * @property {LovelaceCardConfig} [card] - The card to be displayed in the header.
 * @property {'start' | 'center' | 'responsive'} [layout] - The layout of the header.
 * @property {'bottom' | 'top'} [badges_position] - The position of badges in the header.
 */
export interface LovelaceViewHeaderConfig {
  card?: LovelaceCardConfig;
  layout?: 'start' | 'center' | 'responsive';
  badges_position?: 'bottom' | 'top';
}

/**
 * Represents the base configuration for a Lovelace view in Home Assistant.
 *
 * @property {number} [index] - The index of the view.
 * @property {string} [title] - The title of the view.
 * @property {string} [path] - The path to the view.
 * @property {string} [icon] - The icon for the view.
 * @property {string} [theme] - The theme for the view.
 * @property {boolean} [panel] - Whether the view is a panel view.
 * @property {string | LovelaceViewBackgroundConfig} [background] - The background configuration for the view.
 * @property {boolean | ShowViewConfig[]} [visible] - Visibility settings for the view.
 * @property {boolean} [subview] - Whether the view is a subview.
 * @property {string} [back_path] - The path to go back to the previous view.
 * @property {number} [max_columns] - The maximum number of columns in the view.
 * @property {boolean} [dense_section_placement] - Whether to place sections densely.
 * @property {boolean} [top_margin] - Whether to add top margin to the view.
 */
export interface LovelaceBaseViewConfig {
  index?: number;
  title?: string;
  path?: string;
  icon?: string;
  theme?: string;
  panel?: boolean;
  background?: string | LovelaceViewBackgroundConfig;
  visible?: boolean | ShowViewConfig[];
  subview?: boolean;
  back_path?: string;
  max_columns?: number;
  dense_section_placement?: boolean;
  top_margin?: boolean;
}

/**
 * Represents the configuration for a Lovelace view in Home Assistant.
 *
 * @property {string} [type] - The type of the view.
 * @property {(string | Partial<LovelaceBadgeConfig>)[]} [badges] - An array of badges for the view.
 * @property {LovelaceCardConfig[]} [cards] - An array of cards in the view.
 * @property {LovelaceSectionRawConfig[]} [sections] - An array of sections in the view.
 * @property {LovelaceViewHeaderConfig} [header] - The header configuration for the view.
 */
export interface LovelaceViewConfig extends LovelaceBaseViewConfig {
  type?: string;
  badges?: (string | Partial<LovelaceBadgeConfig>)[];
  cards?: LovelaceCardConfig[];
  sections?: LovelaceSectionRawConfig[];
  header?: LovelaceViewHeaderConfig;
}

/**
 * Represents the configuration for a Lovelace strategy view in Home Assistant.
 *
 * @property {LovelaceStrategyConfig} strategy - The strategy configuration for the view.
 */
export interface LovelaceStrategyViewConfig extends LovelaceBaseViewConfig {
  strategy: LovelaceStrategyConfig;
}

/**Represents the raw configuration for a Lovelace view in Home Assistant. */
export type LovelaceViewRawConfig = LovelaceViewConfig | LovelaceStrategyViewConfig;
