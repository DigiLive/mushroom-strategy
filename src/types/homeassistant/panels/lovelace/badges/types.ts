import type { ActionConfig } from '../../../data/lovelace/config/action';
import type { LovelaceBadgeConfig } from '../../../data/lovelace/config/badge';

export interface EntityBadgeConfig extends LovelaceBadgeConfig {
  type: 'entity';
  entity?: string;
  name?: string;
  icon?: string;
  color?: string;
  show_name?: boolean;
  show_state?: boolean;
  show_icon?: boolean;
  show_entity_picture?: boolean;
  state_content?: string | string[];
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  /**
   * @deprecated use `show_state`, `show_name`, `icon_type`
   */
  display_type?: string;
}
