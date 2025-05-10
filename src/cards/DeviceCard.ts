// noinspection JSUnusedGlobalSymbols Class is dynamically imported.
import AbstractCard from './AbstractCard';
import { TemplateCardConfig } from '../types/lovelace-mushroom/cards/template-card-config';
import { localize } from '../utilities/localize';
import { DeviceRegistryEntry } from '../types/homeassistant/data/device_registry';
import RegistryFilter from '../utilities/RegistryFilter';
import { Registry } from '../Registry';

/**
 * Device Card Class
 *
 * Used to create a card for a device.
 *
 * @class
 * @extends AbstractCard
 */
class DeviceCard extends AbstractCard {
  /**
   * Class constructor.
   *
   * @param {DeviceRegistryEntry} device The device entity to create a card for.
   * @param {TemplateCardConfig} [customConfiguration] Options for the card.
   *
   * @throws {Error} If the Helper module isn't initialized.
   */
  constructor(device: DeviceRegistryEntry, customConfiguration?: TemplateCardConfig) {
    super(device);

    const configuration = DeviceCard.getDefaultConfig();
    const deviceName = device.name_by_user ?? device.name ?? localize('generic.unnamed', 'title');
    const integration = new RegistryFilter(Registry.configEntries)
      .where((entry) => entry.entry_id === device.config_entries[0])
      .single();

    // Initialize the default configuration.
    configuration.primary = `${localize('generic.device', 'title')}: ${deviceName}`;

    if (integration) {
      const iconBaseUrl = `https://brands.home-assistant.io/_/${integration.domain}/`;
      configuration.picture = Registry.darkMode ? `${iconBaseUrl}dark_icon.png` : `${iconBaseUrl}icon.png`;
    }

    if (configuration.tap_action && 'navigation_path' in configuration.tap_action) {
      configuration.tap_action.navigation_path = device.id;
    }

    this.configuration = { ...this.configuration, ...configuration, ...customConfiguration };
  }

  /** Returns the default configuration object for the card. */
  static getDefaultConfig(): TemplateCardConfig {
    return {
      type: 'custom:mushroom-template-card',
      primary: undefined,
      secondary: localize('generic.tap_here', 'title') + '…',
      icon: 'mdi:view-dashboard-outline',
      icon_color: 'blue',
      tap_action: {
        action: 'navigate',
        navigation_path: '',
      },
      hold_action: {
        action: 'none',
      },
    };
  }
}

export { DeviceCard };
