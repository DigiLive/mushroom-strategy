import AbstractBadge from '../../badges/AbstractBadge';

/**
 * Interface for badge constructors used in dynamic imports.
 *
 * This interface defines the constructor signature for all badge classes
 * that extend AbstractBadge, allowing proper typing of dynamic imports.
 */
export interface BadgeConstructor {
  new (): AbstractBadge;
}
