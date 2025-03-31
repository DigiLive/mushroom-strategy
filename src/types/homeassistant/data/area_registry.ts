import {RegistryEntry} from "./registry";

/**
 * Entry in the Area Registry.
 *
 * @property {string[]} aliases Array of aliases of the area.
 * @property {string} area_id The id of the area.
 * @property {string|null} floor_id The id of the area's floor.
 * @property {string|null} humidity_entity_id The id of the area's humidity sensor.
 * @property {string|null} icon Icon to show.
 * @property {string[]} labels Labels allow grouping elements irrespective of their physical location or type.
 * @property {string} name Name of the area.
 * @property {string|null} picture URL to a picture that should be used instead of showing the domain icon.
 * @property {string|null} temperature_entity_id The id of the area's temperature sensor.
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
