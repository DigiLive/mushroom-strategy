import { CustomCardConfig, StrategyCardConfig } from '../types/strategy/strategy-cards';
import { isEntityRegistryEntry, isSupportedDomain, RegistryEntry } from '../types/strategy/strategy-generics';

import { logMessage, lvlFatal } from '../utilities/debug';

import { Registry } from '../Registry';

/**
 * Abstract Card Class
 *
 * To create a card configuration, this class should be extended by a child class.
 * Child classes should provide their default configuration so the card correctly reflects the entity.
 *
 * @remarks
 * Before using this class, the Registry module must be initialized by calling {@link Registry.initialize}.
 */
export default abstract class AbstractCard<TConfig extends StrategyCardConfig = StrategyCardConfig> {
  /** The registry entry this card represents. */
  protected readonly entity: RegistryEntry;

  /**
   * The card configuration for this entity.
   *
   * Child classes provide their own defaults via {@link getDefaultConfig} and can adjust
   * this configuration as needed.
   */
  protected configuration: Partial<TConfig>;

  /**
   * Class constructor.
   *
   * @template TConfig The type of the card configuration.
   * @param {RegistryEntry} entity The registry entry to create a card configuration for.
   * @param {CustomCardConfig<TConfig>} [customConfiguration] Custom card configuration overrides.
   *
   * @remarks
   * Before this class can be used, the Registry module must be initialized by calling {@link Registry.initialize}.
   */
  protected constructor(entity: RegistryEntry, customConfiguration?: CustomCardConfig<TConfig>) {
    if (!Registry.initialized) {
      logMessage(lvlFatal, 'Registry is not initialized!');
    }

    this.entity = entity;

    const baseDefaultConfig = {
      type: 'custom:mushroom-entity-card',
      icon: 'mdi:help-circle',
    } as Partial<TConfig>;

    const { hidden: _hidden, ...customCardConfig } = customConfiguration ?? {};

    this.configuration = {
      ...baseDefaultConfig,
      ...this.getDefaultConfig(),
      ...customCardConfig,
    };
  }

  /**
   * Get a card configuration.
   *
   * Applies domain visibility rules and binds the card to its entity registry entry.
   */
  public getCard(): TConfig {
    if (isEntityRegistryEntry(this.entity)) {
      const entityDomain = this.entity.entity_id.split('.', 1)[0] ?? '';
      const domain = isSupportedDomain(entityDomain) ? entityDomain : 'default';
      const domainOptions = {
        ...Registry.strategyOptions.domains['_'],
        ...Registry.strategyOptions.domains[domain],
      };

      if (domainOptions.hide_unavailable_entities) {
        this.configuration.visibility = [
          {
            condition: 'state',
            state_not: 'unavailable',
          },
        ] as TConfig['visibility'];
      }

      return {
        ...this.configuration,
        entity: this.entity.entity_id,
      } as TConfig;
    }

    return this.configuration as TConfig;
  }

  /** Returns the default configuration object for the card. */
  protected abstract getDefaultConfig(): Partial<TConfig>;
}
