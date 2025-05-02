import { AreaRegistryEntry } from '../homeassistant/data/area_registry';
import { DeviceRegistryEntry } from '../homeassistant/data/device_registry';
import { EntityRegistryEntry } from '../homeassistant/data/entity_registry';
import { ActionConfig, CallServiceActionConfig } from '../homeassistant/data/lovelace/config/action';
import { LovelaceCardConfig } from '../homeassistant/data/lovelace/config/card';
import { LovelaceConfig } from '../homeassistant/data/lovelace/config/types';
import { LovelaceViewConfig, LovelaceViewRawConfig } from '../homeassistant/data/lovelace/config/view';
import { HomeAssistant } from '../homeassistant/types';
import { LovelaceChipConfig } from '../lovelace-mushroom/utils/lovelace/chip/types';
import { StrategyHeaderCardConfig } from './strategy-cards';

/**
 * List of supported domains.
 *
 * This constant array defines the domains that are supported by the strategy.
 * Each domain represents a specific type of entity within the Home Assistant ecosystem.
 *
 * @remarks
 * - `_` refers to all domains.
 * - `default` refers to the miscellaneous domain.
 */
const SUPPORTED_DOMAINS = [
  '_',
  'binary_sensor',
  'camera',
  'climate',
  'cover',
  'default',
  'fan',
  'input_select',
  'light',
  'lock',
  'media_player',
  'number',
  'scene',
  'select',
  'sensor',
  'switch',
  'vacuum',
] as const;

/**
 * List of supported views.
 *
 * This constant array defines the views that are supported by the strategy.
 */
const SUPPORTED_VIEWS = [
  'camera',
  'climate',
  'cover',
  'fan',
  'home',
  'light',
  'lock',
  'scene',
  'switch',
  'vacuum',
] as const;

/**
 * List of supported chips.
 *
 * This constant array defines the chips that are supported by the strategy.
 */
const SUPPORTED_CHIPS = ['light', 'fan', 'cover', 'switch', 'climate', 'weather'] as const;

/**
 * List of home view sections.
 *
 * This constant array defines the sections that are present in the home view.
 */
const HOME_VIEW_SECTIONS = ['areas', 'areasTitle', 'chips', 'greeting', 'persons'] as const;

export type SupportedDomains = (typeof SUPPORTED_DOMAINS)[number];
export type SupportedViews = (typeof SUPPORTED_VIEWS)[number];
export type SupportedChips = (typeof SUPPORTED_CHIPS)[number];
export type HomeViewSections = (typeof HOME_VIEW_SECTIONS)[number];

/**
 * Base interface for sortable items.
 *
 * @property {number} order - Numeric value used for sorting items
 */
interface SortableBase {
  order: number;
}

/**
 * Sortable item that uses a title for identification.
 * Mutually exclusive with SortableWithName.
 *
 * @property {string} title - Display title of the item
 * @property {never} [name] - Prevents using name property
 */
type SortableWithTitle = SortableBase & { title: string; name?: never };

/**
 * Sortable item that uses a name for identification.
 * Mutually exclusive with SortableWithTitle.
 *
 * @property {string} name - Identifier name of the item
 * @property {never} [title] - Prevents using title property
 */
type SortableWithName = SortableBase & { name: string; title?: never };

/**
 * Union type for items that can be sorted.
 * Items must have either a title or a name property, but not both.
 *
 * @remarks
 * This type is used to sort objects by title or by name.
 * The `order` property is used to sort the items.
 */
export type Sortable = SortableWithTitle | SortableWithName;

/**
 * An entry of a Home Assistant Registry.
 */
export type RegistryEntry = StrategyArea | DeviceRegistryEntry | EntityRegistryEntry;

/**
 * View Configuration of the strategy.
 *
 * @property {boolean} hidden - If True, the view is hidden from the dashboard.
 * @property {number} order - Ordering position of the views at the top of the dashboard.
 */
