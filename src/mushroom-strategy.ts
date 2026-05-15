import { HassServiceTarget } from 'home-assistant-js-websocket';
import HeaderCard from './cards/HeaderCard';
import SensorCard from './cards/SensorCard';
import { Registry } from './Registry';
import { LovelaceCardConfig } from './types/homeassistant/data/lovelace/config/card';
import { LovelaceConfig } from './types/homeassistant/data/lovelace/config/types';
import { LovelaceViewConfig } from './types/homeassistant/data/lovelace/config/view';
import {
  DashboardInfo,
  isSupportedDomain,
  isSupportedView,
  SingleDomainConfig,
  StrategyViewConfig,
  ViewInfo,
} from './types/strategy/strategy-generics';
import { sanitizeClassName } from './utilities/auxiliaries';
import { logMessage, lvlError } from './utilities/debug';
import RegistryFilter from './utilities/RegistryFilter';
import { stackHorizontal } from './utilities/cardStacking';
import { PersistentNotification } from './utilities/PersistentNotification';
import { HomeAssistant } from './types/homeassistant/types';
import semver from 'semver/preload';
import { NOTIFICATIONS } from './notifications';
import MiscellaneousCard from './cards/MiscellaneousCard';
import { localize } from './utilities/localize';
import { ViewConstructor } from './types/strategy/strategy-views';
import { CardConstructor } from './types/strategy/strategy-cards';

