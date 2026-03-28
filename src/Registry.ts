import deepmerge from 'deepmerge';
import { HassEntities } from 'home-assistant-js-websocket';
import { AreaRegistryEntry } from './types/homeassistant/data/area_registry';
import { DeviceRegistryEntry } from './types/homeassistant/data/device_registry';
import { EntityRegistryEntry } from './types/homeassistant/data/entity_registry';
import { DashboardInfo, StrategyArea, StrategyConfig, SupportedDomains } from './types/strategy/strategy-generics';
import { logMessage, lvlFatal, lvlOff, lvlWarn, setDebugLevel } from './utilities/debug';
import setupCustomLocalize from './utilities/localize';
import RegistryFilter from './utilities/RegistryFilter';

/**
 * Registry Class
 *
 * Contains the entries of Home Assistant's registries and Strategy configuration.
 */
class Registry {
  /**
   * Class constructor.
   *
   * @remarks
   * This class shouldn't be instantiated directly.
   * Instead, method {@link Registry.initialize} must be invoked.
   */
  // noinspection JSUnusedLocalSymbols
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  /** Entries of Home Assistant's device registry. */
  private static _devices: DeviceRegistryEntry[];

  /**
   * Home Assistant's Device registry.
   *
   * @remarks
   * This module makes changes to the registry at {@link Registry.initialize}.
   */
  static get devices(): DeviceRegistryEntry[] {
    return Registry._devices;
  }

  /** Entries of Home Assistant's state registry */
  private static _hassStates: HassEntities;

  /** Home Assistant's State registry. */
  static get hassStates(): HassEntities {
    return Registry._hassStates;
  }

  /** Indicates whether this module is initialized. */
  private static _initialized: boolean = false;

  /**
   * Get the initialization status of the Registry class.
   *
   * @returns {boolean} True if the registry has been initialized.
   */
  static get initialized(): boolean {
    return Registry._initialized;
  }

  /** Entries of Home Assistant's entity registry. */
  private static _entities: EntityRegistryEntry[];

  /**
   * Home Assistant's Entity registry.
   *
   * @remarks This module makes changes to the registry at {@link Registry.initialize}.
   *
   * @returns {EntityRegistryEntry[]} An array of entity registry entries.
   */
  static get entities(): EntityRegistryEntry[] {
    return Registry._entities;
  }

  /** Entries of Home Assistant's area registry. */
  private static _areas: StrategyArea[] = [];

  /**
   * Home Assistant's Area registry.
   *
   * @remarks This module makes changes to the registry at {@link Registry.initialize}.
   *
   * @returns {StrategyArea[]} An array of strategy-specific area objects.
   */
  static get areas(): StrategyArea[] {
    return Registry._areas;
  }

  /** The Custom strategy configuration. */
  private static _strategyOptions: StrategyConfig;

  /**
   * The configuration of the strategy.
   *
   * @returns {StrategyConfig} The merged strategy configuration options.
   */
  static get strategyOptions(): StrategyConfig {
    return Registry._strategyOptions;
  }

