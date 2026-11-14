import { Registry } from '../Registry';
import { LovelaceCardConfig } from '../types/homeassistant/data/lovelace/config/card';
import { AbstractCardConfig } from '../types/strategy/strategy-cards';
import { isEntityRegistryEntry, isSupportedDomain, RegistryEntry } from '../types/strategy/strategy-generics';
import { logMessage, lvlFatal } from '../utilities/debug';

/**
 * Abstract Card Class
 *
 * To create a card configuration, this class should be extended by a child class.
 * Child classes should override the default configuration so the card correctly reflects the entity.
 *
 * @remarks
 * Before using this class, the Registry module must be initialized by calling {@link Registry.initialize}.
 */
abstract class AbstractCard {
  /** The registry entry this card represents. */
  readonly entity: RegistryEntry;

  /**
   * The card configuration for this entity.
   *
   * Child classes should override this property to reflect their own card type and options.
   */
  protected configuration: LovelaceCardConfig = {
    type: 'custom:mushroom-entity-card',
    icon: 'mdi:help-circle',
  };

  /**
   * Class constructor.
   *
   * @param {RegistryEntry} entity The registry entry to create a card configuration for.
   *
   * @remarks
   * Before this class can be used, the Registry module must be initialized by calling {@link Registry.initialize}.
   */
  protected constructor(entity: RegistryEntry) {
    if (!Registry.initialized) {
      logMessage(lvlFatal, 'Registry is not initialized!');
    }

    this.entity = entity;
  }

  /**
   * Get a card configuration.
   *
   * The configuration should be set by any of the child classes so the card correctly reflects an entity.
   */
  getCard(): AbstractCardConfig {
    // Set the card visibility based on the entity's availability.
    if (isEntityRegistryEntry(this.entity)) {
      const entityDomain = this.entity.entity_id.split('.', 1)[0] ?? '';
      const domain = isSupportedDomain(entityDomain) ? entityDomain : 'default';
      const domainOptions = {
        ...Registry.strategyOptions.domains['_'],
        ...Registry.strategyOptions.domains[domain],
      };

      // Show only the entity name (without the device name) unless the card already defines its own name.
      // The entity's own name is the name set by the user, or else the name provided by the integration
      // (`original_name_unprefixed` when available, otherwise `original_name`).
      // When the entity has none of these, the default name (device name) is kept.
      // Mushroom cards understand a name object, mini-graph-card only takes a plain string.
      // Other card types (stacks, picture-entity, area...) are left untouched.
      const entityName = this.entity.name || this.entity.original_name_unprefixed || this.entity.original_name;

      if (domainOptions.entity_names_only && this.configuration.name === undefined && entityName) {
        const cardType = String(this.configuration.type ?? '');

        if (cardType.startsWith('custom:mushroom-')) {
          this.configuration.name = { type: 'entity' };
        } else if (cardType === 'custom:mini-graph-card') {
          this.configuration.name = entityName;
        }
      }

      if (domainOptions.hide_unavailable_entities) {
        this.configuration.visibility = [
          {
            condition: 'state',
            state_not: 'unavailable',
          },
        ];
      }
    }

    return {
      ...this.configuration,
      entity: 'entity_id' in this.entity ? this.entity.entity_id : undefined,
    };
  }
}

export default AbstractCard;
