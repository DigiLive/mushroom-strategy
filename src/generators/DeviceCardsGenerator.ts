import DomainCardsGenerator from './domainCardsGenerator';
import RegistryFilter from '../utilities/RegistryFilter';
import { Registry } from '../Registry';
import { isSupportedDomain, SupportedDomains } from '../types/strategy/strategy-generics';
import { filterNonNullValues } from '../utilities/auxiliaries';
import { DeviceRegistryEntry } from '../types/homeassistant/data/device_registry';
import { LovelaceCardConfig } from '../types/homeassistant/data/lovelace/config/card';
import { logMessage, lvlError } from '../utilities/debug';

/**
 * Class responsible for generating Lovelace card configurations for a device view in the Home Assistant UI.
 *
 * The generator creates configurations for each entity (e.g., sensors, switches, etc.) of a device.
 * It uses a combination of Header cards and entity-specific cards, and it handles miscellaneous entities
 * that do not fit into any supported domain.
 */
class DeviceCardsGenerator extends DomainCardsGenerator {
  constructor(device: DeviceRegistryEntry) {
    super({
      entities: new RegistryFilter(Registry.entities).whereDeviceId(device.id).toList(),
      domains: Registry.getExposedNames('domain') as Set<SupportedDomains>,
    });

    this.parent.type = 'device';
    this.parent.id = device.id;
  }

  /**
   * Creates a list of Lovelace card configurations.
   */
  public async getCards(): Promise<LovelaceCardConfig[]> {
    try {
      const domainCardsPromises = [...this.domains]
        .filter((domain) => isSupportedDomain(domain) && domain !== 'sensor')
        .map((domain) => this.createSupportedDomainCards(domain));

      const supportedDomainCards = filterNonNullValues(await Promise.all(domainCardsPromises));
      const [sensorCards, miscellaneousCards] = await Promise.all([
        this.createSensorCards(),
        this.createMiscellaneousCards(),
      ]);

      if (sensorCards) {
        const insertIndex = supportedDomainCards.findIndex((card) => card.strategy.domain > 'sensor');
        supportedDomainCards.splice(insertIndex, 0, sensorCards);
      }

      return filterNonNullValues([...supportedDomainCards, miscellaneousCards]);
    } catch (e) {
      logMessage(lvlError, 'Error creating device cards', e);
      return [];
    }
  }
}

export default DeviceCardsGenerator;
