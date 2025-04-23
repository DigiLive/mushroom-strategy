import { ActionConfig } from '../../../homeassistant/data/lovelace/config/action';

/**
 * Actions Shared Configuration
 *
 * @property {ActionConfig} [tap_action] - Action to perform on tap.
 * @property {ActionConfig} [hold_action] - Action to perform on hold.
 * @property {ActionConfig} [double_tap_action] - Action to perform on double tap.
 */
export type ActionsSharedConfig = {
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
};
