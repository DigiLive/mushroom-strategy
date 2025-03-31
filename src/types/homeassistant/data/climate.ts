export const HVAC_MODES = [
  "auto",
  "heat_cool",
  "heat",
  "cool",
  "dry",
  "fan_only",
  "off",
] as const;

export type HvacMode = (typeof HVAC_MODES)[number];
