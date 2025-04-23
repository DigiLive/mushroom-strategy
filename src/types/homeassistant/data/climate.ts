/** Represents the available HVAC modes for climate control in Home Assistant. */
export const HVAC_MODES = ['auto', 'heat_cool', 'heat', 'cool', 'dry', 'fan_only', 'off'] as const;

/** Represents a type for HVAC modes in Home Assistant. */
export type HvacMode = (typeof HVAC_MODES)[number];
