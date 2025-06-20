import { HomeAssistant } from '../types/homeassistant/types';
import { logMessage, lvlDebug, lvlError, lvlInfo } from './debug';

/**
 * Configuration options for persistent notifications.
 *
 * @property {string} [title] The title to display in the notification.
 * @property {string} [storageKey] The key name for storing the notification state into local storage.
 * @property {string} [version] Version string for the notification.
 * @property {string} hassId User-defined id of the notification in Home Assistant.
 */
interface NotificationOptions {
  title?: string;
  storageKey?: string;
  version?: string;
  hassId?: string;
}

/**
 * Represents a notification's state in storage.
 *
 * @property {boolean} shown Whether the notification has been shown to the user.
 * @property {string} timestamp timestamp of when the notification was last shown.
 * @property {string} version Version of the notification when it was stored.
 * @property {string} hassId Id of the notification in Home Assistant.
 */
interface StoredNotification {
  shown: boolean;
  timestamp: string;
  version: string;
  hassId?: string;
}

/**
 * A utility class for managing persistent notifications in Home Assistant.
 * Handles showing, dismissing and tracking notifications to prevent duplicates.
 *
 * Notifications are stored in localStorage and can be versioned.
 *
 * @see https://www.home-assistant.io/integrations/persistent_notification/
 */
export class PersistentNotification {
  private static readonly DEFAULT_NAMESPACE = 'mushroom_strategy';
  private static readonly DEFAULT_TITLE = 'Mushroom Strategy Notification';

  private readonly hass: HomeAssistant;
  private readonly namespace: string;

  /**
   * Constructs a new PersistentNotification instance.
   *
   * @param hass The Home Assistant instance for interacting with the Home Assistant API.
   * @param namespace An optional configuration object.
   */
  constructor(hass: HomeAssistant, namespace: string = PersistentNotification.DEFAULT_NAMESPACE) {
    this.hass = hass;
    this.namespace = namespace;
  }

  /**
   * Shows a persistent notification with the given message and options.
   *
   * @param storageKey The key name for the notification in the local storage.
   * @param message The message to display in the notification.
   * @param options Optional configuration options for the notification.
   *
   * @returns A promise that resolves when the notification is shown or the method has been called before with the same
   *          storage key.
   */
  public async showNotification(storageKey: string, message: string, options: NotificationOptions = {}): Promise<void> {
    if (this.hasBeenShown(storageKey)) {
      return;
    }

    const compiledKey = this.compileStorageKey(storageKey, options.storageKey);
    const notificationId = options.hassId || compiledKey;
    const title = options.title || PersistentNotification.DEFAULT_TITLE;

    try {
      await this.hass.callService('persistent_notification', 'create', {
        title: title,
        message: message,
        notification_id: notificationId,
      });

      this.markAsShown(storageKey, options.version || '1.0.0', notificationId);
    } catch (error) {
      logMessage(lvlError, `Failed to show notification '${storageKey}'!`, error);
      logMessage(lvlInfo, `[${title}] ${message}`);
    }
  }

  /**
   * Clears a notification from the Home Assistant UI and localStorage.
   *
   * @param storageKey The key name of the notification in the local storage.
   * @param customKey An optional custom key to use for storage.
   */
  public async dismissNotification(storageKey: string, customKey?: string): Promise<void> {
    storageKey = this.compileStorageKey(storageKey, customKey);

    try {
      const stored = localStorage.getItem(storageKey);
      const notification = stored ? (JSON.parse(stored) as StoredNotification) : null;

      // Clear from storage
      localStorage.removeItem(storageKey);

      // Clear the notification if notificationId is provided
      if (notification?.hassId) {
        await this.hass.callService('persistent_notification', 'dismiss', {
          notification_id: notification.hassId,
        });

        return;
      }

      logMessage(lvlDebug, `Notification '${storageKey}' cleared from storage!`);
    } catch (error) {
      logMessage(lvlError, `Failed to clear notification '${storageKey}'!`, error);
    }
  }

  /**
   * Checks if a notification with the given id has been shown to the user.
   *
   * @param storageKey The key name of the notification in the local storage.
   * @param customKey An optional custom key to use for storage.
   * @returns True if the notification has been shown before, false otherwise.
   */
  public hasBeenShown(storageKey: string, customKey?: string): boolean {
    storageKey = this.compileStorageKey(storageKey, customKey);

    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) {
        return false;
      }

      const notification = JSON.parse(stored) as StoredNotification;
      return notification.shown;
    } catch {
      return false;
    }
  }

  /**
   * Compiles a storage key for a given name.
   *
   * If a customKey is provided, it will be used directly.
   * Otherwise, a storage key will be generated by combining the namespace with this given id.
   *
   * @param name The name of the key.
   * @param customKey An optional custom key to use for storage.
   * @returns The storage key.
   */
  private compileStorageKey(name: string, customKey?: string): string {
    if (customKey) {
      return customKey;
    }

    const namespace = this.namespace || PersistentNotification.DEFAULT_NAMESPACE;
    return `${namespace}_${name}`;
  }

  /**
   * Marks a notification as shown.
   *
   * @param storageKey The key of the notification in localStorage.
   * @param version The version of the notification.
   * @param notificationId Id of the notification in Home Assistant.
   */
  private markAsShown(storageKey: string, version: string, notificationId?: string): void {
    storageKey = this.compileStorageKey(storageKey);

    const notification: StoredNotification = {
      shown: true,
      timestamp: new Date().toISOString(),
      version,
      hassId: notificationId,
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(notification));
    } catch (error) {
      logMessage(lvlError, 'Failed to save the notification state!', error);
    }
  }
}
