import {LovelaceStrategyConfig} from "./strategy";
import {LovelaceSectionRawConfig} from "./section";
import {LovelaceCardConfig} from "./card";
import {LovelaceBadgeConfig} from "./badge";

export interface ShowViewConfig {
  user?: string;
}

export interface LovelaceViewBackgroundConfig {
  image?: string;
  opacity?: number;
  size?: "auto" | "cover" | "contain";
  alignment?:
    | "top left"
    | "top center"
    | "top right"
    | "center left"
    | "center"
    | "center right"
    | "bottom left"
    | "bottom center"
    | "bottom right";
  repeat?: "repeat" | "no-repeat";
  attachment?: "scroll" | "fixed";
}

export interface LovelaceViewHeaderConfig {
  card?: LovelaceCardConfig;
  layout?: "start" | "center" | "responsive";
  badges_position?: "bottom" | "top";
}

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
  // Only used for section view, it should move to a section view config type when the views will have a dedicated editor.
  max_columns?: number;
  dense_section_placement?: boolean;
  top_margin?: boolean;
}

/**
 * View Config.
 *
 * @see https://www.home-assistant.io/dashboards/views/
 */
export interface LovelaceViewConfig extends LovelaceBaseViewConfig {
  type?: string;
  badges?: (string | Partial<LovelaceBadgeConfig>)[]; // Badge can be just an entity_id or without type
  cards?: LovelaceCardConfig[];
  sections?: LovelaceSectionRawConfig[];
  header?: LovelaceViewHeaderConfig;
}

export interface LovelaceStrategyViewConfig extends LovelaceBaseViewConfig {
  strategy: LovelaceStrategyConfig;
}

export interface LovelaceStrategyViewConfig extends LovelaceBaseViewConfig {
  strategy: LovelaceStrategyConfig;
}

export type LovelaceViewRawConfig =
  | LovelaceViewConfig
  | LovelaceStrategyViewConfig;
