import DomainCardsGenerator from './domainCardsGenerator';
import RegistryFilter from '../utilities/RegistryFilter';
import { Registry } from '../Registry';
import { AreaRegistryEntry } from '../types/homeassistant/data/area_registry';
import { isSupportedDomain, SupportedDomains } from '../types/strategy/strategy-generics';
import { filterNonNullValues } from '../utilities/auxiliaries';
import { logMessage, lvlError } from '../utilities/debug';

/**
 * Class responsible for generating Lovelace card configurations for an area view in the Home Assistant UI.
 *
 * The generator creates configurations for each entity (e.g., sensors, switches, etc.) of a device.
 * It uses a combination of Header cards and entity-specific cards, and it handles miscellaneous entities
 * that do not fit into any supported domain.
 */
class AreaCardsGenerator extends DomainCardsGenerator {
  constructor(area: AreaRegistryEntry) {
    super({
      entities: new RegistryFilter(Registry.entities).whereAreaId(area.area_id).toList(),
      domains: Registry.getExposedNames('domain') as Set<SupportedDomains>,
    });

    this.parent.type = 'area';
    this.parent.id = area.area_id;
  }

  /**
   * Creates a list of Lovelace card configurations.
   *
   * @remarks
   * Take care about the order of calling the methods.
   * Each time a card is created, the regarding entity is removed from the list of entities to process.
   */
  public async getCards() {
    try {
      const deviceCards = await this.createDeviceCards();

      const [sensorCards, miscellaneousCards] = await Promise.all([
        this.createSensorCards(),
        this.createMiscellaneousCards(),
      ]);

      const domainCardsPromises = [...this.domains]
        .filter((domain) => isSupportedDomain(domain) && domain !== 'sensor')
        .map((domain) => this.createSupportedDomainCards(domain));
      const supportedDomainCards = await Promise.all(domainCardsPromises);

      filterNonNullValues(supportedDomainCards);

      if (sensorCards) {
        const insertIndex = supportedDomainCards.findIndex((card) => card.strategy.domain > 'sensor');
        supportedDomainCards.splice(insertIndex, 0, sensorCards);
      }

      const viewCards = [deviceCards, ...supportedDomainCards, miscellaneousCards];
      filterNonNullValues(viewCards);

      return viewCards;
    } catch (e) {
      logMessage(lvlError, 'Error creating area cards', e);
      return [];
    }
  }
}

export default AreaCardsGenerator;
