import { RegistryEntry } from './registry';

/**
 * Represents an entry in the Area Registry in Home Assistant.
 *
 * @property {string[]} aliases - An array of aliases for the area.
 * @property {string} area_id - The unique identifier for the area.
 * @property {string|null} floor_id - The identifier for the area's floor, or null if not applicable.
 * @property {string|null} humidity_entity_id - The identifier for the area's humidity sensor, or null if not
 *                                              applicable.
 * @property {string|null} icon - The icon to display for the area, or null if not specified.
 * @property {string[]} labels - Labels for grouping elements irrespective of their physical location or type.
 * @property {string} name - The name of the area.
 * @property {string|null} picture - The URL to a picture that should be used instead of the domain icon, or null if
 *                                   not specified.
 * @property {string|null} temperature_entity_id - The identifier for the area's temperature sensor, or null if not
 *                                                 applicable.
 */
export interface AreaRegistryEntry extends RegistryEntry {
  aliases: string[];
  area_id: string;
  floor_id: string | null;
  humidity_entity_id: string | null;
  icon: string | null;
  labels: string[];
  name: string;
  picture: string | null;
  temperature_entity_id: string | null;
}
