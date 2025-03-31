import {CallServiceActionConfig, LovelaceCardConfig,} from "../homeassistant/data/lovelace";
import {HomeAssistant} from "../homeassistant/types";
import {AreaRegistryEntry} from "../homeassistant/data/area_registry";
import {cards} from "./cards";
import {EntityRegistryEntry} from "../homeassistant/data/entity_registry";
import {LovelaceChipConfig} from "../lovelace-mushroom/utils/lovelace/chip/types";
import {HassServiceTarget} from "home-assistant-js-websocket";
import {LovelaceViewConfig, LovelaceViewRawConfig} from "../homeassistant/data/lovelace/config/view";
import {LovelaceConfig} from "../homeassistant/data/lovelace/config/types";

/**
 * List of supported domains.
 *
 * This constant array defines the domains that are supported by the strategy.
 * Each domain represents a specific type of entity within the Home Assistant ecosystem.
 *
 * _ refers to all domains.
 * default refers to the miscellanea domain.
 *
 * @readonly
 * @constant
 */
const SUPPORTED_DOMAINS = [
  "_",
  "binary_sensor",
  "camera",
  "climate",
  "cover",
  "default",
  "fan",
  "input_select",
  "light",
  "lock",
  "media_player",
  "number",
  "scene",
  "select",
  "sensor",
  "switch",
  "vacuum",
] as const;

/**
 * List of supported views.
 *
 * This constant array defines the views that are supported by the strategy.
 *
 * @readonly
 * @constant
 */
const SUPPORTED_VIEWS = [
  "camera",
  "climate",
  "cover",
  "fan",
  "home",
  "light",
  "scene",
  "switch",
  "vacuum",
] as const;

const SUPPORTED_CHIPS = [
  "light",
  "fan",
  "cover",
  "switch",
  "climate",
  "weather",
] as const;

/**
 * List of home view sections.
 *
 * This constant array defines the sections that are present in the home view.
 *
 * @readonly
 * @constant
 */
const HOME_VIEW_SECTIONS = [
  "areas",
  "areasTitle",
  "chips",
  "greeting",
  "persons",
] as const;

export namespace generic {
  export type SupportedDomains = typeof SUPPORTED_DOMAINS[number];
  export type SupportedViews = typeof SUPPORTED_VIEWS[number];
  export type SupportedChips = typeof SUPPORTED_CHIPS[number];
  export type HomeViewSections = typeof HOME_VIEW_SECTIONS[number];

  /**
   * An entry of a Home Assistant Register.
   */
  export type RegistryEntry =
    | AreaRegistryEntry
    | DataTransfer
    | EntityRegistryEntry

  /**
   * View Configuration of the strategy.
   *
   * @interface StrategyViewConfig
   * @extends LovelaceViewConfig
   *
   * @property {boolean} [hidden] If True, the view is hidden from the dashboard.
   * @property {number} [order] Ordering position of the views at the top of the dashboard.
   */
  export interface StrategyViewConfig extends LovelaceViewConfig {
    hidden: boolean;
    order: number;
  }

  /**
   * All Domains Configuration.
   *
   * @interface AllDomainsConfig
   *
   * @property {boolean} [hide_config_entities] If True, all configuration entities are hidden from the dashboard.
   * @property {boolean} [hide_diagnostic_entities] If True, all diagnostic entities are hidden from the dashboard.
   */
  export interface AllDomainsConfig {
    hide_config_entities: boolean;
    hide_diagnostic_entities: boolean;
  }

  /**
   * Single Domain Configuration.
   *
   * @interface SingleDomainConfig
   * @extends Partial<cards.ControllerCardConfig>
   *
   * @property {boolean} [hidden] If True, all entities of the domain are hidden from the dashboard.
   * @property {number} [order] Ordering position of the domains in a views.
   */
  export interface SingleDomainConfig extends Partial<cards.ControllerCardConfig> {
    hidden: boolean;
    order?: number;
  }

