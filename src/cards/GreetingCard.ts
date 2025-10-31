// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { localize } from '../utilities/localize';
import { ActionConfig } from '../types/homeassistant/data/lovelace/config/action';
import { TemplateCardConfig } from '../types/lovelace-mushroom/cards/template-card-config';

/**
 * Greeting Card Class
 *
 * Used to create a card configuration to greet the current user.
 */
class GreetingCard {
  /**
   * The card configuration.
   */
  protected configuration: TemplateCardConfig = {
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
  };

  /**
   * Class constructor.
   *
   * @param {TemplateCardConfig} [customConfiguration] Custom card configuration.
   */
  constructor(customConfiguration?: TemplateCardConfig) {
    this.configuration = { ...this.configuration, ...customConfiguration };
  }

  /**
   * Get the card configuration.
   */
  getCard(): TemplateCardConfig {
    return this.configuration;
  }
}

export default GreetingCard;
