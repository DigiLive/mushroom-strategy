import {
  Auth,
  Connection,
  HassConfig,
  HassEntities,
  HassEntity,
  HassServices,
  HassServiceTarget,
  MessageBase,
} from "home-assistant-js-websocket";
import {AreaRegistryEntry} from "./data/area_registry";
import {DeviceRegistryEntry} from "./data/device_registry";
import {EntityRegistryDisplayEntry} from "./data/entity_registry";
import {FloorRegistryEntry} from "./data/floor_registry";
import {Themes} from "./data/ws-themes";
import {FrontendLocaleData, getHassTranslations} from "./data/translations";
import {LocalizeFunc} from "./common/translations/localize";
import {CoreFrontendUserData} from "./data/frontend";

export interface Credential {
  auth_provider_type: string;
  auth_provider_id: string;
}

export interface MFAModule {
  id: string;
  name: string;
  enabled: boolean;
}

export interface CurrentUser {
  id: string;
  is_owner: boolean;
  is_admin: boolean;
  name: string;
  credentials: Credential[];
  mfa_modules: MFAModule[];
}

export interface PanelInfo<T = Record<string, any> | null> {
  component_name: string;
  config: T;
  icon: string | null;
  title: string | null;
  url_path: string;
  config_panel_domain?: string;
}

export type Panels = Record<string, PanelInfo>;

export interface Translation {
  nativeName: string;
  isRTL: boolean;
  hash: string;
}

export interface TranslationMetadata {
  fragments: string[];
  translations: Record<string, Translation>;
}

export type TranslationDict = {[key: string]: string};

export type Resources = Record<string, Record<string, string>>;

// Currently selected theme and its settings. These are the values stored in local storage.
// Note: These values are not meant to be used at runtime to check whether dark mode is active
// or which theme name to use, as this interface represents the config data for the theme picker.
// The actually active dark mode and theme name can be read from hass.themes.
export interface ThemeSettings {
  theme: string;
  // Radio box selection for theme picker. Do not use in Lovelace rendering as
  // it can be undefined == auto.
  // Property hass.themes.darkMode carries effective current mode.
  dark?: boolean;
  primaryColor?: string;
  accentColor?: string;
}

export interface HomeAssistant {
  auth: Auth & { external?: {[key: string]: any;} };
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
  // i18n
  // current effective language in that order:
  //   - backend saved user selected language
  //   - language in local app storage
  //   - browser language
  //   - english (en)
  language: string;
  // local stored language, keep that name for backward compatibility
  selectedLanguage: string | null;
  locale: FrontendLocaleData;
  resources: Resources;
  localize: LocalizeFunc;
  translationMetadata: TranslationMetadata;
  suspendWhenHidden: boolean;
  enableShortcuts: boolean;
  vibrate: boolean;
  debugConnection: boolean;
  dockedSidebar: "docked" | "always_hidden" | "auto";
  defaultPanel: string;
  moreInfoEntityId: string | null;
  user?: CurrentUser;
  userData?: CoreFrontendUserData | null;
  hassUrl(path?: any): string;
  callService(
    domain: ServiceCallRequest["domain"],
    service: ServiceCallRequest["service"],
    serviceData?: ServiceCallRequest["serviceData"],
    target?: ServiceCallRequest["target"],
    notifyOnError?: boolean,
    returnResponse?: boolean
  ): Promise<ServiceCallResponse>;
  callApi<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    parameters?: Record<string, any>,
    headers?: Record<string, string>
  ): Promise<T>;
  callApiRaw( // introduced in 2024.11
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    parameters?: Record<string, any>,
    headers?: Record<string, string>,
    signal?: AbortSignal
  ): Promise<Response>;
  fetchWithAuth(path: string, init?: Record<string, any>): Promise<Response>;
  sendWS(msg: MessageBase): void;
  callWS<T>(msg: MessageBase): Promise<T>;
  loadBackendTranslation(
    category: Parameters<typeof getHassTranslations>[2],
    integrations?: Parameters<typeof getHassTranslations>[3],
    configFlow?: Parameters<typeof getHassTranslations>[4]
  ): Promise<LocalizeFunc>;
  loadFragmentTranslation(fragment: string): Promise<LocalizeFunc | undefined>;
  formatEntityState(stateObj: HassEntity, state?: string): string;
  formatEntityAttributeValue(
    stateObj: HassEntity,
    attribute: string,
    value?: any
  ): string;
  formatEntityAttributeName(stateObj: HassEntity, attribute: string): string;
}

export interface Context {
  id: string;
  parent_id?: string;
  user_id?: string | null;
}

export interface ServiceCallRequest {
  domain: string;
  service: string;
  serviceData?: Record<string, any>;
  target?: HassServiceTarget;
}

export interface ServiceCallResponse {
  context: Context;
  response?: any;
}
