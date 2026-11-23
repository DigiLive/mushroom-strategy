// noinspection JSUnusedGlobalSymbols Class is dynamically imported.

import { TemplateCardConfig } from '@digilive/lovelace-mushroom-types';

import { CustomCardConfig } from '../types/strategy/strategy-cards';
import { RegistryEntry } from '../types/strategy/strategy-generics';

import { localize } from '../utilities/localize';

import AbstractCard from './AbstractCard';

/**
 * Greeting Card Class
 *
 * Used to create a card configuration to greet the current user.
 */
class GreetingCard extends AbstractCard<TemplateCardConfig> {
  /**
   * Class constructor.
   *
   * @param {CustomCardConfig<TemplateCardConfig>} [customConfiguration] Custom card configuration overrides.
   */
  public constructor(customConfiguration?: CustomCardConfig<TemplateCardConfig>) {
    // Pass a non-entity RegistryEntry so getCard() returns TemplateCardConfig without an entity property.
    super({} as RegistryEntry, customConfiguration);
  }

  /** Returns the default configuration object for the card. */
  protected getDefaultConfig(): Partial<TemplateCardConfig> {
    return {
      type: 'custom:mushroom-template-card',
      primary: `{% set time = now().hour %}
           {% if (time >= 18) %}
             ${localize('generic.good_evening')}, {{user}}!
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
      },
      double_tap_action: {
        action: 'none',
      },
      hold_action: {
        action: 'none',
      },
    };
  }
}

export default GreetingCard;
