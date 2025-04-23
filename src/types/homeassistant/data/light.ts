/**
 * Represents the color options for a light entity in Home Assistant.
 *
 * @property {number} [color_temp_kelvin] - The color temperature in Kelvin.
 * @property {[number, number]} [hs_color] - The hue and saturation values.
 * @property {[number, number, number]} [rgb_color] - The red, green, and blue color values.
 * @property {[number, number, number, number]} [rgbw_color] - The red, green, blue, and white color values.
 * @property {[number, number, number, number, number]} [rgbww_color] - The red, green, blue, white, and warm white
 *                                                                      color values.
 */
export type LightColor =
  | { color_temp_kelvin: number }
  | { hs_color: [number, number] }
  | { rgb_color: [number, number, number] }
  | { rgbw_color: [number, number, number, number] }
  | { rgbww_color: [number, number, number, number, number] };
