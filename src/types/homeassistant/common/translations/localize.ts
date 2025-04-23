import type { TranslationDict } from '../../types';

// Exclude some patterns from key type checking for now
// These are intended to be removed as errors are fixed
// Fixing component category will require tighter definition of types from backend and/or web socket
export type LocalizeKeys =
  | FlattenObjectKeys<Omit<TranslationDict, 'supervisor'>>
  | `panel.${string}`
  | `ui.card.alarm_control_panel.${string}`
  | `ui.card.weather.attributes.${string}`
  | `ui.card.weather.cardinal_direction.${string}`
  | `ui.card.lawn_mower.actions.${string}`
  | `ui.components.calendar.event.rrule.${string}`
  | `ui.components.selectors.file.${string}`
  | `ui.components.logbook.messages.detected_device_classes.${string}`
  | `ui.components.logbook.messages.cleared_device_classes.${string}`
  | `ui.dialogs.entity_registry.editor.${string}`
  | `ui.dialogs.more_info_control.lawn_mower.${string}`
  | `ui.dialogs.more_info_control.vacuum.${string}`
  | `ui.dialogs.quick-bar.commands.${string}`
  | `ui.dialogs.unhealthy.reason.${string}`
  | `ui.dialogs.unsupported.reason.${string}`
  | `ui.panel.config.${string}.${'caption' | 'description'}`
  | `ui.panel.config.dashboard.${string}`
  | `ui.panel.config.zha.${string}`
  | `ui.panel.config.zwave_js.${string}`
  | `ui.panel.lovelace.card.${string}`
  | `ui.panel.lovelace.editor.${string}`
  | `ui.panel.page-authorize.form.${string}`
  | `component.${string}`;

// Tweaked from https://www.raygesualdo.com/posts/flattening-object-keys-with-typescript-types
export type FlattenObjectKeys<T extends Record<string, any>, Key extends keyof T = keyof T> = Key extends string
  ? T[Key] extends Record<string, unknown>
    ? `${Key}.${FlattenObjectKeys<T[Key]>}`
    : `${Key}`
  : never;

// Later, don't return string when HTML is passed, and don't allow undefined
export type LocalizeFunc<Keys extends string = LocalizeKeys> = (
  key: Keys,
  values?: Record<
    string,
    string | number | { _$litType$: 1; strings: TemplateStringsArray; values: Array<unknown> } | null | undefined
  >,
) => string;
