/**
 * Represents the layout options for Lovelace in Home Assistant.
 *
 * @property {number | "full"} [grid_columns] - The number of grid columns or "full".
 * @property {number | "auto"} [grid_rows] - The number of grid rows or "auto".
 * @property {number} [grid_max_columns] - The maximum number of grid columns.
 * @property {number} [grid_min_columns] - The minimum number of grid columns.
 * @property {number} [grid_min_rows] - The minimum number of grid rows.
 * @property {number} [grid_max_rows] - The maximum number of grid rows.
 */
export interface LovelaceLayoutOptions {
  grid_columns?: number | 'full';
  grid_rows?: number | 'auto';
  grid_max_columns?: number;
  grid_min_columns?: number;
  grid_min_rows?: number;
  grid_max_rows?: number;
}

/**
 * Represents the grid options for Lovelace in Home Assistant.
 *
 * @property {number | "full"} [columns] - The number of columns or "full".
 * @property {number | "auto"} [rows] - The number of rows or "auto".
 * @property {number} [max_columns] - The maximum number of columns.
 * @property {number} [min_columns] - The minimum number of columns.
 * @property {number} [min_rows] - The minimum number of rows.
 * @property {number} [max_rows] - The maximum number of rows.
 */
export interface LovelaceGridOptions {
  columns?: number | 'full';
  rows?: number | 'auto';
  max_columns?: number;
  min_columns?: number;
  min_rows?: number;
  max_rows?: number;
}
