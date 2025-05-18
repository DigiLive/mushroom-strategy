import { Registry } from './Registry';
import { LovelaceConfig } from './types/homeassistant/data/lovelace/config/types';
import { LovelaceViewConfig } from './types/homeassistant/data/lovelace/config/view';
import { DashboardInfo, isSupportedView } from './types/strategy/strategy-generics';
import { filterNonNullValues, sanitizeClassName } from './utilities/auxiliaries';
import { logMessage, lvlError, lvlFatal } from './utilities/debug';
import AreaViewGenerator from './generators/AreaViewGenerator';
import RegistryFilter from './utilities/RegistryFilter';
import { localize } from './utilities/localize';
import DeviceViewGenerator from './generators/DeviceViewGenerator';

/**
 * Mushroom Dashboard Strategy.<br>
 * <br>
 * Mushroom dashboard strategy provides a strategy for Home-Assistant to create a dashboard automatically.<br>
 * The strategy makes use Mushroom and Mini Graph cards to represent your entities.
 *
 * @see https://github.com/DigiLive/mushroom-strategy
 */
class MushroomStrategy extends HTMLTemplateElement {
  /**
   * Generate a dashboard.
   *
   * This method creates views for each exposed domain and area.
   * It also adds custom views if specified in the strategy options.
   *
   * @param {DashboardInfo} info Dashboard strategy information object.
   *
   * @remarks
   * Called when opening a dashboard.
   */
  static async generateDashboard(info: DashboardInfo): Promise<LovelaceConfig> {
    try {
      await Registry.initialize(info);
    } catch (e) {
      logMessage(lvlFatal, 'Error initializing the Registry!', e);
    }

    // Main views.
    const viewPromises = [...Registry.getExposedNames('view')].filter(isSupportedView).map(async (viewName) => {
      try {
        const moduleName = sanitizeClassName(`${viewName}View`);
        const View = (await import(`./views/${moduleName}`)).default;
        const currentView = new View(Registry.strategyOptions.views[viewName]);
        const viewConfiguration = await currentView.getView();

        if (viewConfiguration.cards.length) {
          return viewConfiguration;
        }
      } catch (e) {
        logMessage(lvlError, `Error importing ${viewName} view!`, e);
      }

      return null;
    });

    const views = filterNonNullValues(await Promise.all(viewPromises)) as LovelaceViewConfig[];

    // Device views.
    const devices = new RegistryFilter(Registry.devices)
      .where((device) => Registry.groupingDeviceIds.has(device.id))
      .toList();

    const deviceViews = devices.map((device) => {
      const deviceName = device.name_by_user || device.name || localize('generic.unknown', 'title');

      return {
        title: `${localize('generic.device', 'title')}: ${deviceName}`,
        path: device.id,
        subview: true,
        icon: 'mdi:devices',
        strategy: {
          type: 'custom:mushroom-strategy-device-view',
          parentEntry: device,
        },
      };
    });

    views.push(...deviceViews);

    if (devices.length && !customElements.get('ll-strategy-mushroom-strategy-device-view')) {
      customElements.define('ll-strategy-mushroom-strategy-device-view', DeviceViewGenerator);
    }

    // Area views.
    views.push(
      ...Registry.areas.map((area) => ({
        title: area.name,
        path: area.area_id,
        subview: true,
        strategy: {
          type: 'custom:mushroom-strategy-area-view',
          parentEntry: area,
        },
      })),
    );

    if (Registry.areas.length && !customElements.get('ll-strategy-mushroom-strategy-area-view')) {
      customElements.define('ll-strategy-mushroom-strategy-area-view', AreaViewGenerator);
    }

    // Extra views
    if (Registry.strategyOptions.extra_views) {
      views.push(...Registry.strategyOptions.extra_views);
    }

    return { views };
  }
}

async function main() {
  const version = 'v2.3.0-alpha.1';

  console.info(
    '%c Mushroom Strategy %c '.concat(version, ' '),
    'color: white; background: coral; font-weight: 700;',
    'color: coral; background: white; font-weight: 700;',
  );

  try {
    customElements.define('ll-strategy-mushroom-strategy', MushroomStrategy);
  } catch (e) {
    logMessage(lvlFatal, 'Error defining the Strategy element!', e);
  }
}

main().catch((_) => {
  throw 'Mushroom Strategy - An error occurred. Check the console (F12) for details.';
});
