import {
  Auth,
  Connection,
  HassConfig,
  HassEntities,
  HassEntity,
  HassServices,
  HassServiceTarget,
  MessageBase,
} from 'home-assistant-js-websocket';
import { LocalizeFunc } from './common/translations/localize';
import { AreaRegistryEntry } from './data/area_registry';
import { DeviceRegistryEntry } from './data/device_registry';
import { EntityRegistryDisplayEntry } from './data/entity_registry';
import { FloorRegistryEntry } from './data/floor_registry';
import { CoreFrontendUserData } from './data/frontend';
import { FrontendLocaleData, getHassTranslations } from './data/translations';
import { Themes } from './data/ws-themes';

/**
 * Represents the credentials for a user in Home Assistant.
 *
 * @property {string} auth_provider_type - The type of authentication provider.
 * @property {string} auth_provider_id - The ID of the authentication provider.
 */
export interface Credential {
  auth_provider_type: string;
  auth_provider_id: string;
}

/**
 * Represents a multifactor authentication module in Home Assistant.
 *
 * @property {string} id - The unique identifier for the MFA module.
 * @property {string} name - The name of the MFA module.
 * @property {boolean} enabled - Whether the MFA module is enabled.
 */
export interface MFAModule {
  id: string;
  name: string;
  enabled: boolean;
}

/**
 * Represents the current user in Home Assistant.
 *
 * @property {string} id - The unique identifier for the user.
 * @property {boolean} is_owner - Indicates if the user is an owner.
 * @property {boolean} is_admin - Indicates if the user is an admin.
 * @property {string} name - The name of the user.
 * @property {Credential[]} credentials - The credentials associated with the user.
 * @property {MFAModule[]} mfa_modules - The MFA modules associated with the user.
 */
export interface CurrentUser {
  id: string;
  is_owner: boolean;
  is_admin: boolean;
  name: string;
  credentials: Credential[];
  mfa_modules: MFAModule[];
}

/**
 * Represents information about a panel in Home Assistant.
 *
 * @template T The type of the configuration object for the panel.
 *
 * @property {string} component_name - The name of the component for the panel.
 * @property {T} config - The configuration for the panel.
 * @property {string | null} icon - The icon for the panel.
 * @property {string | null} title - The title of the panel.
 * @property {string} url_path - The URL path for the panel.
 * @property {string} [config_panel_domain] - The domain for the configuration panel.
 */
export interface PanelInfo<T = Record<string, any> | null> {
  component_name: string;
  config: T;
  icon: string | null;
  title: string | null;
  url_path: string;
  config_panel_domain?: string;
}

/**
 * Represents the panels in Home Assistant.
 *
 * @property {Record<string, PanelInfo>} panels - The panel configurations.
 */
export interface Panels {
  panels: Record<string, PanelInfo>;
}

/**
 * Represents a translation in Home Assistant.
 *
 * @property {string} nativeName - The native name of the language.
 * @property {boolean} isRTL - Indicates if the language is written right-to-left.
 * @property {string} hash - The hash for the translation.
 */
export interface Translation {
  nativeName: string;
  isRTL: boolean;
  hash: string;
}

/**
 * Represents metadata for translations in Home Assistant.
 *
 * @property {string[]} fragments - The fragments of the translation.
 * @property {Record<string, Translation>} translations - The translations mapped by language.
 */
export interface TranslationMetadata {
  fragments: string[];
  translations: Record<string, Translation>;
}

/**
 * Represents a dictionary of translations in Home Assistant.
 *
 * @property {Record<string, string>} translations - The translations mapped by a key.
 */
export interface TranslationDict {
  translations: Record<string, string>;
}

/**
 * Represents resources in Home Assistant.
 *
 * @property {Record<string, Record<string, string>>} resources - The resources mapped by a key.
 */
export interface Resources {
  resources: Record<string, Record<string, string>>;
}

/**
 * Represents the settings for themes in Home Assistant.
 *
 * @property {string} theme - The name of the selected theme.
 * @property {boolean} [dark] - Indicates if the theme is dark.
 * @property {string} [primaryColor] - The primary color of the theme.
 * @property {string} [accentColor] - The accent color of the theme.
 */
export interface ThemeSettings {
  theme: string;
  dark?: boolean;
  primaryColor?: string;
  accentColor?: string;
}

