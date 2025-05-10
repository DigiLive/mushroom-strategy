import { HassServiceTarget } from 'home-assistant-js-websocket';
import { LovelaceCardConfig } from '../types/homeassistant/data/lovelace/config/card';
import { StackCardConfig } from '../types/homeassistant/panels/lovelace/cards/types';
import { HeaderCardConfig } from '../types/strategy/strategy-cards';
import { localize } from '../utilities/localize';

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
  private readonly configuration: HeaderCardConfig;

  /**
   * Class constructor.
   *
   * @param {HassServiceTarget} target The target which is optionally controlled by the card.
   * @param {HeaderCardConfig} [customConfiguration] Custom card configuration.
   *
   * @remarks
   * The target object can contain one or multiple ids of different entry types.
   */
  constructor(target: HassServiceTarget, customConfiguration?: HeaderCardConfig) {
    this.target = target;
    this.configuration = { ...HeaderCard.getDefaultConfig(), ...customConfiguration };
  }

  /** Returns the default configuration object for the card. */
  static getDefaultConfig(): HeaderCardConfig {
    return {
      type: 'custom:mushroom-title-card',
      showControls: false,
      on: {
        icon: 'mdi:power-on',
        icon_color: 'disabled',
        service: 'none',
      },
      off: {
        icon: 'mdi:power-off',
        icon_color: 'disabled',
        service: 'none',
      },
      title: localize('generic.unknown', 'title'),
    };
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
            icon: this.configuration.on?.icon,
            layout: 'vertical',
            icon_color: 'green',
            tap_action: {
              action: 'call-service',
              service: this.configuration.on?.service,
              target: this.target,
              data: {},
            },
          },
          {
            type: 'custom:mushroom-template-card',
            icon: this.configuration.off?.icon,
            layout: 'vertical',
            icon_color: 'deep-orange',
            tap_action: {
              action: 'call-service',
              service: this.configuration.off?.service,
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
