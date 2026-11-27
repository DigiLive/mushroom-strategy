import { AreaCardConfig, EntityNameItem, LovelaceCardConfig } from '@digilive/home-assistant-frontend-types';
import {
  ClimateCardConfig,
  CoverCardConfig,
  EntityCardConfig,
  FanCardConfig,
  LightCardConfig,
  LockCardConfig,
  MediaPlayerCardConfig,
  NumberCardConfig,
  PersonCardConfig,
  SelectCardConfig,
  TemplateCardConfig,
  TitleCardConfig,
  VacuumCardConfig,
} from '@digilive/lovelace-mushroom-types';

import AbstractCard from '../../cards/AbstractCard';

import { RegistryEntry } from './strategy-generics';

/**
 * Interface for card constructors used in dynamic imports.
 *
 * This interface defines the constructor signature for all card classes
 * that extend AbstractCard, allowing proper typing of dynamic imports.
 */
export interface CardConstructor<TConfig extends StrategyCardConfig = StrategyCardConfig> {
  new (entity: RegistryEntry, customConfiguration?: CustomCardConfig<TConfig>): AbstractCard<TConfig>;
}

/**
 * Valid vacuum card command identifier derived from `VacuumCardConfig`.
 */
export type VacuumCommand = NonNullable<VacuumCardConfig['commands']>[number];

/**
 * Header Card Config.
 *
 * @property {boolean} [show_controls] - False to hide controls.
 * @property {string} [iconOn] - Icon to show for switching entities from the off state.
 * @property {string} [iconOff] - Icon to show for switching entities to the off state.
 * @property {string} [onService=none] - Service to call for switching entities from the off state.
 * @property {string} [offService=none] - Service to call for switching entities to the off state.
 */
export interface StrategyHeaderCardConfig extends TitleCardConfig {
  type: 'custom:mushroom-title-card';
  show_controls?: boolean;
  iconOn?: string;
  iconOff?: string;
  onService?: string;
  offService?: string;
}

/**
 * Custom Header Card Configuration.
 */
export type CustomHeaderCardConfig = Omit<StrategyHeaderCardConfig, 'type'>;

/**
 * Sensor Card Config.
 *
 * @property {string} [name] - Card name override (expects a plain string for mini-graph-card).
 * @property {boolean} [animate] - Enable or disable graph animations.
 * @property {string} [icon] - Icon to display on the card.
 * @property {string} [line_color] - Color of the graph line.
 */
export interface SensorCardConfig extends LovelaceCardConfig {
  type: 'custom:mini-graph-card';
  name?: string;
  animate?: boolean;
  icon?: string;
  line_color?: string;
}

/**
 * Union of all supported Mushroom card configurations.
 */
export type StrategyCardConfig =
  | AreaCardConfig
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
  | SensorCardConfig
  | TemplateCardConfig
  | VacuumCardConfig;

/**
 * Custom Card Configuration for an entity.
 *
 * @property {boolean} [hidden] - If True, the card is hidden from the dashboard.
 * @property {string | EntityNameItem | EntityNameItem[]} [name] - Card name override.
 */
/*export type CustomCardConfig<TConfig extends StrategyCardConfig = StrategyCardConfig> = Partial<TConfig> & {
  hidden?: boolean;
  name?: string | EntityNameItem | EntityNameItem[];
};*/

/**
 * Custom Card Configuration for an entity.
 *
 * FIXME: @digilive/lovelace-mushroom-types lacks newer EntityNameItem variants (such as 'parent_device'), so we need to use a workaround here.
 *
 * @property {boolean} [hidden] - If True, the card is hidden from the dashboard.
 * @property {string | EntityNameItem | EntityNameItem[]} [name] - Card name override.
 */
export type CustomCardConfig<TConfig extends StrategyCardConfig = StrategyCardConfig> = Omit<
  Partial<TConfig>,
  'name'
> & {
  hidden?: boolean;
  name?: string | EntityNameItem | EntityNameItem[];
};
