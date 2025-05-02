// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { Registry } from '../Registry';
import { ActionConfig } from '../types/homeassistant/data/lovelace/config/action';
import { LovelaceCardConfig } from '../types/homeassistant/data/lovelace/config/card';
import { AreaCardConfig, StackCardConfig } from '../types/homeassistant/panels/lovelace/cards/types';
import { ChipsCardConfig } from '../types/lovelace-mushroom/cards/chips-card';
import { PersonCardConfig } from '../types/lovelace-mushroom/cards/person-card-config';
import { TemplateCardConfig } from '../types/lovelace-mushroom/cards/template-card-config';
import { LovelaceChipConfig } from '../types/lovelace-mushroom/utils/lovelace/chip/types';
import { HomeViewSections, isSupportedChip } from '../types/strategy/strategy-generics';
import { ViewConfig } from '../types/strategy/strategy-views';
import { sanitizeClassName } from '../utilities/auxiliaries';
import { logMessage, lvlError, lvlInfo } from '../utilities/debug';
import { localize } from '../utilities/localize';
import AbstractView from './AbstractView';
import registryFilter from '../utilities/RegistryFilter';
import { stackHorizontal } from '../utilities/cardStacking';

/**
 * Home View Class.
 *
 * Used to create a Home view.
 */
class HomeView extends AbstractView {
  /** The domain of the entities that the view is representing. */
  static readonly domain = 'home' as const;

  /** Returns the default configuration object for the view. */
  static getDefaultConfig(): ViewConfig {
    return {
      title: localize('generic.home'),
      icon: 'mdi:home-assistant',
      path: 'home',
      subview: false,
    };
  }

  /**
   * Class constructor.
   *
   * @param {ViewConfig} [customConfiguration] Custom view configuration.
   */
  constructor(customConfiguration?: ViewConfig) {
    super();

    this.baseConfiguration = { ...this.baseConfiguration, ...HomeView.getDefaultConfig(), ...customConfiguration };
  }

  /**
   * Create the configuration of the cards to include in the view.
   *
   * @override
   */
  async createCardConfigurations(): Promise<LovelaceCardConfig[]> {
    const homeViewCards: LovelaceCardConfig[] = [];

    let chipsSection, personsSection, areasSection;

    try {
      [chipsSection, personsSection, areasSection] = await Promise.all([
        this.createChipsSection(),
        this.createPersonsSection(),
        this.createAreasSection(),
      ]);
    } catch (e) {
      logMessage(lvlError, 'Error importing created sections!', e);

      return homeViewCards;
    }

    if (chipsSection) {
      homeViewCards.push(chipsSection);
    }

    if (personsSection) {
      homeViewCards.push(personsSection);
    }

    // Create the greeting section.
    if (!('greeting' in Registry.strategyOptions.home_view.hidden)) {
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

    return homeViewCards;
  }

  /**
   * Create a chip section to include in the view
   *
   * If the section is marked as hidden in the strategy option, then the section is not created.
   */
  private async createChipsSection(): Promise<ChipsCardConfig | undefined> {
    if ((Registry.strategyOptions.home_view.hidden as string[]).includes('chips')) {
      // The section is hidden.
      return;
    }

    const chipConfigurations: LovelaceChipConfig[] = [];
    const exposedChips = Registry.getExposedNames('chip');

    let Chip;

    // Weather chip.
    // FIXME: It's not possible to hide the weather chip in the configuration.
    const weatherEntityId =
      Registry.strategyOptions.chips.weather_entity === 'auto'
        ? Registry.entities.find((entity) => entity.entity_id.startsWith('weather.'))?.entity_id
        : Registry.strategyOptions.chips.weather_entity;

    if (weatherEntityId) {
      try {
        Chip = (await import('../chips/WeatherChip')).default;
        const weatherChip = new Chip(weatherEntityId);

        chipConfigurations.push(weatherChip.getChipConfiguration());
      } catch (e) {
        logMessage(lvlError, 'Error importing chip weather!', e);
      }
    } else {
      logMessage(lvlInfo, 'Weather chip has no entities available.');
    }

    // Numeric chips.
    for (const chipName of exposedChips) {
      if (!isSupportedChip(chipName) || !new registryFilter(Registry.entities).whereDomain(chipName).count()) {
        logMessage(lvlInfo, `Chip for domain ${chipName} is unsupported or has no entities available.`);

        continue;
      }

      const moduleName = sanitizeClassName(chipName + 'Chip');

      try {
        Chip = (await import(`../chips/${moduleName}`)).default;
        const currentChip = new Chip();

        chipConfigurations.push(currentChip.getChipConfiguration());
      } catch (e) {
        logMessage(lvlError, `Error importing chip ${chipName}!`, e);
      }
    }

    // Add extra chips.
    if (Registry.strategyOptions.chips?.extra_chips) {
      chipConfigurations.push(...Registry.strategyOptions.chips.extra_chips);
    }

    return {
      type: 'custom:mushroom-chips-card',
      alignment: 'center',
      chips: chipConfigurations,
    };
  }

  /**
   * Create a persons section to include in the view.
   *
   * If the section is marked as hidden in the strategy option, then the section is not created.
   */
  private async createPersonsSection(): Promise<StackCardConfig | undefined> {
    if ((Registry.strategyOptions.home_view.hidden as string[]).includes('persons')) {
      // The section is hidden.

      return;
    }

    const cardConfigurations: PersonCardConfig[] = [];
    const PersonCard = (await import('../cards/PersonCard')).default;

    cardConfigurations.push(
      ...Registry.entities
        .filter((entity) => entity.entity_id.startsWith('person.'))
        .map((person) => new PersonCard(person).getCard()),
    );

    return {
      type: 'vertical-stack',
      cards: stackHorizontal(cardConfigurations),
    };
  }

  /**
   * Create the area cards to include in the view.
   *
   * Area cards are grouped into two areas per row.
   * If the section is marked as hidden in the strategy option, then the section is not created.
   */
  private async createAreasSection(): Promise<StackCardConfig | undefined> {
    if ((Registry.strategyOptions.home_view.hidden as string[]).includes('areas')) {
      // Areas section is hidden.

      return;
    }

    const cardConfigurations: (TemplateCardConfig | AreaCardConfig)[] = [];

    let onlyDefaultCards = true;

    for (const area of Registry.areas) {
      const moduleName =
        Registry.strategyOptions.areas[area.area_id]?.type ?? Registry.strategyOptions.areas['_']?.type ?? 'default';

      let AreaCard;

      onlyDefaultCards = onlyDefaultCards && moduleName === 'default';

      try {
        AreaCard = (await import(`../cards/${moduleName}`)).default;
      } catch (e) {
        // Fallback to the default strategy card.
        AreaCard = (await import('../cards/AreaCard')).default;

        if (Registry.strategyOptions.debug && moduleName !== 'default') {
          logMessage(lvlError, `Error importing ${moduleName}: card!`, e);
        }
      }

      cardConfigurations.push(new AreaCard(area).getCard());
    }

    // FIXME: The columns are too narrow when having HASS area cards.
    return {
      type: 'vertical-stack',
      title: (Registry.strategyOptions.home_view.hidden as HomeViewSections[]).includes('areasTitle')
        ? undefined
        : localize('generic.areas'),
      cards: stackHorizontal(cardConfigurations, { area: 1, 'custom:mushroom-template-card': 2 }),
    };
  }
}

export default HomeView;