  /**
   * Dashboard Info Object.
   *
   * Home Assistant passes this object to the Dashboard Generator method.
   *
   * @interface DashboardInfo
   *
   * @property {LovelaceConfig} config Dashboard configuration.
   * @property {HomeAssistant} hass The Home Assistant object.
   *
   * @see https://developers.home-assistant.io/docs/frontend/custom-ui/custom-strategy/#dashboard-strategies
   */
  export interface DashboardInfo {
    config: LovelaceViewRawConfig & {
      strategy: {
        options?: StrategyConfig & { area: StrategyArea }
      }
    };
    hass: HomeAssistant;
  }

  /**
   * View Info Object.
   *
   * Home Assistant passes this object to the View Generator method.
   *
   * @interface ViewInfo
   *
   * @property {LovelaceConfig} config Dashboard configuration.
   * @property {HomeAssistant} hass The Home Assistant object.
   * @property {LovelaceViewConfig} view View configuration.
   *
   * @see https://developers.home-assistant.io/docs/frontend/custom-ui/custom-strategy/#view-strategies
   */
  export interface ViewInfo {
    config: LovelaceConfig;
    hass: HomeAssistant;
    view: LovelaceViewRawConfig & {
      strategy: {
        options?: StrategyConfig & { area: StrategyArea }
      }
    };
  }

  /**
   * Strategy Configuration.
   *
   * @interface StrategyConfig
   *
   * @property {Object.<string, StrategyArea>} areas List of areas.
   * @property {Object.<string, CustomCardConfig>} card_options Card options for entities.
   * @property {Partial<ChipConfiguration>} chips The configuration of chips in the Home view.
   * @property {boolean} debug If True, the strategy outputs more verbose debug information in the console.
   * @property {Object.<string, AllDomainsConfig | SingleDomainConfig>} domains List of domains.
   * @property {LovelaceCardConfig[]} extra_cards List of cards to show below room cards.
   * @property {StrategyViewConfig[]} extra_views List of custom-defined views to add to the dashboard.
   * @property {{ hidden: HomeViewSections[] | [] }} home_view List of views to add to the dashboard.
   * @property {Object.<hidden, StrategyViewConfig>} views The configurations of views.
   * @property {LovelaceCardConfig[]} quick_access_cards List of custom-defined cards to show between the welcome card
   *                                                     and rooms cards.
   */
  export interface StrategyConfig {
    areas: { [S: string]: StrategyArea };
    card_options: { [S: string]: CustomCardConfig };
    chips: Partial<ChipConfiguration>;
    debug: boolean;
    domains: { [K in SupportedDomains]: K extends "_" ? AllDomainsConfig : SingleDomainConfig; };
    extra_cards: LovelaceCardConfig[];
    extra_views: StrategyViewConfig[];
    home_view: {
      hidden: HomeViewSections[] | [];
    }
    views: Record<SupportedViews, StrategyViewConfig>;
    quick_access_cards: LovelaceCardConfig[];
  }

  /**
   * Represents the default configuration for a strategy.
   *
   * @interface StrategyDefaults
   */
  export interface StrategyDefaults extends StrategyConfig {
    areas: { "undisclosed": StrategyArea } & { [S: string]: StrategyArea };
  }

  /**
   * Strategy Area.
   *
   * @interface StrategyArea
   *
   * @property {boolean} [hidden] True if the entity should be hidden from the dashboard.
   * @property {object[]} [extra_cards] An array of card configurations.
   *                                    The configured cards are added to the dashboard.
   * @property {number} [order] Ordering position of the area in the list of available areas.
   * @property {string} [type] The type of area card.
   */
  export interface StrategyArea extends AreaRegistryEntry {
    extra_cards?: LovelaceCardConfig[];
    hidden?: boolean;
    order?: number;
    type?: string;
  }

