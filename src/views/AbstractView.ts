import { HassServiceTarget } from 'home-assistant-js-websocket';
import HeaderCard from '../cards/HeaderCard';
import { Registry } from '../Registry';
import { LovelaceCardConfig } from '../types/homeassistant/data/lovelace/config/card';
import { LovelaceViewConfig } from '../types/homeassistant/data/lovelace/config/view';
import { StackCardConfig } from '../types/homeassistant/panels/lovelace/cards/types';
import { AbstractCardConfig, CustomHeaderCardConfig, StrategyHeaderCardConfig } from '../types/strategy/strategy-cards';
import { SupportedDomains } from '../types/strategy/strategy-generics';
import { ViewConfig, ViewConstructor } from '../types/strategy/strategy-views';
import { sanitizeClassName } from '../utilities/auxiliaries';
import { logMessage, lvlFatal } from '../utilities/debug';
import RegistryFilter from '../utilities/RegistryFilter';
import { stackHorizontal } from '../utilities/cardStacking';

/**
 * Abstract View Class.
 *
 * To create a view configuration, this class should be extended by a child class.
 * Child classes should override the default configuration so the view correctly reflects the entities of a domain.
 *
 * @remarks
 * Before this class can be used, the Registry module must be initialized by calling {@link Registry.initialize}.
 */
abstract class AbstractView {
  /** The base configuration of a view. */
  protected baseConfiguration: ViewConfig = {
    icon: 'mdi:view-dashboard',
    subview: false,
  };

  /** A card configuration to control all entities in the view. */
  private viewHeaderCardConfiguration: StackCardConfig = {
    cards: [],
    type: '',
  };

  protected get domain(): SupportedDomains | 'home' {
    return (this.constructor as unknown as ViewConstructor).domain;
  }

  /**
   * Class constructor.
   *
   * @remarks
   * Before this class can be used, the Registry module must be initialized by calling {@link Registry.initialize}.
   */
  protected constructor() {
    if (!Registry.initialized) {
      logMessage(lvlFatal, 'Registry is not initialized!');
    }
  }

  /**
   * Create the configuration of the cards to include in the view.
   */
  protected async createCardConfigurations(): Promise<LovelaceCardConfig[]> {
    const viewCards: LovelaceCardConfig[] = [];
    const moduleName = sanitizeClassName(this.domain + 'Card');
    const DomainCard = (await import(`../cards/${moduleName}`)).default;
    const domainEntities = new RegistryFilter(Registry.entities)
      .whereDomain(this.domain)
      .where((entity) => !entity.entity_id.endsWith('_stateful_scene'))
      .toList();

    // Create card configurations for each area.
    for (const area of Registry.areas) {
      let areaCards: AbstractCardConfig[] = [];

      // Set the target of the Header card to the current area.
      let target: HassServiceTarget = {
        area_id: [area.area_id],
      };
      const areaEntities = new RegistryFilter(domainEntities).whereAreaId(area.area_id).toList();

      // Set the target of the Header card to entities without an area.
      if (area.area_id === 'undisclosed') {
        target = {
          entity_id: areaEntities.map((entity) => entity.entity_id),
        };
      }

      // Create a card configuration for each entity in the current area.
      areaCards.push(
        ...areaEntities.map((entity) =>
          new DomainCard(entity, Registry.strategyOptions.card_options?.[entity.entity_id]).getCard(),
        ),
      );

      // Stack the cards of the current area.
      if (areaCards.length) {
        areaCards = stackHorizontal(
          areaCards,
          Registry.strategyOptions.domains[this.domain as SupportedDomains].stack_count ??
            Registry.strategyOptions.domains['_'].stack_count,
        );

        // Create and insert a Header card.
        const areaHeaderCardOptions = (
          'headerCardConfiguration' in this.baseConfiguration ? this.baseConfiguration.headerCardConfiguration : {}
        ) as CustomHeaderCardConfig;

        areaCards.unshift(new HeaderCard(target, { title: area.name, ...areaHeaderCardOptions }).createCard());

        viewCards.push({ type: 'vertical-stack', cards: areaCards });
      }
    }

    // Add a Header Card to control all the entities in the view.
    if (this.viewHeaderCardConfiguration.cards.length && viewCards.length) {
      viewCards.unshift(this.viewHeaderCardConfiguration);
    }

    return viewCards;
  }

  /**
   * Get a view configuration.
   *
   * The configuration includes the card configurations which are created by createCardConfigurations().
   */
  async getView(): Promise<LovelaceViewConfig> {
    return {
      ...this.baseConfiguration,
      cards: await this.createCardConfigurations(),
    };
  }

  /**
   * Get the domain's entity ids to target for a HASS service call.
   */
  private getDomainTargets(): HassServiceTarget {
    return {
      entity_id: Registry.entities
        .filter((entity) => entity.entity_id.startsWith(this.domain + '.'))
        .map((entity) => entity.entity_id),
    };
  }

  /**
   * Initialize the view configuration with defaults and custom settings.
   *
   * @param viewConfiguration The view's default configuration for the view.
   * @param customConfiguration The view's custom configuration to apply.
   * @param headerCardConfig The view's Header card configuration.
   */
  protected initializeViewConfig(
    viewConfiguration: ViewConfig,
    customConfiguration: ViewConfig = {},
    headerCardConfig: CustomHeaderCardConfig,
  ): void {
    this.baseConfiguration = { ...this.baseConfiguration, ...viewConfiguration, ...customConfiguration };

    this.baseConfiguration.headerCardConfiguration = {
      ...this.baseConfiguration.headerCardConfiguration,
      showControls:
        Registry.strategyOptions.domains[this.domain as Exclude<SupportedDomains, 'home'>]?.showControls ??
        Registry.strategyOptions.domains['_'].showControls,
    };

    this.viewHeaderCardConfiguration = new HeaderCard(this.getDomainTargets(), {
      ...(this.baseConfiguration.headerCardConfiguration as StrategyHeaderCardConfig),
      ...headerCardConfig,
    }).createCard();
  }
}

export default AbstractView;