export interface StrategyViewConfig extends LovelaceViewConfig {
  hidden: boolean;
  order: number;
}

/**
 * Dashboard Info Object.
 *
 * Home Assistant passes this object to the Dashboard Generator method.
 *
 * @property {LovelaceConfig} config - Dashboard configuration.
 * @property {HomeAssistant} hass - The Home Assistant object.
 *
 * @see https://developers.home-assistant.io/docs/frontend/custom-ui/custom-strategy/#dashboard-strategies
 */
export interface DashboardInfo {
  config: LovelaceViewRawConfig & {
    strategy: {
      options?: StrategyConfig & { area: StrategyArea };
    };
  };
  hass: HomeAssistant;
}

/**
 * View Info Object.
 *
 * Home Assistant passes this object to the View Generator method.
 *
 * @property {LovelaceConfig} config - Dashboard configuration.
 * @property {HomeAssistant} hass - The Home Assistant object.
 * @property {LovelaceViewConfig} view - View configuration.
 *
 * @see https://developers.home-assistant.io/docs/frontend/custom-ui/custom-strategy/#view-strategies
 */
export interface ViewInfo {
  config: LovelaceConfig;
  hass: HomeAssistant;
  view: LovelaceViewRawConfig & {
    strategy: {
      options?: StrategyConfig & { area: StrategyArea };
    };
  };
}

/**
 * All-Domains Configuration.
 *
 * @property {boolean | undefined} hide_config_entities - If True, all configuration entities are hidden from the
 *   dashboard.
 * @property {boolean | undefined} hide_diagnostic_entities - If True, all diagnostic entities are hidden from the
 *   dashboard.
 */
export interface AllDomainsConfig {
  hide_config_entities: boolean | undefined;
  hide_diagnostic_entities: boolean | undefined;
}

/**
 * Single Domain Configuration.
 *
 * @property {boolean} hidden - If True, all entities of the domain are hidden from the dashboard.
 * @property {number} [order] - Ordering position of the domains in a view.
 */
export interface SingleDomainConfig extends Partial<StrategyHeaderCardConfig> {
  hidden: boolean;
  order?: number;
}

/**
 * Strategy Configuration.
 *
 * @property {Object.<K in keyof StrategyArea, StrategyArea>} areas - List of areas.
 * @property {Object.<K in keyof RegistryEntry, CustomCardConfig>} card_options - Card options for entities.
 * @property {ChipConfiguration} chips - The configuration of chips in the Home view.
 * @property {boolean} debug - If True, the strategy outputs more verbose debug information in the console.
 * @property {Object.<string, AllDomainsConfig | SingleDomainConfig>} domains - List of domains.
 * @property {LovelaceCardConfig[]} extra_cards - List of cards to show below room cards.
 * @property {StrategyViewConfig[]} extra_views - List of custom-defined views to add to the dashboard.
 * @property {{ hidden: HomeViewSections[] | [] }} home_view - List of views to add to the dashboard.
 * @property {Record<SupportedViews, StrategyViewConfig>} views - The configurations of views.
 * @property {LovelaceCardConfig[]} quick_access_cards - List of custom-defined cards to show between the welcome card
 *                                                       and rooms cards.
 */
export interface StrategyConfig {
  areas: { [S: string]: StrategyArea };
  card_options: { [S: string]: CustomCardConfig };
  chips: ChipConfiguration;
  debug: boolean;
  domains: { [K in SupportedDomains]: K extends '_' ? AllDomainsConfig : SingleDomainConfig };
  extra_cards: LovelaceCardConfig[];
  extra_views: StrategyViewConfig[];
  home_view: {
    hidden: HomeViewSections[] | [];
  };
  views: Record<SupportedViews, StrategyViewConfig>;
  quick_access_cards: LovelaceCardConfig[];
}

/**
 * Represents the default configuration for a strategy.
 */
export interface StrategyDefaults extends StrategyConfig {
  areas: { undisclosed: StrategyArea } & { [S: string]: StrategyArea };
}

