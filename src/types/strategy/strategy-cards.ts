import { LovelaceCardConfig } from '../homeassistant/data/lovelace/config/card';
import { TitleCardConfig } from '../lovelace-mushroom/cards/title-card-config';
import { ActionsSharedConfig } from '../lovelace-mushroom/shared/config/actions-config';
import { AppearanceSharedConfig } from '../lovelace-mushroom/shared/config/appearance-config';
import { EntitySharedConfig } from '../lovelace-mushroom/shared/config/entity-config';
import { ChipsCardConfig } from '../lovelace-mushroom/cards/chips-card';
import { ClimateCardConfig } from '../lovelace-mushroom/cards/climate-card-config';
import { CoverCardConfig } from '../lovelace-mushroom/cards/cover-card-config';
import { EntityCardConfig } from '../lovelace-mushroom/cards/entity-card-config';
import { FanCardConfig } from '../lovelace-mushroom/cards/fan-card-config';
import { LightCardConfig } from '../lovelace-mushroom/cards/light-card-config';
import { LockCardConfig } from '../lovelace-mushroom/cards/lock-card-config';
import { MediaPlayerCardConfig } from '../lovelace-mushroom/cards/media-player-card-config';
import { NumberCardConfig } from '../lovelace-mushroom/cards/number-card-config';
import { PersonCardConfig } from '../lovelace-mushroom/cards/person-card-config';
import { SelectCardConfig } from '../lovelace-mushroom/cards/select-card-config';
import { TemplateCardConfig } from '../lovelace-mushroom/cards/template-card-config';
import { VacuumCardConfig } from '../lovelace-mushroom/cards/vacuum-card-config';

/**
 * Abstract Card Config.
 */
export type AbstractCardConfig = LovelaceCardConfig & EntitySharedConfig & AppearanceSharedConfig & ActionsSharedConfig;

/**
 * Header Card Control Configuration.
 *
 * @property {string} [icon] - Icon to display for the control.
 * @property {string} [icon_color] - Color of the icon.
 * @property {string} [service] - Service to call when the control is activated.
 */
interface HeaderCardControlConfig {
  icon?: string;
  icon_color?: string;
  service?: string;
}

/**
 * Header Card Config.
 *
 * @property {string} [type] - Optional property specifying the card type, set to 'custom:mushroom-title-card'.
 * @property {boolean} [showControls] - Optional flag to show or hide controls on the card (default is true).
 * @property {HeaderCardControlConfig} [on] - Configuration for the 'on' state of the card.
 * @property {HeaderCardControlConfig} [off] - Configuration for the 'off' state of the card.
 */
export interface HeaderCardConfig extends Omit<TitleCardConfig, 'type'> {
  type?: 'custom:mushroom-title-card';
  showControls?: boolean;
  on?: HeaderCardControlConfig;
  off?: HeaderCardControlConfig;
}

/**
 * Union type representing the custom configuration options for the various cards.
 *
 * This type includes all possible card configurations that can be used within the Home Assistant UI for different
 * entity types.
 */
export type CustomCardConfiguration =
  | ChipsCardConfig
  | ClimateCardConfig
  | CoverCardConfig
  | EntityCardConfig
  | FanCardConfig
  | LightCardConfig
  | LockCardConfig
  | MediaPlayerCardConfig
  | NumberCardConfig
  | PersonCardConfig
  | SelectCardConfig
  | TemplateCardConfig
  | TitleCardConfig
  | VacuumCardConfig;
