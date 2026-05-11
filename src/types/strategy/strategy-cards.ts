import { LovelaceCardConfig } from '../homeassistant/data/lovelace/config/card';
import { TitleCardConfig as MushroomTitleCardConfig } from '../lovelace-mushroom/cards/title-card-config';
import { ActionsSharedConfig } from '../lovelace-mushroom/shared/config/actions-config';
import { AppearanceSharedConfig } from '../lovelace-mushroom/shared/config/appearance-config';
import { EntitySharedConfig } from '../lovelace-mushroom/shared/config/entity-config';
import { RegistryEntry } from './strategy-generics';
import AbstractCard from '../../cards/AbstractCard';

/**
 * Abstract Card Config.
 */
export type AbstractCardConfig = LovelaceCardConfig & EntitySharedConfig & AppearanceSharedConfig & ActionsSharedConfig;

/**
 * Interface for card constructors used in dynamic imports.
 *
 * This interface defines the constructor signature for all card classes
 * that extend AbstractCard, allowing proper typing of dynamic imports.
 */
export interface CardConstructor {
  new (entity: RegistryEntry, customConfiguration?: LovelaceCardConfig): AbstractCard;
}

/**
 * Header Card Config.
 *
 * @property {boolean} [show_controls] - False to hide controls.
 * @property {string} [iconOn] - Icon to show for switching entities from the off state.
 * @property {string} [iconOff] - Icon to show for switching entities to the off state.
 * @property {string} [onService=none] - Service to call for switching entities from the off state.
 * @property {string} [offService=none] - Service to call for switching entities to the off state.
 */
export interface StrategyHeaderCardConfig extends MushroomTitleCardConfig {
  type: 'custom:mushroom-title-card';
  show_controls?: boolean;
  iconOn?: string;
  iconOff?: string;
  onService?: string;
  offService?: string;
}

/** Custom Configuration of a Strategy Header Card. */
export type CustomHeaderCardConfig = Omit<StrategyHeaderCardConfig, 'type'>;
