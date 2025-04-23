import { LovelaceCardConfig } from '../../homeassistant/data/lovelace/config/card';
import { ActionsSharedConfig } from '../shared/config/actions-config';
import { AppearanceSharedConfig } from '../shared/config/appearance-config';
import { EntitySharedConfig } from '../shared/config/entity-config';

/**
 * Select Card Configuration
 *
 * @see https://github.com/piitaya/lovelace-mushroom/blob/main/docs/cards/select.md
 */
export type SelectCardConfig = LovelaceCardConfig &
  EntitySharedConfig &
  AppearanceSharedConfig &
  ActionsSharedConfig & {
    icon_color?: string;
  };
