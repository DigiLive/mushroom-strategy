import { isSupportedDomain } from '../types/strategy/strategy-generics';
import { sanitizeClassName } from '../utilities/auxiliaries';
import RegistryFilter from '../utilities/RegistryFilter';
import { Registry } from '../Registry';
import HeaderCard from '../cards/HeaderCard';
import SensorCard from '../cards/SensorCard';
import { stackHorizontal } from '../utilities/cardStacking';
import { logMessage, lvlError } from '../utilities/debug';
import { EntityRegistryEntry } from '../types/homeassistant/data/entity_registry';
import { LovelaceCardConfig } from '../types/homeassistant/data/lovelace/config/card';

export async function generateDomainCards(
  domains: string[],
  domainEntities: EntityRegistryEntry[],
): Promise<LovelaceCardConfig[]> {
  const miscaleaniousCardsPromise = async (): Promise<LovelaceCardConfig[]> => {
    if (Registry.strategyOptions.domains.default.hidden) {
      return [];
    }

    const miscellaneousEntities = new RegistryFilter(domainEntities)
      .not()
      .where((entity) => isSupportedDomain(entity.entity_id.split('.', 1)[0]))
      .toList();

    if (!miscellaneousEntities.length) {
      return [];
    }

    try {
      const MiscellaneousCard = (await import('../cards/MiscellaneousCard')).default;
      const miscellaneousCards = [
        new HeaderCard({}, Registry.strategyOptions.domains.default).createCard(),
        ...miscellaneousEntities.map(
          (entity) =>
            new MiscellaneousCard(
              entity,
              Registry.strategyOptions.card_options?.[entity.entity_id],
            ).getCard() as LovelaceCardConfig,
        ),
      ];

      return [
        {
          type: 'vertical-stack',
          cards: miscellaneousCards,
        },
      ];
    } catch (e) {
      logMessage(lvlError, 'Error creating card configurations for domain `miscellaneous`', e);

      return [];
    }
  };

  const otherDomainCardPromises = domains
    .filter(isSupportedDomain)
    .map(async (domain): Promise<LovelaceCardConfig[]> => {
      const moduleName = sanitizeClassName(domain + 'Card');
      const module = import(`../cards/${moduleName}`);

      const entities = new RegistryFilter(domainEntities)
        .whereDomain(domain)
        .where((entity) => !(domain === 'switch' && entity.entity_id.endsWith('_stateful_scene')))
        .toList();

      if (!entities.length) {
        return [];
      }

      const titleCard = new HeaderCard(
        { entity_id: entities.map((entity) => entity.entity_id) },
        Registry.strategyOptions.domains[domain],
      ).createCard();

      try {
        const DomainCard = (await module).default;

        if (domain === 'sensor') {
          const domainCards = entities
            .filter((entity) => Registry.hassStates[entity.entity_id]?.attributes.unit_of_measurement)
            .map((entity) => {
              const options = {
                ...(entity.device_id && Registry.strategyOptions.card_options?.[entity.device_id]),
                ...Registry.strategyOptions.card_options?.[entity.entity_id],
                type: 'custom:mini-graph-card',
                entities: [entity.entity_id],
              };

              return new SensorCard(entity, options).getCard();
            });

          return domainCards.length ? [{ type: 'vertical-stack', cards: [titleCard, ...domainCards] }] : [];
        }

        let domainCards = entities.map((entity) => {
          const cardOptions = {
            ...(entity.device_id && Registry.strategyOptions.card_options?.[entity.device_id]),
            ...Registry.strategyOptions.card_options?.[entity.entity_id],
          };

          return new DomainCard(entity, cardOptions).getCard() as LovelaceCardConfig;
        });

        if (domain === 'binary_sensor') {
          domainCards = stackHorizontal(domainCards);
        }

        return domainCards.length ? [{ type: 'vertical-stack', cards: [titleCard, ...domainCards] }] : [];
      } catch (e) {
        logMessage(lvlError, `Error creating card configurations for domain ${domain}`, e);

        return [];
      }
    });

  return (await Promise.all([...otherDomainCardPromises, miscaleaniousCardsPromise()])).flat();
}
