// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { ActionConfig } from '../types/homeassistant/data/lovelace/config/action';
import { LovelaceCardConfig } from '../types/homeassistant/data/lovelace/config/card';
import { AreaCardConfig, StackCardConfig } from '../types/homeassistant/panels/lovelace/cards/types';
import { PersonCardConfig } from '../types/lovelace-mushroom/cards/person-card-config';
import { TemplateCardConfig } from '../types/lovelace-mushroom/cards/template-card-config';
import { isSupportedBadge } from '../types/strategy/strategy-generics';
import { ViewConfig } from '../types/strategy/strategy-views';
import { sanitizeClassName } from '../utilities/auxiliaries';
import { logMessage, lvlError, lvlInfo } from '../utilities/debug';
import { localize } from '../utilities/localize';
import AbstractView from './AbstractView';
import registryFilter from '../utilities/RegistryFilter';
import { stackHorizontal } from '../utilities/cardStacking';
import { LovelaceViewConfig } from '../types/homeassistant/data/lovelace/config/view';
import { LovelaceBadgeConfig } from '../types/homeassistant/data/lovelace/config/badge';

/**
 * Home View Class.
 *
 * Used to create a Home view.
 */
class HomeView extends AbstractView {
  /** The domain of the entities that the view is representing. */
  static readonly domain = 'home' as const;

  /**
   * Class constructor.
   *
   * @param {ViewConfig} [customConfiguration] Custom view configuration.
   */
  constructor(customConfiguration?: ViewConfig) {
    super();

    this.baseConfiguration = { ...this.baseConfiguration, ...HomeView.getDefaultConfig(), ...customConfiguration };
  }

  /** Returns the default configuration object for the view. */
  // TODO: Move type and max_columns to the abstract class.
  static getDefaultConfig(): ViewConfig {
    return {
      //type: 'sections',
      //max_columns: 4,
      header: {
        badges_position: 'top',
        layout: 'center',
      },
      title: localize('generic.home'),
      icon: 'mdi:home-assistant',
      path: 'home',
      subview: false,
    };
  }

  /**
   * Get a view configuration.
   *
   * The configuration includes the card configurations which are created by createCardConfigurations().
   */
  async getView(): Promise<LovelaceViewConfig> {
    return {
      ...this.baseConfiguration,
      badges: await this.createBadgeSection(),
      cards: await this.createCardConfigurations(),
    };
  }

  /**
   * Create the configuration of the cards to include in the view.
   *
   * @override
   */
  async createCardConfigurations(): Promise<LovelaceCardConfig[]> {
    const homeViewCards: LovelaceCardConfig[] = [];

    let personsSection, areasSection;

    try {
      [personsSection, areasSection] = await Promise.all([this.createPersonsSection(), this.createAreasSection()]);
    } catch (e) {
      logMessage(lvlError, 'Error importing created sections!', e);

      return homeViewCards;
    }

    if (personsSection) {
      homeViewCards.push(personsSection);
    }

    // Create the greeting section.
    if (!Registry.strategyOptions.home_view.hidden.includes('greeting')) {
      homeViewCards.push({
        type: 'custom:mushroom-template-card',
        primary: `{% set time = now().hour %}
           {% if (time >= 18) %}
             ${localize('generic.good_evening')},{{user}}!
           {% elif (time >= 12) %}
             ${localize('generic.good_afternoon')}, {{user}}!
           {% elif (time >= 6) %}
             ${localize('generic.good_morning')}, {{user}}!
           {% else %}
             ${localize('generic.hello')}, {{user}}! {% endif %}`,
        icon: 'mdi:hand-wave',
        icon_color: 'orange',
        tap_action: {
          action: 'none',
        } as ActionConfig,
        double_tap_action: {
          action: 'none',
        } as ActionConfig,
        hold_action: {
          action: 'none',
        } as ActionConfig,
      } as TemplateCardConfig);
    }

    if (Registry.strategyOptions.quick_access_cards) {
      homeViewCards.push(...Registry.strategyOptions.quick_access_cards);
    }

    if (areasSection) {
      homeViewCards.push(areasSection);
    }

    if (Registry.strategyOptions.extra_cards) {
      homeViewCards.push(...Registry.strategyOptions.extra_cards);
    }

    return [
      {
        type: 'vertical-stack',
        cards: homeViewCards,
      },
    ];
  }

