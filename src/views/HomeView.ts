// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
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
import { LovelaceViewConfig } from '../types/homeassistant/data/lovelace/config/view';
import { LovelaceBadgeConfig } from '../types/homeassistant/data/lovelace/config/badge';
import { LovelaceSectionRawConfig } from '../types/homeassistant/data/lovelace/config/section';
import HeaderCard from '../cards/HeaderCard';
import { stackHorizontal } from '../utilities/cardStacking';
import { LovelaceCardConfig } from '../types/homeassistant/data/lovelace/config/card';
import GreetingCard from '../cards/GreetingCard';

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
      type: 'sections',
      max_columns: 3,
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
   * The configuration includes the card configurations which are created by createSections().
   */
  async getView(): Promise<LovelaceViewConfig> {
    return {
      ...this.baseConfiguration,
      badges: await this.createBadgeSection(),
      sections: await this.createSections(),
    };
  }

  /**
   * Create the configuration of the cards to include in the view.
   *
   * @override
   */
  async createSections(): Promise<LovelaceSectionRawConfig[]> {
    const MEDIA_QUERY = {
      SMALL: '(max-width: 1343px)',
      LARGE: '(min-width: 1344px)',
    };
    const sections: LovelaceSectionRawConfig[] = [];

    const addSection = (title: string, cards: LovelaceCardConfig[], mediaQuery?: string) => {
      const section: LovelaceSectionRawConfig = {
        type: 'grid',
        /*title: title,*/ // TODO: Property is deprecated.
        cards: cards,
      };

      if (mediaQuery) {
        section.visibility = [
          {
            condition: 'screen',
            media_query: mediaQuery,
          },
        ];
      }

      sections.push(section);
    };

    try {
      const [personCards, areaCards] = await Promise.all([this.createPersonCards(), this.createAreaCards()]);

      const sectionConfigurations = [
        ['Persons', [personCards], MEDIA_QUERY.SMALL, !!personCards],
        ['Quick Access Wide', Registry.strategyOptions.quick_access_cards, MEDIA_QUERY.LARGE, true],
        [
          'Persons and Areas',
          [personCards, areaCards].filter(Boolean),
          MEDIA_QUERY.LARGE,
          !!(personCards ?? areaCards),
        ],
        ['Quick Access Narrow', Registry.strategyOptions.quick_access_cards, MEDIA_QUERY.SMALL, true],
        ['Areas', [areaCards], MEDIA_QUERY.SMALL, !!areaCards],
        ['Extra', Registry.strategyOptions.extra_cards, undefined, true],
      ] as const;

      sectionConfigurations.forEach(([title, cards, mediaQuery, condition]) => {
        if (condition && cards.length) {
          addSection(title, cards as LovelaceCardConfig[], mediaQuery);
          return;
        }
        logMessage(lvlInfo, `Section ${title} has no entities available.`);
      });
    } catch (e) {
      logMessage(lvlError, 'Error importing section cards!', e);
    }

    return sections;
  }

  /**
   * Create a badge section to include in the view.
   *
   * If the section is marked as hidden in the strategy option, then the section is not created.
   */
  private async createBadgeSection(): Promise<LovelaceBadgeConfig[] | undefined> {
    if (Registry.strategyOptions.home_view.hidden.badges) {
      logMessage(lvlInfo, 'Badges are hidden.');
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
  private async createPersonCards(): Promise<StackCardConfig | undefined> {
    if (Registry.strategyOptions.home_view.hidden.persons) {
      logMessage(lvlInfo, 'Persons section is hidden.');
      return;
    }

    const greetingHidden = Registry.strategyOptions.home_view.hidden.greeting;

    if (greetingHidden) {
      logMessage(lvlInfo, 'Greeting card is hidden.');
    }

    const greetingCard = greetingHidden ? undefined : new GreetingCard().getCard();
    const cardConfigurations: PersonCardConfig[] = [];
    const PersonCard = (await import('../cards/PersonCard')).default;

    cardConfigurations.push(
      ...Registry.entities
        .filter((entity) => entity.entity_id.startsWith('person.'))
        .map((person) => new PersonCard(person).getCard())
    );

    return {
      type: 'vertical-stack',
      grid_options: {
        columns: 'full',
      },
      cards: stackHorizontal(
        greetingCard ? [greetingCard, ...cardConfigurations] : cardConfigurations,
        Registry.strategyOptions.home_view.stack_count['persons'] ?? Registry.strategyOptions.home_view.stack_count['_']
      ),
    };
  }

  /**
   * Create the area cards to include in the view.
   *
   * If the section is marked as hidden in the strategy option, then the section is not created.
   */
  private async createAreaCards(): Promise<StackCardConfig | undefined> {
    if (Registry.strategyOptions.home_view.hidden.areas) {
      logMessage(lvlInfo, 'Areas section is hidden.');
      return;
    }

    const titleHidden = Registry.strategyOptions.home_view.hidden.areasTitle;

    if (titleHidden) {
      logMessage(lvlInfo, 'Greeting titleHidden is hidden.');
    }

    const titleCard = titleHidden ? undefined : new HeaderCard({}, { title: localize('generic.areas') }).createCard();
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
      grid_options: {
        columns: 'full',
      },
      cards: stackHorizontal(
        titleCard ? [titleCard, ...cardConfigurations] : cardConfigurations,
        Registry.strategyOptions.home_view.stack_count['_'],
        {
          'custom:mushroom-template-card': Registry.strategyOptions.home_view.stack_count.areas?.[0],
          area: Registry.strategyOptions.home_view.stack_count.areas?.[1],
        }
      ),
    };
  }
}

export default HomeView;
