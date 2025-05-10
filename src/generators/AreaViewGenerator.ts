import { ViewInfo } from '../types/strategy/strategy-generics';
import { LovelaceViewConfig } from '../types/homeassistant/data/lovelace/config/view';
import { isAreaRegistryEntry } from '../types/strategy/type-guards';
import { logMessage, lvlFatal } from '../utilities/debug';
import AreaCardsGenerator from './AreaCardsGenerator';

/**
 * Class responsible for generating an Area view in the Home Assistant UI.
 *
 * The generator creates cards for each domain (e.g., sensors, switches, etc.) in the current area.
 * It uses a combination of Header cards and entity-specific cards, and it handles miscellaneous entities
 * that do not fit into any supported domain.
 *
 * @remarks
 * This class is instantiated with an area registry entry and is used to generate the view when a subview is opened.
 */
class AreaViewGenerator extends HTMLTemplateElement {
  /**
   * Generates a view for a Home Assistant area.
   *
   * The view is generated as a list of cards, one for each domain in the current area.
   * If the parent entity associated with the view is not recognized as an area, an error is thrown.
   *
   * @param {ViewInfo} info - The object with information about the current view.
   */
  static async generateView(info: ViewInfo): Promise<LovelaceViewConfig> {
    const parentEntity = info.view.strategy.parentEntry;

    if (!isAreaRegistryEntry(parentEntity)) {
      logMessage(lvlFatal, `Entry ${parentEntity?.id} is not recognized as an area!`);
      throw new Error();
    }

    return {
      cards: (await new AreaCardsGenerator(parentEntity).getCards()) || [],
    };
  }
}

export default AreaViewGenerator;
