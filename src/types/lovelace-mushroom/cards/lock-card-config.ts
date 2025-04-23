import { LovelaceCardConfig } from '../../homeassistant/data/lovelace/config/card';
import { ActionsSharedConfig } from '../shared/config/actions-config';
import { AppearanceSharedConfig } from '../shared/config/appearance-config';
import { EntitySharedConfig } from '../shared/config/entity-config';

/**
 * Lock Card Configuration
 *
 * @see https://github.com/piitaya/lovelace-mushroom/blob/main/docs/cards/lock.md
 */
export type LockCardConfig = LovelaceCardConfig & EntitySharedConfig & AppearanceSharedConfig & ActionsSharedConfig;
