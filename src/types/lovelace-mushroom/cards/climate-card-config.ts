import { HvacMode } from '../../homeassistant/data/climate';
import { LovelaceCardConfig } from '../../homeassistant/data/lovelace/config/card';
import { ActionsSharedConfig } from '../shared/config/actions-config';
import { AppearanceSharedConfig } from '../shared/config/appearance-config';
import { EntitySharedConfig } from '../shared/config/entity-config';

/**
 * Climate Card Configuration
 *
 * @property {boolean} [show_temperature_control] - Show buttons to control target temperature. Defaults to false.
 * @property {HvacMode[]} [hvac_modes] - List of HVAC modes to display.
 *                                       (auto, heat_cool, heat, cool, dry, fan_only, off).
 * @property {boolean} [collapsible_controls] - Collapse controls when off.
 *
 * @see https://github.com/piitaya/lovelace-mushroom/blob/main/docs/cards/climate.md
 */
export type ClimateCardConfig = LovelaceCardConfig &
  EntitySharedConfig &
  AppearanceSharedConfig &
  ActionsSharedConfig & {
    show_temperature_control?: boolean;
    hvac_modes?: HvacMode[];
    collapsible_controls?: boolean;
  };
