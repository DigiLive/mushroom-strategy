import { DeviceRegistryEntry } from '../homeassistant/data/device_registry';
import { RegistryEntry } from './strategy-generics';
import { AreaRegistryEntry } from '../homeassistant/data/area_registry';

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
