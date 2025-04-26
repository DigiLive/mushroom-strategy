import { LovelaceCardConfig } from '../homeassistant/data/lovelace/config/card';
import { TitleCardConfig as MushroomTitleCardConfig } from '../lovelace-mushroom/cards/title-card-config';
import { ActionsSharedConfig } from '../lovelace-mushroom/shared/config/actions-config';
import { AppearanceSharedConfig } from '../lovelace-mushroom/shared/config/appearance-config';
import { EntitySharedConfig } from '../lovelace-mushroom/shared/config/entity-config';

/**
 * Abstract Card Config.
 */
export type AbstractCardConfig = LovelaceCardConfig & EntitySharedConfig & AppearanceSharedConfig & ActionsSharedConfig;

/**
 * Header Card Config.
 *
 * @property {boolean} [showControls=true] - False to hide controls.
 * @property {string} [iconOn] - Icon to show for switching entities from the off state.
 * @property {string} [iconOff] - Icon to show for switching entities to the off state.
 * @property {string} [onService=none] - Service to call for switching entities from the off state.
 * @property {string} [offService=none] - Service to call for switching entities to the off state.
 */
export interface StrategyHeaderCardConfig extends MushroomTitleCardConfig {
  type: 'custom:mushroom-title-card';
  showControls?: boolean;
  iconOn?: string;
  iconOff?: string;
  onService?: string;
  offService?: string;
}

/** Custom Configuration of a Strategy Header Card. */
export type CustomHeaderCardConfig = Omit<StrategyHeaderCardConfig, 'type'>;
