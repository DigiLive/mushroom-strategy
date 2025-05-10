import { logMessage, lvlError, lvlInfo } from '../utilities/debug';
import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';
import { LovelaceCardConfig } from '../types/homeassistant/data/lovelace/config/card';
import HeaderCard from '../cards/HeaderCard';
import { DeviceCard } from '../cards/DeviceCard';
import RegistryFilter from '../utilities/RegistryFilter';
import { Registry } from '../Registry';
import { isSupportedDomain, SupportedDomains } from '../types/strategy/strategy-generics';
import { localize } from '../utilities/localize';
import { filterNonNullValues, sanitizeClassName } from '../utilities/auxiliaries';
import { stackHorizontal } from '../utilities/cardStacking';
import { CustomCardConfiguration } from '../types/strategy/strategy-cards';

/**
 * Abstract class responsible for generating Lovelace card configurations for various domains in the Home Assistant UI.
 *
 * This class serves as a base for generating card configurations erp domain.
 * Subclasses should implement specific logic for creating cards based on domain requirements.
 *
 * @remarks
 * Take care about the order of calling the methods.
 * Each time a card is created, the regarding entity is removed from the list of entities to process.
 */
abstract class DomainCardsGenerator {
  protected domains: Set<SupportedDomains>;
  protected parent: {
    type: 'device' | 'area' | undefined;
    id: string | undefined;
  } = {
    type: undefined,
    id: undefined,
  };
  private entities: EntityRegistryEntry[];

  /**
   * Initializes the DomainCardsGenerator with the specified entities and domains.
   *
   * @param properties - An object containing the entities and domains to be used for card generation.
   */
  protected constructor(properties: { entities: EntityRegistryEntry[]; domains: Set<SupportedDomains> }) {
    this.entities = properties.entities;
    this.domains = properties.domains;
  }

  /**
   * Creates Lovelace card configurations for devices.
   *
   * This method generates cards devices.
   *
   * @returns A promise that resolves to a Lovelace card configuration for devices or null if no devices are available.
   */
  public async createDeviceCards(): Promise<LovelaceCardConfig | null> {
    const devices = new RegistryFilter(Registry.devices)
      .where((device) => Registry.groupingDeviceIds.has(device.id))
      .toList();

    if (!devices.length) {
      logMessage(lvlInfo, `No sensors available for view of ${this.parent.type} ${this.parent.id}.`);
      return null;
    }

    const cards = await Promise.all(
      devices.map(async (device) => {
        try {
          const deviceCard = new DeviceCard(device).getCard();
          this.entities = this.entities.filter((entity) => entity.device_id !== device.id);

          return deviceCard;
        } catch (e) {
          logMessage(lvlError, `Error creating card for device with id ${device.id}`, e);

          return null;
        }
      }),
    );

    const headerCard = new HeaderCard(
      {},
      {
        title: localize('generic.devices', 'title'),
        showControls: false,
      },
    ).createCard();

    return {
      type: 'vertical-stack',
      cards: [headerCard, ...cards.filter((card): card is LovelaceCardConfig => card !== null)],
    };
  }

  /**
   * Creates Lovelace card configurations for sensor entities.
   *
   * This method filters the entities to only include sensors and generates cards for them.
   *
   * @returns A promise that resolves to a Lovelace card configuration for sensors or null if no sensors are available.
   */
  protected async createSensorCards(): Promise<LovelaceCardConfig | null> {
    const entities = new RegistryFilter(this.entities)
      .whereDomain('sensor')
      .where((entity) => Registry.hassStates[entity.entity_id]?.attributes.unit_of_measurement !== undefined)
      .toList();

    if (!entities.length) {
      logMessage(lvlInfo, `No sensors available for view of ${this.parent.type} ${this.parent.id}.`);
      return null;
    }

    const cards = await Promise.all(
      entities.map(async (entity) => {
        return this.createEntityCard(entity, 'SensorCard', {
          ...Registry.strategyOptions.card_options[entity.entity_id],
          type: 'custom:mini-graph-card',
          entities: [entity.entity_id],
        });
      }),
    );

    const headerCard = new HeaderCard({}, Registry.strategyOptions.domains['sensor']).createCard();

    return {
      type: 'vertical-stack',
      cards: [headerCard, ...cards.filter((card): card is LovelaceCardConfig => card !== null)],
      strategy: { domain: 'sensor' },
    };
  }

