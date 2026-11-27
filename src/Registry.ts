import {
  DeviceRegistryEntry,
  EntityNameItem,
  EntityRegistryEntry,
  HomeAssistant,
} from '@digilive/home-assistant-frontend-types';
import deepmerge from 'deepmerge';
import { HassEntityStates } from 'home-assistant-js-websocket';

import { CustomCardConfig } from './types/strategy/strategy-cards';
import {
  DashboardInfo,
  isSupportedDomain,
  StrategyArea,
  StrategyConfig,
  SupportedDomains,
} from './types/strategy/strategy-generics';

import { logMessage, lvlDebug, lvlFatal, lvlOff, lvlWarn, setDebugLevel } from './utilities/debug';
import setupCustomLocalize, { localize } from './utilities/localize';
import RegistryFilter from './utilities/RegistryFilter';

/**
 * Registry Class
 *
 * Contains the entries of Home Assistant's registries and Strategy configuration.
 */
class Registry {
  /** The main Home Assistant object */
  private static _hass: HomeAssistant;

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

  /** Home Assistant's State registry. */
  static get hassStates(): HassEntityStates {
    return Registry._hass.states;
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
    Registry._hass = info.hass;
    setupCustomLocalize(this._hass);

    // Import the strategy options.
    const { ConfigurationDefaults } = await import('./configurationDefaults');

    try {
      Registry._strategyOptions = deepmerge(ConfigurationDefaults, info.config.strategy.options ?? {});
    } catch (e) {
      logMessage(lvlFatal, 'Error importing strategy options!', e);
      Registry._strategyOptions = ConfigurationDefaults;
    }

    setDebugLevel(Registry.strategyOptions.debug ? lvlFatal : lvlOff);

    // Import the registries of Home Assistant.
    await this.fetchRegistry();

    // Process the extra views from the strategy options.
    Registry._strategyOptions.extra_views = Registry._strategyOptions.extra_views.map((view) => ({
      ...view,
      subview: false,
    }));

    // Process entries of the HASS entity registry.
    Registry._entities = new RegistryFilter(Registry.entities)
      .isNotHidden()
      .whereDisabledBy(null)
      .where((entity) => {
        // Filter out config and diagnostic entities if the domain has hide_config_entities or hide_diagnostic_entities enabled.
        const entityDomain = entity.entity_id.split('.', 1)[0];
        const domain = isSupportedDomain(entityDomain) ? entityDomain : 'default';

        const domainOptions = {
          ...Registry.strategyOptions.domains['_'],
          ...Registry.strategyOptions.domains[domain],
        };

        if (Registry.strategyOptions.domains.default.hidden_domains.includes(entityDomain)) {
          return false;
        }

        if (domainOptions.hide_config_entities && entity.entity_category === 'config') {
          return false;
        }

        return !(domainOptions.hide_diagnostic_entities && entity.entity_category === 'diagnostic');
      })
      .toList()
      .map((entity) => ({ ...entity, area_id: entity.area_id ?? 'undisclosed' }));

    // Sort entities by display name.
    Registry._entities = Registry._entities
      .map((entity) => ({
        entity,
        displayName: Registry.getDisplayName(entity, Registry.getCardOptions(entity).name),
      }))
      .sort((a, b) => a.displayName.localeCompare(b.displayName, undefined, { numeric: true, sensitivity: 'base' }))
      .map((item) => item.entity);

    // Process entries of the HASS device registry.
    Registry._devices = new RegistryFilter(Registry.devices)
      .isNotHidden()
      .whereDisabledBy(null)
      .orderBy(['name_by_user', 'name'], 'asc')
      .toList()
      .map((device) => ({ ...device, area_id: device.area_id ?? 'undisclosed' }));

    // Process entries of the HASS area registry.
    Registry._areas.push({
      aliases: [],
      area_id: 'undisclosed',
      created_at: 0,
      floor_id: null,
      hidden: false,
      humidity_entity_id: null,
      icon: 'mdi:floor-plan',
      labels: [],
      modified_at: 0,
      name: localize('generic.undisclosed'),
      order: Infinity,
      picture: null,
      temperature_entity_id: null,
    });

    const areaList = new RegistryFilter(Registry._areas).isNotHidden().orderBy(['name'], 'asc').toList();

    Registry._areas = areaList.map((area, index) => {
      const isUndisclosed = area.area_id === 'undisclosed';

      return {
        ...area,
        order: (index + 1) * 10,
        ...Registry.strategyOptions.areas._, // Global defaults
        ...Registry.strategyOptions.areas[area.area_id], // Specific overrides
        ...(isUndisclosed ? { area_id: 'undisclosed', type: 'default' } : {}), // Force constraints for undisclosed
      };
    });

    // Sort the areas by order first, then by name.
    Registry._areas = new RegistryFilter(Registry._areas).orderBy(['order', 'name'], 'asc').toList();

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
    return `{% set entities = [${states.toString()}] %}
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
   * Resolves the most appropriate display name for an entity based on a hierarchical lookup.
   *
   * If `formatEntityName` is available in the Home Assistant instance, it will be used to format the entity name.
   * Otherwise, it falls back to the following priority order:
   * 1. Explicit card-level name override in `card_options`.
   * 2. User-defined name in the entity registry (`entity.name`).
   * 3. The entity's friendly name from its state attributes.
   * 4. The entity's original name from the entity registry (`entity.original_name`).
   * 5. The entity identifier (`entity.entity_id`) as a last resort.
   *
   * @param {EntityRegistryEntry} entity The entity registry entry to process.
   * @param {EntityNameItem | EntityNameItem[]} [name] An optional name item or array of name items to use for formatting.
   * @returns {string} The resolved display name.
   */
  static getDisplayName = (entity: EntityRegistryEntry, name?: string | EntityNameItem | EntityNameItem[]): string => {
    const resolvedName = name ?? Registry.getCardOptions(entity).name;

    if (typeof resolvedName === 'string') {
      return resolvedName;
    }

    const stateObj = Registry.hassStates[entity.entity_id];

    if (typeof Registry._hass.formatEntityName !== 'function') {
      logMessage(lvlDebug, 'formatEntityName is not available in the Home Assistant instance.');

      if (typeof entity.name === 'string') {
        return entity.name;
      }

      return stateObj?.attributes?.friendly_name || entity.original_name || entity.entity_id;
    }

    if (!stateObj) {
      logMessage(lvlDebug, 'State object for entity_id ' + entity.entity_id + ' is not available.');

      return (typeof entity.name === 'string' ? entity.name : null) || entity.original_name || entity.entity_id;
    }

    return Registry._hass.formatEntityName(stateObj, resolvedName);
  };

  /**
   * Get the merged card options for an entity in priority order (global -> device -> entity).
   *
   * @param {EntityRegistryEntry} entity The HASS entity to resolve options for.
   * @returns {CustomCardConfig} The merged card options.
   */
  static getCardOptions(entity: EntityRegistryEntry): CustomCardConfig {
    return {
      ...Registry.strategyOptions.card_options['_'],
      ...(entity.device_id ? Registry.strategyOptions.card_options[entity.device_id] : {}),
      ...Registry.strategyOptions.card_options[entity.entity_id],
    };
  }

  /**
   * Fetch the registries from Home Assistant.
   *
   * This method requests the entity, device, and area registries from the Home Assistant WebSocket API and populates
   * the internal registry variables.
   *
   * @throws {Error} If the Home Assistant WebSocket API call fails.
   * @returns {Promise<void>} A promise that resolves when all registries have been fetched and stored.
   */
  private static async fetchRegistry(): Promise<void> {
    try {
      [Registry._entities, Registry._devices, Registry._areas] = await Promise.all([
        this._hass.callWS<EntityRegistryEntry[]>({ type: 'config/entity_registry/list' }),
        this._hass.callWS<DeviceRegistryEntry[]>({ type: 'config/device_registry/list' }),
        this._hass.callWS<StrategyArea[]>({ type: 'config/area_registry/list' }),
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

        return (
          orderA - orderB ||
          (a.title ?? '').localeCompare(b.title ?? '', undefined, { numeric: true, sensitivity: 'base' })
        );
      })
    );
  }
}

export { Registry };