/**
 * Strategy Area.
 *
 * @property {boolean} [hidden] True if the entity should be hidden from the dashboard.
 * @property {object[]} [extra_cards] - An array of card configurations.
 *                                      The configured cards are added to the dashboard.
 * @property {number} [order] - Ordering position of the area in the list of available areas.
 * @property {string} [type] - The type of area card.
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
 * @property {boolean} climate_count - Chip to display the number of climates which are not off.
 * @property {boolean} cover_count - Chip to display the number of unclosed covers.
 * @property {LovelaceChipConfig[] | []} extra_chips - List of extra chips.
 * @property {boolean} fan_count - Chip to display the number of fans on.
 * @property {boolean} light_count - Chip to display the number of lights on.
 * @property {boolean} switch_count - Chip to display the number of switches on.
 * @property {'auto' | `weather.${string}`} weather_entity - Entity id for the weather chip to use.
 *                                                           Accepts `weather.` ids or `auto` only.
 */
export interface ChipConfiguration {
  climate_count: boolean;
  cover_count: boolean;
  extra_chips: LovelaceChipConfig[] | [];
  fan_count: boolean;
  light_count: boolean;
  switch_count: boolean;
  weather_entity: 'auto' | `weather.${string}`;
}

/**
 * Custom Card Configuration for an entity.
 *
 * @property {boolean} hidden - If True, the card is hidden from the dashboard.
 */
export interface CustomCardConfig extends LovelaceCardConfig {
  hidden?: boolean;
}

/**
 * Checks if the given object is of a sortable type.
 *
 * Sortable types are objects that have an `order`, `title` or `name` property.
 *
 * @param {object} object - The object to check.
 * @returns {boolean} - True if the object is an instance of Sortable, false otherwise.
 */
export function isSortable(object: object): object is Sortable {
  return object && ('order' in object || 'title' in object || 'name' in object);
}

/**
 * Type guard to check if an object matches the CallServiceActionConfig interface.
 *
 * @param {ActionConfig} [object] - The object to check.
 * @returns {boolean} - True if the object represents a valid service action configuration.
 */
export function isCallServiceActionConfig(object?: ActionConfig): object is CallServiceActionConfig {
  return (
    !!object && (object.action === 'perform-action' || object.action === 'call-service') && 'perform_action' in object
  );
}

/**
 * Type guard to check if a given identifier exists in a list of supported identifiers.
 *
 *
 * @param id The identifier to check
 * @param supportedList The list of valid identifiers
 * @returns True if the identifier exists in the supported list
 *
 * @typeParam T - The type of supported identifiers
 */
function isInSupportedList<T extends string>(id: string, supportedList: readonly T[]): id is T {
  return supportedList.includes(id as T);
}

/**
 * Type guard to check if the strategy supports a given view identifier.
 *
 * @param {string} id - The view identifier to check (e.g., "light", "climate", "home").
 * @returns {boolean} - True if the identifier represents a supported view type
 */
export function isSupportedView(id: string): id is SupportedViews {
  return isInSupportedList(id, SUPPORTED_VIEWS);
}

/**
 * Type guard to check if the strategy supports a given domain identifier.
 *
 * @param {string} id - The domain identifier to check (e.g., "light", "climate", "sensor").
 * @returns {boolean} - True if the identifier represents a supported domain.
 *
 * @remarks
 * Special domains:
 * - "_" represents all domains
 * - "default" represents the miscellaneous domain
 */
export function isSupportedDomain(id: string): id is SupportedDomains {
  return isInSupportedList(id, SUPPORTED_DOMAINS);
}

/**
 * Type guard to check if the strategy supports a given chip identifier.
 *
 * @param {string} id - The chip identifier to check (e.g., "light", "climate", "weather").
 * @returns {boolean} - True if the identifier represents a supported chip type.
 */
export function isSupportedChip(id: string): id is SupportedChips {
  return isInSupportedList(id, SUPPORTED_CHIPS);
}
