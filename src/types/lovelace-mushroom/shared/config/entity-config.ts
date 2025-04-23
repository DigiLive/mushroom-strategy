import { Infer, object, optional, string } from 'superstruct';

/**
 * Schema for validating the shared entity configuration of Mushroom cards.
 *
 * Properties:
 * - `entity`: Optional entity ID to associate with the card.
 * - `name`: Optional custom name to display for the entity.
 * - `icon`: Optional custom icon to display for the entity.
 */
export const entitySharedConfigStruct = object({
  entity: optional(string()),
  name: optional(string()),
  icon: optional(string()),
});

/**
 * Entity Shared Configuration
 *
 * @type EntitySharedConfig
 * @property {string} [entity] - The entity ID associated with the configuration.
 * @property {string} [name] - The display name for the entity.
 * @property {string} [icon] - The icon to display for the entity.
 */
export type EntitySharedConfig = Infer<typeof entitySharedConfigStruct>;
