import { RegistryEntry } from './registry';

/**
 * Represents a floor entry in the Floor Registry of Home Assistant.
 *
 * @property {string} floor_id - The unique identifier for the floor.
 * @property {string} name - The name of the floor.
 * @property {number | null} level - The level of the floor (optional).
 * @property {string | null} icon - The icon associated with the floor (optional).
 * @property {string[]} aliases - An array of aliases for the floor.
 */
export interface FloorRegistryEntry extends RegistryEntry {
  floor_id: string;
  name: string;
  level: number | null;
  icon: string | null;
  aliases: string[];
}
