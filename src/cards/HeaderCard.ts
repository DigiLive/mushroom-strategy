// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { LovelaceCardConfig, StackCardConfig } from '@digilive/home-assistant-frontend-types';
import { HassServiceTarget } from 'home-assistant-js-websocket';

import { CustomHeaderCardConfig, StrategyHeaderCardConfig } from '../types/strategy/strategy-cards';

/**
 * Header Card Class
 *
 * Used to create a card configuration for a Header Card.
 * The card can be used to describe a group of cards and optionally to control multiple entities.
 */
class HeaderCard {
  /** The target to control the entities of. */
  protected readonly target: HassServiceTarget;

  /** The card configuration. */
  protected configuration: StrategyHeaderCardConfig;

  /**
   * Class constructor.
   *
   * @param {HassServiceTarget} target The target which is optionally controlled by the card.
   * @param {CustomHeaderCardConfig} [customConfiguration] Custom card configuration overrides.
   *
   * @remarks
   * The target object can contain one or multiple ids of different entry types.
   */
  public constructor(target: HassServiceTarget, customConfiguration?: CustomHeaderCardConfig) {
    this.target = target;

    const { hidden: _hidden, ...customCardConfig } = customConfiguration ?? {};

    this.configuration = {
      ...this.getDefaultConfig(),
      ...customCardConfig,
    } as StrategyHeaderCardConfig;
  }

  /**
   * Get the card configuration.
   *
   * @remarks
   * The card is represented by a horizontal stack of cards: one title card and optionally
   * two template cards to control entities.
   */
  public getCard(): StackCardConfig {
    const cards: LovelaceCardConfig[] = [
      {
        type: 'custom:mushroom-title-card',
        title: this.configuration.title,
        subtitle: this.configuration.subtitle,
      },
    ];

    if (this.configuration.show_controls) {
      cards.push({
        type: 'horizontal-stack',
        cards: [
          {
            type: 'custom:mushroom-template-card',
            icon: this.configuration.iconOff,
            layout: 'vertical',
            icon_color: 'red',
            tap_action: {
              action: 'perform-action',
              perform_action: this.configuration.offService,
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
              action: 'perform-action',
              perform_action: this.configuration.onService,
              target: this.target,
              data: {},
            },
          },
        ],
      });
    }

    return {
      type: 'horizontal-stack',
      cards,
    };
  }

  /** Returns the default configuration object for the card. */
  protected getDefaultConfig(): Partial<StrategyHeaderCardConfig> {
    return {
      type: 'custom:mushroom-title-card',
      iconOn: 'mdi:power-on',
      iconOff: 'mdi:power-off',
      onService: 'none',
      offService: 'none',
    };
  }
}

export default HeaderCard;