/**
 * Represents the main Home Assistant object.
 *
 * @interface HomeAssistant
 * @property {Auth} auth - The authentication object.
 * @property {Connection} connection - The connection object.
 * @property {boolean} connected - Indicates if the connection is active.
 * @property {HassEntities} states - The current states of entities.
 * @property {Record<string, EntityRegistryDisplayEntry>} entities - The entities in the registry.
 * @property {Record<string, DeviceRegistryEntry>} devices - The devices in the registry.
 * @property {Record<string, AreaRegistryEntry>} areas - The areas in the registry.
 * @property {Record<string, FloorRegistryEntry>} floors - The floors in the registry.
 * @property {HassServices} services - The services available in Home Assistant.
 * @property {HassConfig} config - The configuration for Home Assistant.
 * @property {Themes} themes - The available themes.
 * @property {ThemeSettings | null} selectedTheme - The currently selected theme.
 * @property {Panels} panels - The panel configurations.
 * @property {string} panelUrl - The URL for the panel.
 * @property {string} language - The current language.
 * @property {string | null} selectedLanguage - The selected language.
 * @property {FrontendLocaleData} locale - The locale data.
 * @property {Resources} resources - The resources available.
 * @property {LocalizeFunc} localize - The localization function.
 * @property {TranslationMetadata} translationMetadata - The translation metadata.
 * @property {boolean} suspendWhenHidden - Indicates if the frontend should suspend when hidden.
 * @property {boolean} enableShortcuts - Indicates if shortcuts are enabled.
 * @property {boolean} vibrate - Indicates if vibration feedback is enabled.
 * @property {boolean} debugConnection - Indicates if debug mode is enabled for the connection.
 * @property {'docked' | 'always_hidden' | 'auto'} dockedSidebar - The sidebar visibility setting.
 * @property {string} defaultPanel - The default panel to show.
 * @property {string | null} moreInfoEntityId - The entity ID for more info.
 * @property {CurrentUser} [user] - The current user object.
 * @property {CoreFrontendUserData | null} [userData] - The frontend user data.
 */
export interface HomeAssistant {
  auth: Auth & { external?: { [key: string]: any } };
  connection: Connection;
  connected: boolean;
  states: HassEntities;
  entities: Record<string, EntityRegistryDisplayEntry>;
  devices: Record<string, DeviceRegistryEntry>;
  areas: Record<string, AreaRegistryEntry>;
  floors: Record<string, FloorRegistryEntry>;
  services: HassServices;
  config: HassConfig;
  themes: Themes;
  selectedTheme: ThemeSettings | null;
  panels: Panels;
  panelUrl: string;
  language: string;
  selectedLanguage: string | null;
  locale: FrontendLocaleData;
  resources: Resources;
  localize: LocalizeFunc;
  translationMetadata: TranslationMetadata;
  suspendWhenHidden: boolean;
  enableShortcuts: boolean;
  vibrate: boolean;
  debugConnection: boolean;
  dockedSidebar: 'docked' | 'always_hidden' | 'auto';
  defaultPanel: string;
  moreInfoEntityId: string | null;
  user?: CurrentUser;
  userData?: CoreFrontendUserData | null;

  /**
   * Returns the URL for the Home Assistant instance.
   *
   * @param {any} path - Optional path to append to the base URL.
   */
  hassUrl(path?: any): string;

  /**
   * Calls a service in Home Assistant.
   *
   * @param {ServiceCallRequest['domain']} domain - The domain of the service.
   * @param {ServiceCallRequest['service']} service - The name of the service to call.
   * @param {ServiceCallRequest['serviceData']} [serviceData] - Optional data to send with the service call.
   * @param {ServiceCallRequest['target']} [target] - Optional target for the service call.
   * @param {boolean} [notifyOnError] - Whether to notify on error.
   * @param {boolean} [returnResponse] - Whether to return the response.
   */
  callService(
    domain: ServiceCallRequest['domain'],
    service: ServiceCallRequest['service'],
    serviceData?: ServiceCallRequest['serviceData'],
    target?: ServiceCallRequest['target'],
    notifyOnError?: boolean,
    returnResponse?: boolean,
  ): Promise<ServiceCallResponse>;

