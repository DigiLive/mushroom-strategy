/**
 * Represents a registry entry in Home Assistant.
 *
 * @property {number} created_at - The timestamp when the entry was created.
 * @property {number} modified_at - The timestamp when the entry was last modified.
 */
export interface RegistryEntry {
  created_at: number;
  modified_at: number;
}
