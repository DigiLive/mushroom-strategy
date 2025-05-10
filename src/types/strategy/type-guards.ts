import { DeviceRegistryEntry } from '../homeassistant/data/device_registry';
import { RegistryEntry, Sortable } from './strategy-generics';
import { AreaRegistryEntry } from '../homeassistant/data/area_registry';
import { ActionConfig, CallServiceActionConfig } from '../homeassistant/data/lovelace/config/action';

/**
 * Type guard to check if the given object is a DeviceRegistryEntry.
 *
 * @param [object] - The object to check.
 * @returns True if the object is a DeviceRegistryEntry, false otherwise.
 */
export function isDeviceRegistryEntry(object?: RegistryEntry): object is DeviceRegistryEntry {
  return !!object && 'id' in object && 'model' in object;
}

/**
 * Type guard to check if the given object is an AreaRegistryEntry.
 *
 * @param [object] - The object to check.
 * @returns True if the object is a AreaRegistryEntry, false otherwise.
 */
export function isAreaRegistryEntry(object?: RegistryEntry): object is AreaRegistryEntry {
  return !!object && 'area_id' in object;
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
