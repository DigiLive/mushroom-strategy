import { boolean, enums, Infer, object, optional } from 'superstruct';
import { ICON_TYPES, INFOS } from './utils/info';
import { layoutStruct } from './utils/layout';

/**
 * Schema for validating the shared appearance configuration of Mushroom cards.
 *
 * Properties:
 * - `layout`: Optional layout configuration (see `layoutStruct`).
 * - `fill_container`: Optional boolean indicating whether the card should fill its container.
 * - `primary_info`: Optional primary information to display (must be one of `INFOS`).
 * - `secondary_info`: Optional secondary information to display (must be one of `INFOS`).
 * - `icon_type`: Optional icon type to use (must be one of `ICON_TYPES`).
 */
export const appearanceSharedConfigStruct = object({
  layout: optional(layoutStruct),
  fill_container: optional(boolean()),
  primary_info: optional(enums(INFOS)),
  secondary_info: optional(enums(INFOS)),
  icon_type: optional(enums(ICON_TYPES)),
});

/**
 * Appearance Shared Configuration
 *
 * @property {string} [layout] - Layout type (horizontal, vertical, default).
 * @property {boolean} [fill_container] - Whether to fill the container.
 * @property {string} [primary_info] - Primary information to display.
 * @property {string} [secondary_info] - Secondary information to display.
 * @property {string} [icon_type] - Type of icon to display.
 */
export type AppearanceSharedConfig = Infer<typeof appearanceSharedConfigStruct>;
