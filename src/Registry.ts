import deepmerge from 'deepmerge';
import { HassEntities } from 'home-assistant-js-websocket';
import { AreaRegistryEntry } from './types/homeassistant/data/area_registry';
import { DeviceRegistryEntry } from './types/homeassistant/data/device_registry';
import { EntityRegistryEntry } from './types/homeassistant/data/entity_registry';
import {
  AllDomainsConfig,
  DashboardInfo,
  SingleDomainConfig,
  StrategyArea,
  StrategyConfig,
  StrategyViewConfig,
  SupportedDomains,
  SupportedViews,
} from './types/strategy/strategy-generics';
import { logMessage, lvlFatal, lvlOff, setDebugLevel } from './utilities/debug';
import setupCustomLocalize from './utilities/localize';
import RegistryFilter from './utilities/RegistryFilter';
import { getObjectKeysByPropertyValue } from './utilities/auxiliaries';
import { ConfigEntry } from './types/homeassistant/data/config_entries';
import { isSortable } from './types/strategy/type-guards';

/**
 * Registry Class
 *
 * Contains the entries of Home Assistant's registries and Strategy configuration.
 */
class Registry {
  /** Indicates whether dark mode is enabled */
  static darkMode: boolean;

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
  /** Entries of Home Assistant's state registry */
  private static _hassStates: HassEntities;
  /** Indicates whether this module is initialized. */
  private static _initialized: boolean = false;

  /**
   * Home Assistant's Device registry.
   *
   * @remarks
   * This module makes changes to the registry at {@link Registry.initialize}.
   */
  static get devices() {
    return Registry._devices;
  }

  /** Entries of Home Assistant's entity registry. */
  private static _entities: EntityRegistryEntry[];

  /**
   * Home Assistant's Entity registry.
   *
   * @remarks
   * This module makes changes to the registry at {@link Registry.initialize}.
   */
  static get entities() {
    return Registry._entities;
  }

  /** Entries of Home Assistant's area registry. */
  private static _areas: StrategyArea[] = [];

  /** Home Assistant's State registry. */
  static get hassStates() {
    return Registry._hassStates;
  }

  /**
   * Home Assistant's Area registry.
   *
   * @remarks
   * This module makes changes to the registry at {@link Registry.initialize}.
   */
  static get areas() {
    return Registry._areas;
  }

  /** Entries of Home Assistant's config registry */
  private static _configEntries: ConfigEntry[] = [];

  /**
   * Home Assistant's Config Entries.
   */
  static get configEntries() {
    return Registry._configEntries;
  }

  /** The Custom strategy configuration. */
  private static _strategyOptions: StrategyConfig;

  /** The configuration of the strategy. */
  static get strategyOptions() {
    return Registry._strategyOptions;
  }

  /** Get the initialization status of the Registry class. */
  static get initialized() {
    return Registry._initialized;
  }

  private static _groupingDeviceIds: Set<string>;

