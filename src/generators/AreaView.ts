import { ViewInfo } from '../types/strategy/strategy-generics';
import { LovelaceViewConfig } from '../types/homeassistant/data/lovelace/config/view';
import RegistryFilter from '../utilities/RegistryFilter';
import { Registry } from '../Registry';
import { generateDomainCards } from './domainCardGenerator';
import { isAreaRegistryEntry } from '../types/strategy/type-guards';
import { logMessage, lvlFatal } from '../utilities/debug';

class AreaView extends HTMLTemplateElement {
  /**
   * Generate an Area view.
   *
   * The method creates cards for each domain (e.g., sensors, switches, etc.) in the current area, using a combination
   * of Header cards and entity-specific cards.
   * It also handles miscellaneous entities that don't fit into any supported domain.
   *
   * @param {ViewInfo} info The view's strategy information object.
   *
   * @remarks
   * Called upon opening a subview.
   */
  static async generateView(info: ViewInfo): Promise<LovelaceViewConfig> {
    const parentEntity = info.view.strategy.parentEntry;

    if (!isAreaRegistryEntry(parentEntity)) {
      logMessage(lvlFatal, `Entity ${parentEntity?.area_id} is not recognized as an area!`);
      throw new Error();
    }

    return {
      cards: await generateDomainCards(
        Registry.getExposedNames('domain'),
        new RegistryFilter(Registry.entities).whereAreaId(parentEntity.area_id).toList(),
      ),
    };
  }
}

export default AreaView;