  /**
   * Create a badge section to include in the view.
   *
   * If the section is marked as hidden in the strategy option, then the section is not created.
   */
  private async createBadgeSection(): Promise<LovelaceBadgeConfig[] | undefined> {
    if (Registry.strategyOptions.home_view.hidden.includes('badges')) {
      // The section is hidden.
      return;
    }

    const configurations: LovelaceBadgeConfig[] = [];
    const exposedBadges = Registry.getExposedNames('badge');

    let Badge;

    // Weather badge.
    // FIXME: It's not possible to hide the weather badge in the configuration.
    const weatherEntityId =
      Registry.strategyOptions.badges.weather_entity === 'auto'
        ? Registry.entities.find((entity) => entity.entity_id.startsWith('weather.'))?.entity_id
        : Registry.strategyOptions.badges.weather_entity;

    if (weatherEntityId) {
      try {
        Badge = (await import('../badges/WeatherBadge')).default;
        const weatherBadge = new Badge(weatherEntityId);

        configurations.push(weatherBadge.getConfiguration());
      } catch (e) {
        logMessage(lvlError, 'Error importing badge weather!', e);
      }
    } else {
      logMessage(lvlInfo, 'Weather badge has no entities available.');
    }

    // Numeric badges.
    for (const badgeName of exposedBadges) {
      if (!isSupportedBadge(badgeName) || !new registryFilter(Registry.entities).whereDomain(badgeName).count()) {
        logMessage(lvlInfo, `Badge for domain ${badgeName} is unsupported or has no entities available.`);

        continue;
      }

      const moduleName = sanitizeClassName(badgeName + 'Badge');

      try {
        Badge = (await import(`../badges/${moduleName}`)).default;
        const currentBadge = new Badge();

        configurations.push(currentBadge.getConfiguration());
      } catch (e) {
        logMessage(lvlError, `Error importing badge ${badgeName}!`, e);
      }
    }

    // Add extra badges.
    if (Registry.strategyOptions.badges?.extra_badges) {
      configurations.push(...Registry.strategyOptions.badges.extra_badges);
    }

    return configurations;
  }

  /**
   * Create a persons section to include in the view.
   *
   * If the section is marked as hidden in the strategy option, then the section is not created.
   */
  private async createPersonsSection(): Promise<StackCardConfig | undefined> {
    if (Registry.strategyOptions.home_view.hidden.includes('persons')) {
      // The section is hidden.

      return;
    }

    const cardConfigurations: PersonCardConfig[] = [];
    const PersonCard = (await import('../cards/PersonCard')).default;

    cardConfigurations.push(
      ...Registry.entities
        .filter((entity) => entity.entity_id.startsWith('person.'))
        .map((person) => new PersonCard(person).getCard())
    );

    return {
      type: 'vertical-stack',
      cards: stackHorizontal(
        cardConfigurations,
        Registry.strategyOptions.home_view.stack_count['persons'] ?? Registry.strategyOptions.home_view.stack_count['_']
      ),
    };
  }

  /**
   * Create the area cards to include in the view.
   *
   * Area cards are grouped into two areas per row.
   * If the section is marked as hidden in the strategy option, then the section is not created.
   */
  private async createAreasSection(): Promise<StackCardConfig | undefined> {
    if (Registry.strategyOptions.home_view.hidden.includes('areas')) {
      // Areas section is hidden.
      return;
    }

    const cardConfigurations: (TemplateCardConfig | AreaCardConfig)[] = [];

    for (const area of Registry.areas) {
      const moduleName =
        Registry.strategyOptions.areas[area.area_id]?.type ?? Registry.strategyOptions.areas['_']?.type ?? 'default';

      let AreaCard;

      try {
        AreaCard = (await import(`../cards/${moduleName}`)).default;
      } catch (e) {
        // Fallback to the default strategy card.
        AreaCard = (await import('../cards/AreaCard')).default;

        if (Registry.strategyOptions.debug && moduleName !== 'default') {
          logMessage(lvlError, `Error importing ${moduleName}: card!`, e);
        }
      }

      cardConfigurations.push(
        new AreaCard(area, {
          ...Registry.strategyOptions.areas['_'],
          ...Registry.strategyOptions.areas[area.area_id],
        }).getCard()
      );
    }

    return {
      type: 'vertical-stack',
      title: Registry.strategyOptions.home_view.hidden.includes('areasTitle') ? undefined : localize('generic.areas'),
      cards: stackHorizontal(cardConfigurations, Registry.strategyOptions.home_view.stack_count['_'], {
        'custom:mushroom-template-card': Registry.strategyOptions.home_view.stack_count.areas?.[0],
        area: Registry.strategyOptions.home_view.stack_count.areas?.[1],
      }),
    };
  }
}

export default HomeView;