  /**
   * A list of chips to show in the Home view.
   *
   * @interface ChipConfiguration
   *
   * @property {boolean} climate_count Chip to display the number of climates which are not off.
   * @property {boolean} cover_count Chip to display the number of unclosed covers.
   * @property {boolean} fan_count Chip to display the number of fans on.
   * @property {boolean} light_count Chip to display the number of lights on.
   * @property {boolean} switch_count Chip to display the number of switches on.
   * @property {string} weather_entity Entity ID for the weather chip to use, accepts `weather.` only.
   * @property {object[]} extra_chips List of extra chips.
   */
  export interface ChipConfiguration {
    climate_count: boolean;
    cover_count: boolean;
    extra_chips: LovelaceChipConfig[];
    fan_count: boolean;
    light_count: boolean;
    switch_count: boolean;
    weather_entity: string;
  }

  /**
   * Custom Card Configuration for an entity.
   *
   * @interface CustomCardConfig
   * @extends LovelaceCardConfig
   *
   * @property {boolean} hidden If True, the card is hidden from the dashboard.
   */
  export interface CustomCardConfig extends LovelaceCardConfig {
    hidden?: boolean;
  }

  /**
   * Area Filter Context.
   *
   * @interface AreaFilterContext
   *
   * @property {AreaRegistryEntry} area Area Entry.
   * @property {string[]} areaDeviceIds The id of devices which are linked to the area.
   * @property {string} [domain] Domain of an entity.
   *                             Example: `light`.
   */
  export interface AreaFilterContext {
    area: AreaRegistryEntry;
    areaDeviceIds: string[];
    domain?: string;
  }

  /**
   * Checks if the given object is an instance of CallServiceActionConfig.
   *
   * @param {any} obj - The object to be checked.
   * @returns {boolean} - Returns true if the object is an instance of CallServiceActionConfig, otherwise false.
   */
  export function isCallServiceActionConfig(obj: any): obj is CallServiceActionConfig {
    return obj && obj.action === "call-service" && ["action", "service"].every(key => key in obj);
  }

  /**
   * Checks if the given object is an instance of HassServiceTarget.
   *
   * @param {any} obj - The object to check.
   * @returns {boolean} - True if the object is an instance of HassServiceTarget, false otherwise.
   */
  export function isCallServiceActionTarget(obj: any): obj is HassServiceTarget {
    return obj && ["entity_id", "device_id", "area_id"].some(key => key in obj);
  }

  interface SortableBase {
    order: number;
  }

  type SortableWithTitle = SortableBase & { title: string; name?: never };
  type SortableWithName = SortableBase & { name: string; title?: never };


  /**
   * The union type of SortableWithTitle and SortableWithName.
   *
   * @remarks
   * This type is used to sort objects by title or by name.
   * The `order` property is used to sort the objects.
   * The `title` and `name` properties are used to display the object in the UI.
   */
  export type Sortable = SortableWithTitle | SortableWithName;


  /**
   * Checks if the given object is of a sortable type.
   *
   * Sortable types are objects that have a `title` or a `name` property and an `order` property.
   *
   * @param {any} obj - The object to check.
   * @returns {boolean} - True if the object is an instance of Sortable, false otherwise.
   */
  export function isSortable(obj: any): obj is Sortable {
    return obj && 'order' in obj && ('title' in obj || 'name' in obj);
  }

  /**
   * Checks if the given view id is a supported view.
   *
   * @param {string} id - The view id to check.
   * @returns {boolean} - Returns true if the view id is a supported view, otherwise false.
   */
  export function isSupportedView(id: string): id is SupportedViews {
    return SUPPORTED_VIEWS.includes(id as SupportedViews);
  }

  /**
   * Checks if the given domain id is a supported domain.
   *
   * @param {string} id - The domain id to check.
   * @returns {boolean} - Returns true if the domain id is a supported domain, otherwise false.
   */
  export function isSupportedDomain(id: string): id is SupportedDomains {
    return SUPPORTED_DOMAINS.includes(id as SupportedDomains);
  }
}
