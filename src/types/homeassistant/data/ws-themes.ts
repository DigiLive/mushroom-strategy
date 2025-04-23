/**
 * Represents the variables for a theme in Home Assistant.
 *
 * @property {string} primary-color - The primary color of the theme.
 * @property {string} text-primary-color - The primary text color of the theme.
 * @property {string} accent-color - The accent color of the theme.
 * @property {string} [key] - Additional theme variables as key-value pairs.
 */
export interface ThemeVars {
  // Incomplete
  'primary-color': string;
  'text-primary-color': string;
  'accent-color': string;

  [key: string]: string;
}

/**
 * Represents a theme configuration in Home Assistant.
 *
 * @property {ThemeVars} modes.light - The light mode variables.
 * @property {ThemeVars} modes.dark - The dark mode variables.
 */
export type Theme = ThemeVars & {
  modes?: {
    light?: ThemeVars;
    dark?: ThemeVars;
  };
};

/**
 * Represents the overall themes configuration in Home Assistant.
 *
 * @property {string} default_theme - The default theme name.
 * @property {string | null} default_dark_theme - The default dark theme name or null.
 * @property {Record<string, Theme>} themes - A record of available themes.
 * @property {boolean} darkMode - Currently effective dark mode.
 *                                It Will never be undefined.
 *                                If the user selected "auto" in the theme picker, this property will still contain
 *                                either true or false based on what has been determined via system preferences and
 *                                support for the selected theme.
 * @property {string} theme - Currently globally active theme name
 */
export interface Themes {
  default_theme: string;
  default_dark_theme: string | null;
  themes: Record<string, Theme>;
  darkMode: boolean;
  theme: string;
}