  /**
   * Calls the Home Assistant API.
   *
   * @template T The expected response type.
   *
   * @param {'GET' | 'POST' | 'PUT' | 'DELETE'} method - The HTTP method to use.
   * @param {string} path - The API endpoint path.
   * @param {Record<string, any>} [parameters] - Optional parameters to send with the request.
   * @param {Record<string, string>} [headers] - Optional headers to include in the request.
   */
  callApi<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    parameters?: Record<string, any>,
    headers?: Record<string, string>,
  ): Promise<T>;

  /**
   * Calls the Home Assistant API with raw response.
   *
   * @param {'GET' | 'POST' | 'PUT' | 'DELETE'} method - The HTTP method to use.
   * @param {string} path - The API endpoint path.
   * @param {Record<string, any>} [parameters] - Optional parameters to send with the request.
   * @param {Record<string, string>} [headers] - Optional headers to include in the request.
   * @param {AbortSignal} [signal] - Optional signal to abort the request.
   */
  callApiRaw(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    parameters?: Record<string, any>,
    headers?: Record<string, string>,
    signal?: AbortSignal,
  ): Promise<Response>;

  /**
   * Fetches a resource with authentication.
   *
   * @param {string} path - The resource path to fetch.
   * @param {Record<string, any>} [init] - Optional fetch options.
   */
  fetchWithAuth(path: string, init?: Record<string, any>): Promise<Response>;

  /**
   * Sends a WebSocket message.
   *
   * @param {MessageBase} msg - The message to send.
   */
  sendWS(msg: MessageBase): void;

  /**
   * Calls a WebSocket service.
   *
   * @template T The expected response type.
   *
   * @param {MessageBase} msg - The message to send.
   */
  callWS<T>(msg: MessageBase): Promise<T>;

  /**
   * Load backend translation.
   *
   * @param {Parameters<typeof getHassTranslations>[2]} category - The category of translations.
   * @param {Parameters<typeof getHassTranslations>[3]} [integrations] - Optional integrations to include.
   * @param {Parameters<typeof getHassTranslations>[4]} [configFlow] - Optional config flow.
   *
   * @returns {Promise<LocalizeFunc>} The localization function.
   */
  loadBackendTranslation(
    category: Parameters<typeof getHassTranslations>[2],
    integrations?: Parameters<typeof getHassTranslations>[3],
    configFlow?: Parameters<typeof getHassTranslations>[4],
  ): Promise<LocalizeFunc>;

  /**
   * Load fragment translation.
   *
   * @param {string} fragment - The fragment to load.
   * @returns {Promise<LocalizeFunc | undefined>} The localization function or undefined.
   */
  loadFragmentTranslation(fragment: string): Promise<LocalizeFunc | undefined>;

  /**
   * Formats the state of an entity.
   *
   * @param {HassEntity} stateObj - The state object of the entity.
   * @param {string} [state] - Optional state to format.
   */
  formatEntityState(stateObj: HassEntity, state?: string): string;

  /**
   * Formats the value of an entity attribute.
   *
   * @param {HassEntity} stateObj - The state object of the entity.
   * @param {string} attribute - The attribute to format.
   * @param {any} [value] - Optional value to format.
   */
  formatEntityAttributeValue(stateObj: HassEntity, attribute: string, value?: any): string;

  /**
   * Formats the name of an entity attribute.
   *
   * @param {HassEntity} stateObj - The state object of the entity.
   * @param {string} attribute - The attribute to format.
   */
  formatEntityAttributeName(stateObj: HassEntity, attribute: string): string;
}

/**
 * Represents the context of a service call.
 *
 * @property {string} id - The unique identifier for the context.
 * @property {string} [parent_id] - The optional parent ID of the context.
 * @property {string | null} [user_id] - The optional user ID associated with the context.
 */
export interface Context {
  id: string;
  parent_id?: string;
  user_id?: string | null;
}

/**
 * Represents a service call request in Home Assistant.
 *
 * @property {string} domain - The domain of the service to call.
 * @property {string} service - The name of the service to call.
 * @property {Record<string, any>} [serviceData] - Optional data to send with the service call.
 * @property {HassServiceTarget} [target] - Optional target for the service call.
 */
export interface ServiceCallRequest {
  domain: string;
  service: string;
  serviceData?: Record<string, any>;
  target?: HassServiceTarget;
}

/**
 * Represents the response from a service call in Home Assistant.
 *
 * @property {Context} context - The context of the service call.
 * @property {any} [response] - The optional response data from the service call.
 */
export interface ServiceCallResponse {
  context: Context;
  response?: any;
}
