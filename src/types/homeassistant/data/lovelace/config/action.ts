import { HassServiceTarget } from 'home-assistant-js-websocket';

/**
 * Represents the configuration for a toggle action in Home Assistant.
 *
 * @property {'toggle'} action - The action type, which is "toggle".
 */
export interface ToggleActionConfig extends BaseActionConfig {
  action: 'toggle';
}

/**
 * Represents the configuration for a call service action in Home Assistant.
 *
 * @property {'call-service' | 'perform-action'} action - The action type, which can be "call-service" or
 *                                                        "perform-action".
 * @property {string} [service] - Deprecated; service name for backward compatibility.
 * @property {string} perform_action - The action to perform.
 * @property {HassServiceTarget} [target] - The target for the service call.
 * @property {Record<string, unknown>} [service_data] - Deprecated; service data for backward compatibility.
 * @property {Record<string, unknown>} [data] - The data to send with the service call.
 */
export interface CallServiceActionConfig extends BaseActionConfig {
  action: 'call-service' | 'perform-action';
  /** @deprecated "service" is kept for backwards compatibility. Replaced by "perform_action". */
  service?: string;
  perform_action: string;
  target?: HassServiceTarget;
  /** @deprecated "service_data" is kept for backwards compatibility. Replaced by "data". */
  service_data?: Record<string, unknown>;
  data?: Record<string, unknown>;
}

/**
 * Represents the configuration for a navigate action in Home Assistant.
 *
 * @property {'navigate'} action - The action type, which is "navigate".
 * @property {string} navigation_path - The path to navigate to.
 * @property {boolean} [navigation_replace] - Whether to replace the current history entry.
 */
export interface NavigateActionConfig extends BaseActionConfig {
  action: 'navigate';
  navigation_path: string;
  navigation_replace?: boolean;
}

/**
 * Represents the configuration for a URL action in Home Assistant.
 *
 * @property {'url'} action - The action type, which is "url".
 * @property {string} url_path - The URL path to navigate to.
 */
export interface UrlActionConfig extends BaseActionConfig {
  action: 'url';
  url_path: string;
}

/**
 * Represents the configuration for a more info action in Home Assistant.
 *
 * @property {'more-info'} action - The action type, which is "more-info".
 * @property {string} [entity] - The entity to show more information about.
 */
export interface MoreInfoActionConfig extends BaseActionConfig {
  action: 'more-info';
  entity?: string;
}

/**
 * Represents the configuration for an assist action in Home Assistant.
 *
 * @property {'assist'} action - The action type, which is "assist".
 * @property {string} [pipeline_id] - The ID of the pipeline to use for the assist action.
 * @property {boolean} [start_listening] - Whether to start listening for user input.
 */
export interface AssistActionConfig extends BaseActionConfig {
  action: 'assist';
  pipeline_id?: string;
  start_listening?: boolean;
}

/**
 * Represents the configuration for a no action in Home Assistant.
 *
 * @property {'none'} action - The action type, which is "none".
 */
export interface NoActionConfig extends BaseActionConfig {
  action: 'none';
}

/**
 * Represents the configuration for a custom action in Home Assistant.
 *
 * @property {'fire-dom-event'} action - The action type, which is "fire-dom-event".
 */
export interface CustomActionConfig extends BaseActionConfig {
  action: 'fire-dom-event';
}

/**
 * Represents the base configuration for an action in Home Assistant.
 *
 * @property {string} action - The type of action to perform.
 * @property {ConfirmationRestrictionConfig} [confirmation] - Optional confirmation settings for the action.
 */
export interface BaseActionConfig {
  action: string;
  confirmation?: ConfirmationRestrictionConfig;
}

/**
 * Represents the confirmation restriction configuration for an action in Home Assistant.
 *
 * @property {string} [text] - The confirmation text.
 * @property {RestrictionConfig[]} [exemptions] - List of exemptions for the confirmation.
 */
export interface ConfirmationRestrictionConfig {
  text?: string;
  exemptions?: RestrictionConfig[];
}

/**
 * Represents a restriction configuration in Home Assistant.
 *
 * @property {string} user - The user associated with the restriction.
 */
export interface RestrictionConfig {
  user: string;
}

/**
 * Represents the overall action configuration in Home Assistant.
 *
 * A union type representing different action-configurations available in Home Assistant.
 * Each action type can have its own specific configuration.
 */
export type ActionConfig =
  | ToggleActionConfig
  | CallServiceActionConfig
  | NavigateActionConfig
  | UrlActionConfig
  | MoreInfoActionConfig
  | AssistActionConfig
  | NoActionConfig
  | CustomActionConfig;
