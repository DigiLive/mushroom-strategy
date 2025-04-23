import { LovelaceCardConfig } from '../../homeassistant/data/lovelace/config/card';
import { LovelaceChipConfig } from '../utils/lovelace/chip/types';

/**
 * Chips Card Configuration
 *
 * @property {LovelaceChipConfig[]} chips - Array of chips to display.
 * @property {string} [alignment] - Chips alignment (start, end, center, justify). Defaults to 'start'.
 *
 * @see https://github.com/piitaya/lovelace-mushroom/blob/main/docs/cards/chips.md
 */
export interface ChipsCardConfig extends LovelaceCardConfig {
  chips: LovelaceChipConfig[];
  alignment?: string;
}
