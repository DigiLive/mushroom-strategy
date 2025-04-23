import { LovelaceCardConfig } from '../../homeassistant/data/lovelace/config/card';
import { ActionsSharedConfig } from '../shared/config/actions-config';
import { AppearanceSharedConfig } from '../shared/config/appearance-config';

/**
 * Template Card Configuration
 *
 * @property {string} [entity] - Entity associated with the card.
 * @property {string} [icon] - Icon to render. May contain templates.
 * @property {string} [icon_color] - Icon color to render. May contain templates.
 * @property {string} [primary] - Primary info to render. May contain templates.
 * @property {string} [secondary] - Secondary info to render. May contain templates.
 * @property {string} [badge_icon] - Badge icon to render. May contain templates.
 * @property {string} [badge_color] - Badge icon color to render. May contain templates.
 * @property {string} [picture] - The picture to render. May contain templates.
 * @property {boolean} [multiline_secondary] - Enables support for multiline text for the secondary info.
 * @property {string | string[]} [entity_id] - Only reacts to the state changes of these entities. This can be used if
 *                                             the automatic analysis fails to find all relevant entities.
 *
 * @see https://github.com/piitaya/lovelace-mushroom/blob/main/docs/cards/template.md
 */
export type TemplateCardConfig = LovelaceCardConfig &
  AppearanceSharedConfig &
  ActionsSharedConfig & {
    entity?: string;
    icon?: string;
    icon_color?: string;
    primary?: string;
    secondary?: string;
    badge_icon?: string;
    badge_color?: string;
    picture?: string;
    multiline_secondary?: boolean;
    entity_id?: string | string[];
  };
