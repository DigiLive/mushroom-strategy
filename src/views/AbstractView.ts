import {Helper} from "../Helper";
import {ControllerCard} from "../cards/ControllerCard";
import {LovelaceCardConfig} from "../types/homeassistant/data/lovelace";
import {cards} from "../types/strategy/cards";
import {TitleCardConfig} from "../types/lovelace-mushroom/cards/title-card-config";
import {HassServiceTarget} from "home-assistant-js-websocket";
import {applyEntityCategoryFilters} from "../utillties/filters";
import {LovelaceViewConfig} from "../types/homeassistant/data/lovelace/config/view";
import {StackCardConfig} from "../types/homeassistant/panels/lovelace/cards/types";
import {generic} from "../types/strategy/generic";
import abstractCardConfig = cards.AbstractCardConfig;
import SupportedDomains = generic.SupportedDomains;

/**
 * Abstract View Class.
 *
 * To create a new view, extend the new class with this one.
 *
 * @class
 * @abstract
 */
abstract class AbstractView {
  /**
   * Configuration of the view.
   *
   * @type {LovelaceViewConfig}
   */
  config: LovelaceViewConfig = {
    icon: "mdi:view-dashboard",
    subview: false,
  };

  /**
   * A card to switch all entities in the view.
   *
   * @type {StackCardConfig}
   */
  viewControllerCard: StackCardConfig = {
    cards: [],
    type: "",
  };

  /**
   * The domain of which we operate the devices.
   *
   * @type {SupportedDomains | "home"}
   * @private
   * @readonly
   */
  readonly #domain: SupportedDomains | "home";

  /**
   * Class constructor.
   *
   * @param {SupportedDomains} domain The domain which the view is representing.
   *
   * @throws {Error} If trying to instantiate this class.
   * @throws {Error} If the Helper module isn't initialized.
   */
  protected constructor(domain: SupportedDomains | "home") {
    if (!Helper.isInitialized()) {
      throw new Error("The Helper module must be initialized before using this one.");
    }

    this.#domain = domain;
  }

  /**
   * Create the cards to include in the view.
   *
   * @returns {Promise<(StackCardConfig | TitleCardConfig)[]>} An array of card objects.
   */
  async createViewCards(): Promise<(StackCardConfig | TitleCardConfig)[]> {
    if (this.#domain === "home") {
      // The home domain should override this method because it hasn't entities on its own.
      // The method override creates its own cards to show at the home view.

      return [];
    }

    const viewCards: LovelaceCardConfig[] = [];

    // Create cards for each area.
    for (const area of Helper.areas) {
      const areaCards: abstractCardConfig[] = [];
      const className = Helper.sanitizeClassName(this.#domain + "Card");
      const cardModule = await import(`../cards/${className}`);

      // Set the target for controller cards to the current area.
      let target: HassServiceTarget = {
        area_id: [area.area_id],
      };

      let entities = Helper.getDeviceEntities(area, this.#domain);
      // Exclude hidden Config and Diagnostic entities.
      entities = applyEntityCategoryFilters(entities, this.#domain);

      // Set the target for controller cards to entities without an area.
      if (area.area_id === "undisclosed") {
        target = {
          entity_id: entities.map(entity => entity.entity_id),
        }
      }

      // Create a card for each domain-entity of the current area.
      for (const entity of entities) {
        let cardOptions = Helper.strategyOptions.card_options?.[entity.entity_id];
        let deviceOptions = Helper.strategyOptions.card_options?.[entity.device_id ?? "null"];

        if (cardOptions?.hidden || deviceOptions?.hidden) {
          continue;
        }

        areaCards.push(new cardModule[className](entity, cardOptions).getCard());
      }

      // Vertical stack the area cards if it has entities.
      if (areaCards.length) {
        const titleCardOptions = ("controllerCardOptions" in this.config) ? this.config.controllerCardOptions : {};

        // Create and insert a Controller card.
        areaCards.unshift(new ControllerCard(target, Object.assign({title: area.name}, titleCardOptions)).createCard());

        viewCards.push({
          type: "vertical-stack",
          cards: areaCards,
        } as StackCardConfig);
      }
    }

    // Add a Controller Card for all the entities in the view.
    if (this.viewControllerCard.cards.length && viewCards.length) {
      viewCards.unshift(this.viewControllerCard);
    }

    return viewCards;
  }

  /**
   * Get a view object.
   *
   * The view includes the cards which are created by method createViewCards().
   *
   * @returns {Promise<LovelaceViewConfig>} The view object.
   */
  async getView(): Promise<LovelaceViewConfig> {
    return {
      ...this.config,
      cards: await this.createViewCards(),
    };
  }

  /**
   * Get a target of entity IDs for the given domain.
   *
   * @param {string} domain - The target domain to retrieve entity IDs from.
   * @returns {HassServiceTarget} - A target for a service call.
   */
  targetDomain(domain: string): HassServiceTarget {
    return {
      entity_id: Helper.entities.filter(
        entity =>
          entity.entity_id.startsWith(domain + ".")
          && !entity.hidden_by
          && !Helper.strategyOptions.card_options?.[entity.entity_id]?.hidden
      ).map(entity => entity.entity_id),
    };
  }
}

export {AbstractView};
