import { LovelaceCardConfig, LovelaceViewConfig, StackCardConfig } from '@digilive/home-assistant-frontend-types';
import { HassServiceTarget } from 'home-assistant-js-websocket';

import { CardConstructor, CustomHeaderCardConfig, StrategyCardConfig } from '../types/strategy/strategy-cards';
import { SupportedDomains } from '../types/strategy/strategy-generics';
import { ViewConfig } from '../types/strategy/strategy-views';

import { sanitizeClassName } from '../utilities/auxiliaries';
import { stackHorizontal } from '../utilities/cardStacking';
import { localize } from '../utilities/localize';
import RegistryFilter from '../utilities/RegistryFilter';

import HeaderCard from '../cards/HeaderCard';

import { Registry } from '../Registry';

import AbstractView from './AbstractView';

/**
 * Abstract Domain View Class.
 *
 * Intermediate base class for views representing a single entity domain.
 */
export default abstract class AbstractDomainView<
  TConfig extends ViewConfig = ViewConfig,
> extends AbstractView<TConfig> {
  /** Entity domain represented by this view. */
  protected readonly domain: SupportedDomains;

  /** A card configuration to control all entities in the view. */
  private readonly viewHeaderCardConfiguration: StackCardConfig;

  /**
   * Class constructor.
   *
   * @template TConfig The configuration of the type of the view.
   * @param {SupportedDomains} domain The entity domain represented by this view.
   * @param {Partial<TConfig>} [customConfiguration] Custom view configuration overrides.
   * @param {CustomHeaderCardConfig} [headerCardConfig] Custom header card configuration overrides.
   */
  protected constructor(
    domain: SupportedDomains,
    customConfiguration?: Partial<TConfig>,
    headerCardConfig?: CustomHeaderCardConfig
  ) {
    super(customConfiguration);

    this.domain = domain;

    const domainOptions = {
      ...Registry.strategyOptions.domains['_'],
      ...Registry.strategyOptions.domains[domain],
    };

    this.configuration.headerCardConfiguration = {
      ...this.configuration.headerCardConfiguration,
      show_controls: domainOptions.show_controls,
    };

    this.viewHeaderCardConfiguration = new HeaderCard(this.getDomainTargets(), {
      ...this.configuration.headerCardConfiguration,
      ...headerCardConfig,
    }).getCard();
  }

  // noinspection JSUnusedGlobalSymbols Method is dynamically called.
  /**
   * Get a view configuration.
   */
  public async getView(): Promise<LovelaceViewConfig | false> {
    const sectionsCards = await this.createSections();

    if (!sectionsCards.length) {
      return false;
    }

    return {
      ...this.configuration,
      cards: sectionsCards,
    };
  }

  /**
   * Create the configuration of the cards to include in the view.
   */
  protected async createSections(): Promise<LovelaceCardConfig[]> {
    const viewCards: LovelaceCardConfig[] = [];
    const moduleName = sanitizeClassName(this.domain + 'Card');
    const DomainCard = ((await import(`../cards/${moduleName}`)) as { default: CardConstructor }).default;
    const domainEntities = new RegistryFilter(Registry.entities)
      .whereDomain(this.domain)
      .where((entity) => !entity.entity_id.endsWith('_stateful_scene'))
      .toList();

    for (const area of Registry.areas) {
      const areaEntities = new RegistryFilter(domainEntities).whereAreaId(area.area_id).toList();

      let areaCards: StrategyCardConfig[] = [];

      const target = {
        entity_id: areaEntities.map((entity) => entity.entity_id),
      };

      areaCards.push(
        ...areaEntities.map((entity) => new DomainCard(entity, Registry.getCardOptions(entity)).getCard())
      );

      if (areaCards.length) {
        areaCards = stackHorizontal(
          areaCards,
          Registry.strategyOptions.domains[this.domain].stack_count ?? Registry.strategyOptions.domains['_'].stack_count
        );

        areaCards.unshift(
          new HeaderCard(target, {
            title: area.name,
            ...this.configuration.headerCardConfiguration,
            subtitle: Registry.strategyOptions.show_positions
              ? `${localize('generic.ordering_position')}: ${area.order}`
              : undefined,
          }).getCard()
        );

        viewCards.push({ type: 'vertical-stack', cards: areaCards });
      }
    }

    if (this.viewHeaderCardConfiguration.cards.length && viewCards.length) {
      viewCards.unshift(this.viewHeaderCardConfiguration);
    }

    return viewCards;
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
}
