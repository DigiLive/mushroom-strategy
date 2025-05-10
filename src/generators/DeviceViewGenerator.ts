import { ViewInfo } from '../types/strategy/strategy-generics';
import { LovelaceViewConfig } from '../types/homeassistant/data/lovelace/config/view';
import { isDeviceRegistryEntry } from '../types/strategy/type-guards';
import { logMessage, lvlFatal } from '../utilities/debug';
import DeviceCardsGenerator from './DeviceCardsGenerator';

/**
 * Class responsible for generating a Device view in the Home Assistant UI.
 *
 * The generator creates cards for each entity (e.g., sensors, switches, etc.) of a device.
 * It uses a combination of Header cards and entity-specific cards, and it handles miscellaneous entities
 * that do not fit into any supported domain.
 *
 * @remarks
 * This class is instantiated with a device registry entry and is used to generate the view when a subview is opened.
 */
class DeviceViewGenerator extends HTMLTemplateElement {
  /**
   * Generates a view for a Home Assistant device.
   *
   * The view is generated as a list of cards, one for each entity of the current device.
   * If the parent entity associated with the view is not recognized as a device, an error is thrown.
   *
   * @param {ViewInfo} info - The object with information about the current view.
   */
  static async generateView(info: ViewInfo): Promise<LovelaceViewConfig> {
    const parentEntity = info.view.strategy.parentEntry;

    if (!isDeviceRegistryEntry(parentEntity)) {
      logMessage(lvlFatal, `Entry ${parentEntity?.area_id} is not recognized as a device!`);
      throw new Error();
    }

    return {
      cards: (await new DeviceCardsGenerator(parentEntity).getCards()) || [],
    };
  }
}

export default DeviceViewGenerator;