  /**
   * Initialize this module.
   *
   * Imports the registries of Home Assistant and the strategy options.
   *
   * After importing, the registries are sanitized according to the provided strategy options.
   * This method must be called before using any other Registry functionality that depends on the imported data.
   *
   * @param {DashboardInfo} info Strategy information object.
   *
   * @returns {Promise<void>} A promise that resolves when initialization is complete.
   */
  static async initialize(info: DashboardInfo): Promise<void> {
    setupCustomLocalize(info.hass);

    // Import the Hass States and strategy options.
    Registry._hassStates = info.hass.states;
    const { ConfigurationDefaults } = await import('./configurationDefaults');

    try {
      Registry._strategyOptions = deepmerge(ConfigurationDefaults, info.config.strategy.options ?? {});
    } catch (e) {
      logMessage(lvlFatal, 'Error importing strategy options!', e);
      Registry._strategyOptions = ConfigurationDefaults;
    }

    setDebugLevel(Registry.strategyOptions.debug ? lvlFatal : lvlOff);

    // Import the registries of Home Assistant.
    await this.fetchRegistry(info);

    // Process the extra views from the strategy options.
    Registry._strategyOptions.extra_views = Registry._strategyOptions.extra_views.map((view) => ({
      ...view,
      subview: false,
    }));

    // Process entries of the HASS entity registry.
    Registry._entities = new RegistryFilter(Registry.entities)
      .not()
      .whereEntityCategory('config')
      .not()
      .whereEntityCategory('diagnostic')
      .isNotHidden()
      .whereDisabledBy(null)
      .toList()
      .map((entity) => ({ ...entity, area_id: entity.area_id ?? 'undisclosed' }));

    // Sort entities by display name.
    Registry._entities = Registry._entities.sort((a, b) => {
      const displayNameA = Registry.getDisplayName(a);
      const displayNameB = Registry.getDisplayName(b);

      return displayNameA.localeCompare(displayNameB, undefined, { numeric: true, sensitivity: 'base' });
    });

    // Process entries of the HASS device registry.
    Registry._devices = new RegistryFilter(Registry.devices)
      .isNotHidden()
      .whereDisabledBy(null)
      .orderBy(['name_by_user', 'name'], 'asc')
      .toList()
      .map((device) => ({ ...device, area_id: device.area_id ?? 'undisclosed' }));

    // Process entries of the HASS area registry.
    const areaList = [...Registry._areas];

    // Add the undisclosed area, if not hidden in the strategy options.
    if (!Registry.strategyOptions.areas.undisclosed?.hidden) {
      areaList.push(ConfigurationDefaults.areas.undisclosed);
    }

    Registry._areas = areaList.map((area) => {
      const isUndisclosed = area.area_id === 'undisclosed';

      return {
        ...area,
        ...Registry.strategyOptions.areas._, // Global defaults
        ...Registry.strategyOptions.areas[area.area_id], // Specific overrides
        ...(isUndisclosed ? { area_id: 'undisclosed', type: 'default' } : {}), // Force constraints for undisclosed
      };
    });

    // Remove hidden areas if configured as so and sort them by order first, then by name.
    Registry._areas = new RegistryFilter(Registry._areas).isNotHidden().orderBy(['order', 'name'], 'asc').toList();

    // Sort views and domains by order first and then by title.
    Registry.strategyOptions.views = Registry.sortConfigByOrder(Registry.strategyOptions.views);
    Registry.strategyOptions.domains = Registry.sortConfigByOrder(
      Registry.strategyOptions.domains as Record<string, { order?: number; title?: string }>
    ) as typeof Registry.strategyOptions.domains;

    Registry._initialized = true;
  }

  /**
   * Get a template string to define the number of a given domain's entities with a certain state.
   *
   * States are compared against a given value by a given operator.
   * States `unavailable` and `unknown` are always excluded.
   *
   * @param {string} domain The domain of the entities.
   * @param {string} operator The comparison operator between state and value.
   * @param {string} value The value to which the state is compared against.
   *
   * @returns {string} A Home Assistant template string for counting entities.
   */
  static getCountTemplate(domain: SupportedDomains, operator: string, value: string): string {
    if (!Registry.initialized) {
      logMessage(lvlWarn, 'Registry is not initialized!');

      return '?';
    }

    // Filter entities by domain while excluding stateful scenes and groups.
    const entities = new RegistryFilter(Registry.entities)
      .whereDomain(domain)
      .where((entity) => !entity.entity_id.endsWith('_stateful_scene') && entity.platform !== 'group')
      .toList();

    // Create an array of state-strings: e.g. "states['light.kitchen']".
    const states = entities.map((entity) => `states['${entity.entity_id}']`);

    // noinspection SpellCheckingInspection
    return `{% set entities = [${states}] %}
       {{ entities
          | selectattr('state','${operator}','${value}')
          | selectattr('state','ne','unavailable')
          | selectattr('state','ne','unknown')
          | list
          | count
        }}`;
  }

