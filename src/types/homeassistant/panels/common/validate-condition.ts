/** Represents a condition in Home Assistant. */
export type Condition =
  | NumericStateCondition
  | StateCondition
  | ScreenCondition
  | UserCondition
  | OrCondition
  | AndCondition;

/**
 * Base interface for all conditions in Home Assistant.
 *
 * @property {string} condition - The type of condition.
 */
interface BaseCondition {
  condition: string;
}

/**
 * Represents a numeric state condition in Home Assistant.
 *
 * @property {'numeric_state'} condition - The condition type.
 * @property {string} [entity] - The entity to evaluate.
 * @property {string | number} [below] - The threshold value below which the condition is true.
 * @property {string | number} [above] - The threshold value above which the condition is true.
 */
export interface NumericStateCondition extends BaseCondition {
  condition: 'numeric_state';
  entity?: string;
  below?: string | number;
  above?: string | number;
}

/**
 * Represents a state condition in Home Assistant.
 *
 * @property {'state'} condition - The condition type.
 * @property {string} [entity] - The entity to evaluate.
 * @property {string | string[]} [state] - The expected state of the entity.
 * @property {string | string[]} [state_not] - The state that the entity should not be in.
 */
export interface StateCondition extends BaseCondition {
  condition: 'state';
  entity?: string;
  state?: string | string[];
  state_not?: string | string[];
}

/**
 * Represents a screen condition in Home Assistant.
 *
 * @property {'screen'} condition - The condition type.
 * @property {string} [media_query] - The media query for screen conditions.
 */
export interface ScreenCondition extends BaseCondition {
  condition: 'screen';
  media_query?: string;
}

/**
 * Represents a user condition in Home Assistant.
 *
 * @property {'user'} condition - The condition type.
 * @property {string[]} [users] - The list of users for the condition.
 */
export interface UserCondition extends BaseCondition {
  condition: 'user';
  users?: string[];
}

/**
 * Represents an OR condition in Home Assistant.
 *
 * @property {'or'} condition - The condition type.
 * @property {Condition[]} [conditions] - The list of conditions to evaluate.
 */
export interface OrCondition extends BaseCondition {
  condition: 'or';
  conditions?: Condition[];
}

/**
 * Represents an AND condition in Home Assistant.
 *
 * @property {'and'} condition - The condition type.
 * @property {Condition[]} [conditions] - The list of conditions to evaluate.
 */
export interface AndCondition extends BaseCondition {
  condition: 'and';
  conditions?: Condition[];
}
