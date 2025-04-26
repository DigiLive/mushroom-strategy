import { HassServiceTarget } from 'home-assistant-js-websocket';
import { LovelaceCardConfig } from '../types/homeassistant/data/lovelace/config/card';
import { StackCardConfig } from '../types/homeassistant/panels/lovelace/cards/types';
import { CustomHeaderCardConfig, StrategyHeaderCardConfig } from '../types/strategy/strategy-cards';

/**
 * Header Card class.
 *
 * Used to create a card configuration for a Header Card.
 * The card can be used to describe a group of cards and optionally to control multiple entities.
 */
class HeaderCard {
  /** The target to control the entities of. */
  private readonly target: HassServiceTarget;
  /** The current configuration of the card after instantiating this class. */
  private readonly configuration: StrategyHeaderCardConfig;

  /** Returns the default configuration object for the card. */
  static getDefaultConfig(): StrategyHeaderCardConfig {
    return {
      type: 'custom:mushroom-title-card',
      showControls: true,
      iconOn: 'mdi:power-on',
      iconOff: 'mdi:power-off',
      onService: 'none',
      offService: 'none',
    };
  }

  /**
   * Class constructor.
   *
   * @param {HassServiceTarget} target The target which is optionally controlled by the card.
   * @param {CustomHeaderCardConfig} [customConfiguration] Custom card configuration.
   *
   * @remarks
   * The target object can contain one or multiple ids of different entry types.
   */
  constructor(target: HassServiceTarget, customConfiguration?: CustomHeaderCardConfig) {
    this.target = target;
    this.configuration = { ...HeaderCard.getDefaultConfig(), ...customConfiguration };
  }

  /**
   * Create a Header card configuration.
   *
   * @remarks
   * The card is represented by a horizontal stack of cards.
   * One title card and optionally two template cards to control entities.
   */
  createCard(): StackCardConfig {
    // Create a title card.
    const cards: LovelaceCardConfig[] = [
      {
        type: 'custom:mushroom-title-card',
        title: this.configuration.title,
        subtitle: this.configuration.subtitle,
      },
    ];

    // Add controls to the card.
    if (this.configuration.showControls) {
      cards.push({
        type: 'horizontal-stack',
        cards: [
          {
            type: 'custom:mushroom-template-card',
            icon: this.configuration.iconOff,
            layout: 'vertical',
            icon_color: 'red',
            tap_action: {
              action: 'call-service',
              service: this.configuration.offService,
              target: this.target,
              data: {},
            },
          },
          {
            type: 'custom:mushroom-template-card',
            icon: this.configuration.iconOn,
            layout: 'vertical',
            icon_color: 'amber',
            tap_action: {
              action: 'call-service',
              service: this.configuration.onService,
              target: this.target,
              data: {},
            },
          },
        ],
      });
    }

    return {
      type: 'horizontal-stack',
      cards: cards,
    };
  }
}

export default HeaderCard;