  /**
   * Get the names of the specified type which aren't set to hidden in the strategy options.
   *
   * @param {'domain' | 'view' | 'badge'} type The type of options to filter ("domain", "view", "badge").
   *
   * @returns {string[]} For domains and views: names of items that aren't hidden.
   *                     For badges: names of items that are explicitly set to true.
   */
  static getExposedNames(type: 'domain' | 'view' | 'badge'): string[] {
    // TODO: Align badge with other types.
    if (type === 'badge') {
      return Object.entries(Registry.strategyOptions.badges)
        .filter(([_, value]) => value === true)
        .map(([key]) => key.split('_')[0]);
    }

    const group = Registry.strategyOptions[`${type}s`] as Record<string, { hidden?: boolean }>;

    return Object.keys(group).filter((key) => key !== '_' && key !== 'default' && !group[key].hidden);
  }

  /**
   * Fetch the registries from Home Assistant.
   *
   * This method requests the entity, device, and area registries from the Home Assistant WebSocket API and populates
   * the internal registry variables.
   *
   * @param {DashboardInfo} info Strategy information object containing the Home Assistant instance.
   *
   * @throws {Error} If the Home Assistant WebSocket API call fails.
   * @returns {Promise<void>} A promise that resolves when all registries have been fetched and stored.
   */
  private static async fetchRegistry(info: DashboardInfo): Promise<void> {
    try {
      // noinspection ES6MissingAwait False positive? https://youtrack.jetbrains.com/issue/WEB-63746
      [Registry._entities, Registry._devices, Registry._areas] = await Promise.all([
        info.hass.callWS({ type: 'config/entity_registry/list' }) as Promise<EntityRegistryEntry[]>,
        info.hass.callWS({ type: 'config/device_registry/list' }) as Promise<DeviceRegistryEntry[]>,
        info.hass.callWS({ type: 'config/area_registry/list' }) as Promise<AreaRegistryEntry[]>,
      ]);
    } catch (e) {
      logMessage(lvlFatal, 'Error importing Home Assistant registries!', e);
    }
  }

  /**
   * Sorts configuration entries by order (numeric) and then by title (alphabetic).
   *
   * @template T The type of the configuration entries, extending objects with optional order and title.
   *
   * @param {Record<string, T>} config The configuration object to sort.
   *
   * @returns {Record<string, T>} A new object with sorted entries.
   */
  private static sortConfigByOrder<T extends { order?: number; title?: string }>(
    config: Record<string, T>
  ): Record<string, T> {
    return Object.fromEntries(
      Object.entries(config).sort(([, a], [, b]) => {
        const orderA = a.order ?? Infinity;
        const orderB = b.order ?? Infinity;

        return orderA - orderB || (a.title ?? '').localeCompare(b.title ?? '');
      })
    ) as Record<string, T>;
  }

  /**
   * Resolves the most appropriate display name for an entity based on a hierarchical lookup.
   *
   * The priority order is as follows:
   * 1. User-defined name in the entity registry.
   * 2. Device-linked name (combining device name and original entity name if applicable).
   * 3. Original name provided by the integration.
   * 4. A formatted version of the entity ID slug as a final fallback.
   *
   * @param {EntityRegistryEntry} entity - The entity registry entry to process.
   * @returns {string} The resolved display name.
   */
  private static getDisplayName = (entity: EntityRegistryEntry): string => {
    // 1. User defined name in registry (Manual Override)
    if (entity.name) {
      return entity.name;
    }

    // 2. Device Name Logic (When linked via has_entity_name)
    if (entity.has_entity_name && entity.device_id) {
      const device = Registry.devices.find((d) => d.id === entity.device_id);
      const deviceName = device?.name_by_user ?? device?.name;

      if (deviceName) {
        return entity.original_name ? `${deviceName} ${entity.original_name}` : deviceName;
      }
    }

    // 3. Integration defined name (When NOT linked or Device lookup failed)
    if (entity.original_name) {
      return entity.original_name;
    }

    // 4. Ultimate Fallback: The Entity ID Slug
    const slug = entity.entity_id.split('.')[1] || entity.entity_id;
    return slug.replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase());
  };
}

export { Registry };
