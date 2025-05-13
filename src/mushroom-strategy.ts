import { HassServiceTarget } from 'home-assistant-js-websocket';
import HeaderCard from './cards/HeaderCard';
import SensorCard from './cards/SensorCard';
import { Registry } from './Registry';
import { LovelaceCardConfig } from './types/homeassistant/data/lovelace/config/card';
import { LovelaceConfig } from './types/homeassistant/data/lovelace/config/types';
import { LovelaceViewConfig, LovelaceViewRawConfig } from './types/homeassistant/data/lovelace/config/view';
import {
  DashboardInfo,
  isSupportedDomain,
  isSupportedView,
  StrategyArea,
  ViewInfo,
} from './types/strategy/strategy-generics';
import { sanitizeClassName } from './utilities/auxiliaries';
import { logMessage, lvlError } from './utilities/debug';
import RegistryFilter from './utilities/RegistryFilter';
import { stackHorizontal } from './utilities/cardStacking';

/**
 * Mushroom Dashboard Strategy.<br>
 * <br>
 * Mushroom dashboard strategy provides a strategy for Home-Assistant to create a dashboard automatically.<br>
 * The strategy makes use Mushroom and Mini Graph cards to represent your entities.
 *
 * @see https://github.com/DigiLive/mushroom-strategy
 */
class MushroomStrategy extends HTMLTemplateElement {
  /**
   * Generate a dashboard.
   *
   * This method creates views for each exposed domain and area.
   * It also adds custom views if specified in the strategy options.
   *
   * @param {DashboardInfo} info Dashboard strategy information object.
   *
   * @remarks
   * Called when opening a dashboard.
   */
  static async generateDashboard(info: DashboardInfo): Promise<LovelaceConfig> {
    await Registry.initialize(info);

    const views: LovelaceViewRawConfig[] = [];

    // Parallelize view imports and creation.
    const viewPromises = Registry.getExposedNames('view')
      .filter(isSupportedView)
      .map(async (viewName) => {
        try {
          const moduleName = sanitizeClassName(`${viewName}View`);
          const View = (await import(`./views/${moduleName}`)).default;
          const currentView = new View(Registry.strategyOptions.views[viewName]);
          const viewConfiguration = await currentView.getView();

          if (viewConfiguration.cards.length) {
            return viewConfiguration;
          }
        } catch (e) {
          logMessage(lvlError, `Error importing ${viewName} view!`, e);
        }

        return null;
      });

    const resolvedViews = (await Promise.all(viewPromises)).filter(Boolean) as LovelaceViewRawConfig[];

    views.push(...resolvedViews);

    // Subviews for areas
    views.push(
      ...Registry.areas.map((area) => ({
        title: area.name,
        path: area.area_id,
        subview: true,
        strategy: {
          type: 'custom:mushroom-strategy',
          options: { area },
        },
      })),
    );

    // Extra views
    if (Registry.strategyOptions.extra_views) {
      views.push(...Registry.strategyOptions.extra_views);
    }

    return { views };
  }

  /**
   * Generate a view.
   *
   * The method creates cards for each domain (e.g., sensors, switches, etc.) in the current area, using a combination
   * of Header cards and entity-specific cards.
   * It also handles miscellaneous entities that don't fit into any supported domain.
   *
   * @param {ViewInfo} info The view's strategy information object.
   *
   * @remarks
   * Called upon opening a subview.
   */
  static async generateView(info: ViewInfo): Promise<LovelaceViewConfig> {
    const exposedDomainNames = Registry.getExposedNames('domain');
    const area = info.view.strategy?.options?.area ?? ({} as StrategyArea);
    const areaEntities = new RegistryFilter(Registry.entities).whereAreaId(area.area_id).toList();
    const viewCards: LovelaceCardConfig[] = [...(area.extra_cards ?? [])];

    // Set the target for any Header card to the current area.
    const target: HassServiceTarget = { area_id: [area.area_id] };

    // Prepare promises for all supported domains
    const domainCardPromises = exposedDomainNames.filter(isSupportedDomain).map(async (domain) => {
      const moduleName = sanitizeClassName(domain + 'Card');

      const entities = new RegistryFilter(areaEntities)
        .whereDomain(domain)
        .where((entity) => !(domain === 'switch' && entity.entity_id.endsWith('_stateful_scene')))
        .toList();

      if (!entities.length) {
        return null;
      }

      const titleCard = new HeaderCard(
        { entity_id: entities.map((entity) => entity.entity_id) },
        Registry.strategyOptions.domains[domain],
      ).createCard();

      try {
        const DomainCard = (await import(`./cards/${moduleName}`)).default;

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
          return domainCards.length ? { type: 'vertical-stack', cards: [titleCard, ...domainCards] } : null;
        }

        let domainCards = entities.map((entity) => {
          const cardOptions = {
            ...(entity.device_id && Registry.strategyOptions.card_options?.[entity.device_id]),
            ...Registry.strategyOptions.card_options?.[entity.entity_id],
          };
          return new DomainCard(entity, cardOptions).getCard();
        });

        if (domain === 'binary_sensor') {
          domainCards = stackHorizontal(domainCards);
        }

        return domainCards.length ? { type: 'vertical-stack', cards: [titleCard, ...domainCards] } : null;
      } catch (e) {
        logMessage(lvlError, `Error creating card configurations for domain ${domain}`, e);
        return null;
      }
    });

    // Await all domain card stacks
    const domainCardStacks = (await Promise.all(domainCardPromises)).filter(Boolean) as LovelaceCardConfig[];
    viewCards.push(...domainCardStacks);

    // Miscellaneous domain
    if (!Registry.strategyOptions.domains.default.hidden) {
      const miscellaneousEntities = new RegistryFilter(areaEntities)
        .not()
        .where((entity) => isSupportedDomain(entity.entity_id.split('.', 1)[0]))
        .toList();

      if (miscellaneousEntities.length) {
        try {
          const MiscellaneousCard = (await import('./cards/MiscellaneousCard')).default;
          const miscellaneousCards = [
            new HeaderCard(target, Registry.strategyOptions.domains.default).createCard(),
            ...miscellaneousEntities.map((entity) =>
              new MiscellaneousCard(entity, Registry.strategyOptions.card_options?.[entity.entity_id]).getCard(),
            ),
          ];

          viewCards.push({
            type: 'vertical-stack',
            cards: miscellaneousCards,
          });
        } catch (e) {
          logMessage(lvlError, 'Error creating card configurations for domain `miscellaneous`', e);
        }
      }
    }

    return { cards: viewCards };
  }
}

customElements.define('ll-strategy-mushroom-strategy', MushroomStrategy);

const version = 'v2.3.0';
console.info(
  '%c Mushroom Strategy %c '.concat(version, ' '),
  'color: white; background: coral; font-weight: 700;',
  'color: coral; background: white; font-weight: 700;',
);