/**
 * Mushroom Dashboard Strategy.
 *
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

    await MushroomStrategy.handleNotifications(info.hass);

    // Parallelize view imports and creation.
    const viewPromises = Registry.getExposedNames('view')
      .filter(isSupportedView)
      .map(async (viewName) => {
        try {
          const moduleName = sanitizeClassName(`${viewName}View`);
          const View = ((await import(`./views/${moduleName}`)) as { default: ViewConstructor }).default;
          const currentView = new View(Registry.strategyOptions.views[viewName]);

          return await currentView.getView();
        } catch (e) {
          logMessage(lvlError, `Error importing ${viewName} view!`, e);
        }

        return null;
      });

    let views: StrategyViewConfig[] = (await Promise.all(viewPromises)).filter(Boolean) as StrategyViewConfig[];

    views.push(...Registry.strategyOptions.extra_views);

    views.sort((viewA, viewB) => {
      const orderA = viewA.order ?? Infinity;
      const orderB = viewB.order ?? Infinity;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return (viewA.title ?? '').localeCompare(viewB.title ?? '', undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    });

    if (Registry.strategyOptions.show_positions) {
      views = views.map((view) => {
        return {
          ...view,
          title: `${view.title}: ${view.order}`,
          show_icon_and_title: true,
        };
      });
    }

    // Subviews for areas
    views.push(
      ...Registry.areas.map((area) => ({
        title: area.name,
        path: area.area_id,
        subview: true,
        hidden: area.hidden ?? false,
        order: area.order ?? Infinity,
        strategy: {
          type: 'custom:mushroom-strategy',
          options: { area },
        },
      }))
    );

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
    const area = info.view.strategy.options.area;
    const areaEntities = new RegistryFilter(Registry.entities).whereAreaId(area.area_id).toList();
    const viewCards = Registry.strategyOptions.areas[area.area_id]?.extra_cards ?? [];

    // Set the target for any Header card to the current area.
    const target: HassServiceTarget = { area_id: [area.area_id] };

    // Prepare promises for all supported domains
    const domainCardPromises = exposedDomainNames.filter(isSupportedDomain).map(async (domain) => {
      const moduleName = sanitizeClassName(domain + 'Card');
      const domainOptions = {
        ...Registry.strategyOptions.domains['_'],
        ...Registry.strategyOptions.domains[domain],
      };

      if (Registry.strategyOptions.show_positions && domain !== '_') {
        (domainOptions as SingleDomainConfig).subtitle =
          `${localize('generic.ordering_position')}: ${Registry.strategyOptions.domains[domain].order}`;
      }

      const entities = new RegistryFilter(areaEntities)
        .whereDomain(domain)
        .when(domainOptions.hide_config_entities, (filter) => filter.not().whereEntityCategory('config'))
        .when(domainOptions.hide_diagnostic_entities, (filter) => filter.not().whereEntityCategory('diagnostic'))
        .where((entity) => !(domain === 'switch' && entity.entity_id.endsWith('_stateful_scene')))
        .toList();

      if (!entities.length) {
        return null;
      }

      const headerCard = new HeaderCard(
        { entity_id: entities.map((entity) => entity.entity_id) },
        domainOptions
      ).createCard();

      try {
        const DomainCard = ((await import(`./cards/${moduleName}`)) as { default: CardConstructor }).default;

        if (domain === 'sensor') {
          let domainCards = entities.map((entity) => {
            const isMeasurement = Registry.hassStates[entity.entity_id]?.attributes.unit_of_measurement;
            const options = {
              ...(entity.device_id && Registry.strategyOptions.card_options?.[entity.device_id]),
              ...Registry.strategyOptions.card_options?.[entity.entity_id],
              entities: [entity.entity_id],
            };

            return isMeasurement
              ? new SensorCard(entity, options).getCard()
              : new MiscellaneousCard(entity, options).getCard();
          });

          if (domainCards.length) {
            domainCards = stackHorizontal(
              domainCards,
              Registry.strategyOptions.domains[domain].stack_count ?? Registry.strategyOptions.domains['_'].stack_count
            );

            return { type: 'vertical-stack', cards: [headerCard, ...domainCards] };
          }

          return null;
        }

        let domainCards = entities.map((entity) => {
          const cardOptions = {
            ...(entity.device_id && Registry.strategyOptions.card_options?.[entity.device_id]),
            ...Registry.strategyOptions.card_options?.[entity.entity_id],
          };
          return new DomainCard(entity, cardOptions).getCard();
        });

        domainCards = stackHorizontal(
          domainCards,
          Registry.strategyOptions.domains[domain].stack_count ?? Registry.strategyOptions.domains['_'].stack_count
        );

        return domainCards.length ? { type: 'vertical-stack', cards: [headerCard, ...domainCards] } : null;
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
          let miscellaneousCards = miscellaneousEntities.map((entity) =>
            new MiscellaneousCard(entity, Registry.strategyOptions.card_options?.[entity.entity_id]).getCard()
          );

          const headerCard = new HeaderCard(target, {
            ...Registry.strategyOptions.domains['_'],
            ...Registry.strategyOptions.domains['default'],
          }).createCard();

          if (miscellaneousCards.length) {
            miscellaneousCards = stackHorizontal(
              miscellaneousCards,
              Registry.strategyOptions.domains['default'].stack_count ??
                Registry.strategyOptions.domains['_'].stack_count
            );

            viewCards.push({
              type: 'vertical-stack',
              cards: [headerCard, ...miscellaneousCards],
            });
          }
        } catch (e) {
          logMessage(lvlError, 'Error creating card configurations for domain `miscellaneous`', e);
        }
      }
    }

    return { cards: viewCards };
  }

  /**
   * Handle persistent notifications.
   *
   * @remarks
   * Goes through `NOTIFICATIONS` and shows each one whose version range matches the current version.
   * If the current version is not applicable, the notification is dismissed.
   *
   * @param hass The Home Assistant instance.
   * @returns A promise that resolves when all notifications have been handled.
   */
  private static async handleNotifications(hass: HomeAssistant): Promise<void> {
    if (NOTIFICATIONS.length === 0) {
      return;
    }

    const notificationManager = new PersistentNotification(hass, 'mushroom_strategy');
    const currentVersion = STRATEGY_VERSION.replace(/^v/, '');
    const version = semver.coerce(currentVersion) || '0.0.0';

    try {
      await Promise.all(
        NOTIFICATIONS.map(async (notification) => {
          if (semver.gte(version, notification.fromVersion) && semver.lte(version, notification.toVersion)) {
            return notificationManager.showNotification(notification.storageKey, notification.message, {
              title: notification.title,
              version: currentVersion,
            });
          }

          return notificationManager.dismissNotification(notification.storageKey);
        })
      );
    } catch (e) {
      logMessage(lvlError, 'Error while handling persistent notifications for Mushroom Strategy', e);
    }
  }

  /**
   * Returns suggestions for creating a new dashboard with this strategy.
   *
   * @returns An object containing the title and icon for the dashboard creation suggestion.
   *
   * @remarks
   * This method is used by Home Assistant to display a suggestion when the user opts to create a new dashboard.
   */
  static getCreateSuggestions() {
    return {
      title: 'Mushroom Dashboard',
      icon: 'mdi:mushroom',
    };
  }
}

const STRATEGY_VERSION = 'v3.1.0';

console.info(
  '%c Mushroom Strategy %c '.concat(STRATEGY_VERSION, ' '),
  'color: white; background: coral; font-weight: 700;',
  'color: coral; background: white; font-weight: 700;'
);

customElements.define('ll-strategy-mushroom-strategy', MushroomStrategy);

// Register the strategy as a custom HASS dashboard.
window.customStrategies = window.customStrategies || [];
window.customStrategies.push({
  type: 'mushroom-strategy',
  strategyType: 'dashboard',
  name: `Mushroom Dashboard Strategy ${STRATEGY_VERSION}`,
  description: `A strategy to automatically generate a dashboard using mushroom cards.`,
  documentationURL: `https://digilive.github.io/mushroom-strategy/${STRATEGY_VERSION}/`,
});