  /**
   * Creates Lovelace card configurations for miscellaneous entities.
   *
   * This method filters the entities to include those that do not belong to any supported domain and generates cards
   * for them.
   *
   * @returns A promise that resolves to a Lovelace card configuration for miscellaneous entities or null if none are
   *          available.
   */
  protected async createMiscellaneousCards(): Promise<LovelaceCardConfig | null> {
    const entities = new RegistryFilter(this.entities)
      .where((entity) => !isSupportedDomain(entity.entity_id.split('.', 1)[0]))
      .toList();

    if (!entities.length) {
      logMessage(lvlInfo, `No sensors available for view of ${this.parent.type} ${this.parent.id}.`);
      return null;
    }

    const cards = await Promise.all(
      entities.map(async (entity) => {
        return this.createEntityCard(
          entity,
          'MiscellaneousCard',
          Registry.strategyOptions.card_options[entity.entity_id],
        );
      }),
    );

    const headerCard = new HeaderCard({}, { title: Registry.strategyOptions.domains['default'].title }).createCard();

    return {
      type: 'vertical-stack',
      cards: [headerCard, ...cards.filter((card): card is LovelaceCardConfig => card !== null)],
      strategy: { domain: 'default' },
    };
  }

  /**
   * Creates Lovelace card configurations for entities within a supported domain.
   *
   * This method generates cards for all entities that belong to the specified domain.
   *
   * @param domainName - The name of the domain for which to create cards.
   * @returns A promise that resolves to a Lovelace card configuration for the specified domain or null if no entities
   *          of that domain are available.
   */
  protected async createSupportedDomainCards(domainName: SupportedDomains): Promise<LovelaceCardConfig | null> {
    const targets: EntityRegistryEntry['entity_id'][] = [];
    const entities = new RegistryFilter(this.entities)
      .whereDomain(domainName)
      .where((entity) => !(domainName === 'switch' && entity.entity_id.endsWith('_stateful_scene')))
      .toList();

    if (!entities.length) {
      logMessage(lvlInfo, `No ${domainName} entities available for view of ${this.parent.type} ${this.parent.id}.`);
      return null;
    }

    let cards: (LovelaceCardConfig | null)[] = await Promise.all(
      entities.map(async (entity) => {
        targets.push(entity.entity_id);

        return this.createEntityCard(
          entity,
          `${domainName}Card`,
          Registry.strategyOptions.card_options[entity.entity_id],
        );
      }),
    );

    if (domainName === 'binary_sensor') {
      cards = stackHorizontal(filterNonNullValues(cards));
    }

    const headerCard = new HeaderCard(
      { entity_id: targets },
      Registry.strategyOptions.domains[domainName],
    ).createCard();

    return {
      type: 'vertical-stack',
      cards: [headerCard, ...cards],
      strategy: { domain: domainName },
    };
  }

  /**
   * Creates a Lovelace card configuration for a specified entity.
   *
   * @param entity - The entity for which to create a card.
   * @param entityClassName - The class name of the card to create.
   * @param customConfiguration - Optional custom configuration for the card.
   *
   * @returns A promise that resolves to the Lovelace card configuration or null if creation fails.
   */
  private async createEntityCard(
    entity: EntityRegistryEntry,
    entityClassName: string,
    customConfiguration?: CustomCardConfiguration,
  ): Promise<LovelaceCardConfig | null> {
    try {
      const { default: entityClass } = await import(`../cards/${sanitizeClassName(entityClassName)}`);
      const card = new entityClass(entity, customConfiguration).getCard();

      this.entities = this.entities.filter((unprocessedEntity) => unprocessedEntity.entity_id !== entity.entity_id);

      return card;
    } catch (e) {
      logMessage(lvlError, `Error creating a card for entity with id ${entity.entity_id}`, e);

      return null;
    }
  }
}

export default DomainCardsGenerator;
