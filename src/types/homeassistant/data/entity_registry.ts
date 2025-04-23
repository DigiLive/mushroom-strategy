import { LightColor } from './light';

export type EntityCategory = 'config' | 'diagnostic';

/**
 * Represents the display entry for an entity in the entity registry.
 *
 * @property {string} entity_id - The unique identifier for the entity.
 * @property {string} [name] - The name of the entity.
 * @property {string} [icon] - The icon associated with the entity.
 * @property {string} [device_id] - The ID of the device linked to this entity.
 * @property {string} [area_id] - The ID of the area linked to this entity.
 * @property {string[]} labels - Labels associated with the entity.
 * @property {boolean} [hidden] - Indicates if the entity is hidden.
 * @property {EntityCategory} [entity_category] - The category of the entity.
 * @property {string} [translation_key] - The translation key for the entity.
 * @property {string} [platform] - The platform of the entity.
 * @property {number} [display_precision] - The display precision for the entity.
 * @property {boolean} [has_entity_name] - Indicates if the entity has a name.
 */
export interface EntityRegistryDisplayEntry {
  entity_id: string;
  name?: string;
  icon?: string;
  device_id?: string;
  area_id?: string;
  labels: string[];
  hidden?: boolean;
  entity_category?: EntityCategory;
  translation_key?: string;
  platform?: string;
  display_precision?: number;
  has_entity_name?: boolean;
}

/**
 * Represents an entity in the entity registry of Home Assistant.
 *
 * @property {string} id - The unique identifier for the entity.
 * @property {string} entity_id - The ID of the entity.
 * @property {string | null} name - The name of the entity.
 * @property {string | null} icon - The icon associated with the entity.
 * @property {string | null} platform - The platform of the entity.
 * @property {string | null} config_entry_id - The ID of the config entry associated with the entity.
 * @property {string | null} config_subentry_id - The ID of the config subentry associated with the entity.
 * @property {string | null} device_id - The ID of the device linked to this entity.
 * @property {string | null} area_id - The ID of the area linked to this entity.
 * @property {string[]} labels - Labels associated with the entity.
 * @property {"user" | "device" | "integration" | "config_entry" | null} disabled_by - Indicates what disabled this
 *                                                                                     entity.
 * @property {Exclude<EntityRegistryEntry["disabled_by"], "config_entry">} hidden_by - Indicates what hidden this
 *                                                                                     entity.
 * @property {EntityCategory | null} entity_category - The category of the entity.
 * @property {boolean} has_entity_name - Indicates if the entity has a name.
 * @property {string} [original_name] - The original name of the entity.
 * @property {string} unique_id - The unique identifier for the entity.
 * @property {string} [translation_key] - The translation key for the entity.
 * @property {EntityRegistryOptions | null} options - Additional options for the entity.
 * @property {Record<string, string>} categories - Categories associated with the entity.
 */
export interface EntityRegistryEntry {
  id: string;
  entity_id: string;
  name: string | null;
  icon: string | null;
  platform: string | null;
  config_entry_id: string | null;
  config_subentry_id: string | null;
  device_id: string | null;
  area_id: string | null;
  labels: string[];
  disabled_by: 'user' | 'device' | 'integration' | 'config_entry' | null;
  hidden_by: Exclude<EntityRegistryEntry['disabled_by'], 'config_entry'>;
  entity_category: EntityCategory | null;
  has_entity_name: boolean;
  original_name?: string;
  unique_id: string;
  translation_key?: string;
  options: EntityRegistryOptions | null;
  categories: Record<string, string>;
}

/**
 * Represents options for a sensor entity in Home Assistant.
 *
 * @property {number | null} [display_precision] - The display precision for the sensor.
 * @property {number | null} [suggested_display_precision] - Suggested display precision for the sensor.
 * @property {string | null} [unit_of_measurement] - The unit of measurement for the sensor.
 */
export interface SensorEntityOptions {
  display_precision?: number | null;
  suggested_display_precision?: number | null;
  unit_of_measurement?: string | null;
}

/**
 * Represents options for a light entity in Home Assistant.
 *
 * @property {LightColor[]} [favorite_colors] - An array of favorite colors for the light.
 */
export interface LightEntityOptions {
  favorite_colors?: LightColor[];
}

/**
 * Represents options for a number entity in Home Assistant.
 *
 * @property {string | null} [unit_of_measurement] - The unit of measurement for the number.
 */
export interface NumberEntityOptions {
  unit_of_measurement?: string | null;
}

/**
 * Represents options for a lock entity in Home Assistant.
 *
 * @property {string | null} [default_code] - The default code for the lock.
 */
export interface LockEntityOptions {
  default_code?: string | null;
}

/**
 * Represents options for an alarm control panel entity in Home Assistant.
 *
 * @property {string | null} [default_code] - The default code for the alarm control panel.
 */
export interface AlarmControlPanelEntityOptions {
  default_code?: string | null;
}

/**
 * Represents options for a weather entity in Home Assistant.
 *
 * @property {string | null} [precipitation_unit] - The unit of measurement for precipitation.
 * @property {string | null} [pressure_unit] - The unit of measurement for pressure.
 * @property {string | null} [temperature_unit] - The unit of measurement for temperature.
 * @property {string | null} [visibility_unit] - The unit of measurement for visibility.
 * @property {string | null} [wind_speed_unit] - The unit of measurement for wind speed.
 */
export interface WeatherEntityOptions {
  precipitation_unit?: string | null;
  pressure_unit?: string | null;
  temperature_unit?: string | null;
  visibility_unit?: string | null;
  wind_speed_unit?: string | null;
}

/**
 * Represents options for a switch entity in Home Assistant.
 *
 * @property {string} entity_id - The ID of the entity.
 * @property {boolean} invert - Indicates if the switch should be inverted.
 */
export interface SwitchAsXEntityOptions {
  entity_id: string;
  invert: boolean;
}

/**
 * Represents options for an entity in the entity registry of Home Assistant.
 *
 * @property {NumberEntityOptions} [number] - Options for number entities.
 * @property {SensorEntityOptions} [sensor] - Options for sensor entities.
 * @property {AlarmControlPanelEntityOptions} [alarm_control_panel] - Options for alarm control panel entities.
 * @property {LockEntityOptions} [lock] - Options for lock entities.
 * @property {WeatherEntityOptions} [weather] - Options for weather entities.
 * @property {LightEntityOptions} [light] - Options for light entities.
 * @property {SwitchAsXEntityOptions} [switch_as_x] - Options for switch entities.
 * @property {Record<string, unknown>} [conversation] - Options for conversation entities.
 * @property {Record<string, unknown>} ["cloud.alexa"] - Options for Alexa cloud integration.
 * @property {Record<string, unknown>} ["cloud.google_assistant"] - Options for Google Assistant cloud integration.
 */
export interface EntityRegistryOptions {
  number?: NumberEntityOptions;
  sensor?: SensorEntityOptions;
  alarm_control_panel?: AlarmControlPanelEntityOptions;
  lock?: LockEntityOptions;
  weather?: WeatherEntityOptions;
  light?: LightEntityOptions;
  switch_as_x?: SwitchAsXEntityOptions;
  conversation?: Record<string, unknown>;
  'cloud.alexa'?: Record<string, unknown>;
  'cloud.google_assistant'?: Record<string, unknown>;
}