  /** Get the initialization status of the Registry class. */
  static get groupingDeviceIds() {
    return Registry._groupingDeviceIds;
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
   */
  static async initialize(info: DashboardInfo): Promise<void> {
    setupCustomLocalize(info.hass);
    Registry.darkMode = info.hass.themes.darkMode;

    // Import the Hass States and strategy options.
    Registry._hassStates = info.hass.states;
    const { ConfigurationDefaults } = await import('./configurationDefaults');

    try {
      Registry._strategyOptions = deepmerge(ConfigurationDefaults, info.config?.strategy?.options ?? {});
    } catch (e) {
      logMessage(lvlFatal, 'Error importing strategy options!', e);
    }

    setDebugLevel(Registry.strategyOptions.debug ? lvlFatal : lvlOff);

    // Import the registries of Home Assistant.
    try {
      // noinspection ES6MissingAwait False positive? https://youtrack.jetbrains.com/issue/WEB-63746
      [Registry._entities, Registry._devices, Registry._areas, Registry._configEntries] = await Promise.all([
        info.hass.callWS({ type: 'config/entity_registry/list' }) as Promise<EntityRegistryEntry[]>,
        info.hass.callWS({ type: 'config/device_registry/list' }) as Promise<DeviceRegistryEntry[]>,
        info.hass.callWS({ type: 'config/area_registry/list' }) as Promise<AreaRegistryEntry[]>,
        info.hass.callWS({ type: 'config_entries/get' }) as Promise<ConfigEntry[]>,
      ]);
    } catch (e) {
      logMessage(lvlFatal, 'Error importing Home Assistant registries!', e);
    }

    // Process the entries of the Strategy Options.
    Registry._strategyOptions.extra_views.map((view) => ({
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
      .orderBy(['name', 'original_name'])
      .toList();

    Registry._entities = Registry.entities.map((entity) => ({
      ...entity,
      area_id: entity.area_id ?? 'undisclosed',
    }));

    // Process entries of the HASS device registry.
    Registry._devices = new RegistryFilter(Registry.devices)
      .isNotHidden()
      .whereDisabledBy(null)
      .orderBy(['name_by_user', 'name'])
      .toList();

    Registry._devices = Registry.devices.map((device) => ({
      ...device,
      area_id: device.area_id ?? 'undisclosed',
    }));

    // Process entries of the HASS area registry.
    if (Registry.strategyOptions.areas._.hidden) {
      Registry._areas = [];
    } else {
      // Create and add the undisclosed area if not hidden in the strategy options.
      if (!Registry.strategyOptions.areas.undisclosed?.hidden) {
        Registry._areas.push(ConfigurationDefaults.areas.undisclosed);
      }

      // Merge area configurations of the Strategy options into the entries of the area registry.
      // TODO: Check for to do the same for devices.
      Registry._areas = Registry.areas.map((area) => {
        return { ...area, ...Registry.strategyOptions.areas['_'], ...Registry.strategyOptions.areas?.[area.area_id] };
      });

      // Ensure the custom configuration of the undisclosed area doesn't overwrite the required property values.
      Registry._strategyOptions.areas.undisclosed.area_id = 'undisclosed';
      Registry.strategyOptions.areas.undisclosed.type = 'default';

      // Remove hidden areas if configured as so and sort them by name.

      Registry._areas = new RegistryFilter(Registry.areas).isNotHidden().orderBy(['order', 'name']).toList();
    }

    // Sort views by order first and then by title.
    const sortViews = () => {
      const entries = Object.entries(Registry.strategyOptions.views);

      Registry._strategyOptions.views = Object.fromEntries(
        entries.sort(([_, a], [__, b]) => {
          return (a.order ?? Infinity) - (b.order ?? Infinity) || (a.title ?? '').localeCompare(b.title ?? '');
        }),
      ) as Record<SupportedViews, StrategyViewConfig>;
    };

    sortViews();

    // Sort domains by order first and then by title.
    const sortDomains = () => {
      const entries = Object.entries(Registry.strategyOptions.domains);

      Registry._strategyOptions.domains = Object.fromEntries(
        entries.sort(([, a], [, b]) => {
          if (isSortable(a) && isSortable(b)) {
            return (a.order ?? Infinity) - (b.order ?? Infinity) || (a.title ?? '').localeCompare(b.title ?? '');
          }

          return 0; // Maintain the original order when none or only one item is sortable.
        }),
      ) as { [K in SupportedDomains]: K extends '_' ? AllDomainsConfig : SingleDomainConfig };
    };

    sortDomains();

    // Sort extra views by order first and then by title.
    // TODO: Add sorting to the wiki.
    const sortExtraViews = () => {
      Registry._strategyOptions.extra_views.sort((a, b) => {
        return (a.order ?? Infinity) - (b.order ?? Infinity) || (a.title ?? '').localeCompare(b.title ?? '');
      });
    };

    sortExtraViews();

    // Process grouping by device.
    this._groupingDeviceIds = new Set(
      Registry.devices
        .filter(
          (device) =>
            Registry.strategyOptions.device_options['_'].group_entities ||
            getObjectKeysByPropertyValue(Registry.strategyOptions.device_options, 'group_entities', true).includes(
              device.id,
            ),
        )
        .map((device) => device.id),
    );

    Registry._initialized = true;
  }

  /**
   * Get a template string to define the number of a given domain's entities with a certain state.
   *
   * States are compared against a given value by a given operator.
   *
   * @param {string} domain The domain of the entities.
   * @param {string} operator The comparison operator between state and value.
   * @param {string} value The value to which the state is compared against.
   *
   * @remarks
   * - States `unavailable` and `unknown` are always excluded.
   * - States with a defined `entity_id` are always excluded.
   *   Most probably they represent a group of "child" states.
   */
  static getCountTemplate(domain: SupportedDomains, operator: string, value: string): string {
    return `
      {{ states.${domain}
        | rejectattr('attributes.entity_id', 'defined')
        | rejectattr('state', 'in', ['unavailable', 'unknown'])
        | selectattr('state', '${operator}', '${value}')
        | list
        | count
      }}`;
  }

  /**
   * Get the names of the specified type which aren't set to hidden in the strategy options.
   *
   * @param {string} type The type of options to filter ("domain", "view", "chip").
   *
   * @returns {Set<string>} For domains and views: names of items that aren't hidden.
   *                     For chips: names of items that are explicitly set to true.
   */
  static getExposedNames(type: 'domain' | 'view' | 'chip'): Set<string> {
    // TODO: Align chip with other types.
    if (type === 'chip') {
      const keySet = new Set<string>();

      Object.entries(Registry.strategyOptions.chips)
        .filter(([_, value]) => value === true)
        .forEach(([key]) => {
          keySet.add(key.split('_')[0]);
        });

      return keySet;
    }

    const typeOptions = Registry.strategyOptions[`${type}s`] as Record<string, { hidden?: boolean }>;

    const keySet = new Set<string>();

    Object.keys(typeOptions).forEach((key) => {
      if (key !== '_' && key !== 'default' && !typeOptions[key].hidden) {
        keySet.add(key);
      }
    });

    return keySet;
  }
}

export { Registry };
