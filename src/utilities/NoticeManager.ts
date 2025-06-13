import { HomeAssistant } from '../types/homeassistant/types';

interface NoticeOptions {
  title?: string;
  storageKey?: string;
  version?: string;
  notificationId?: string;
}

interface StoredNotice {
  shown: boolean;
  timestamp: string;
  version: string;
}

export class NoticeManager {
  private static readonly DEFAULT_NAMESPACE = 'mushroom_strategy_notice';
  private static readonly DEFAULT_TITLE = 'Deprecation Notice';

  constructor(
    private readonly hass: HomeAssistant,
    private readonly options: { namespace?: string } = {}
  ) {}

  /**
   * Shows a deprecation notice if it hasn't been shown before.
   */
  public async showDeprecationNotice(id: string, message: string, options: NoticeOptions = {}): Promise<void> {
    const storageKey = this.getStorageKey(id, options.storageKey);
    const notificationId = options.notificationId || `mushroom_strategy_${id}`;
    const title = options.title || NoticeManager.DEFAULT_TITLE;

    try {
      // Check if notice was already shown
      if (this.hasBeenShownSync(storageKey)) {
        return; // Notice was already shown
      }

      // Show persistent notification
      await this.hass.callService('persistent_notification', 'create', {
        title: title,
        message: message,
        notification_id: notificationId,
      });

      // Mark as shown
      this.markAsShownSync(storageKey, options.version || '1.0.0');
    } catch (error) {
      console.error(`[NoticeManager] Failed to show deprecation notice '${id}':`, error);
      // Fallback to console if service call fails
      console.warn(`[${title}] ${message}`);
    }
  }

  /**
   * Clears a previously shown notice.
   */
  public async clearNotice(id: string, customKey?: string, notificationId?: string): Promise<void> {
    const storageKey = this.getStorageKey(id, customKey);
    try {
      // Clear from storage
      localStorage.removeItem(storageKey);

      // Clear the notification if notificationId is provided
      if (notificationId) {
        await this.hass.callService('persistent_notification', 'dismiss', {
          notification_id: notificationId,
        });
      }
    } catch (error) {
      console.error(`[NoticeManager] Failed to clear notice '${id}':`, error);
    }
  }

  /**
   * Checks if a notice has been shown before.
   */
  public hasBeenShown(id: string, customKey?: string): boolean {
    const storageKey = this.getStorageKey(id, customKey);
    return this.hasBeenShownSync(storageKey);
  }

  private hasBeenShownSync(storageKey: string): boolean {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) {
        return false;
      }

      const notice = JSON.parse(stored) as StoredNotice;
      return notice.shown;
    } catch {
      return false;
    }
  }

  private getStorageKey(id: string, customKey?: string): string {
    if (customKey) {
      return customKey;
    }
    const namespace = this.options.namespace || NoticeManager.DEFAULT_NAMESPACE;
    return `${namespace}_${id}`;
  }

  private markAsShownSync(storageKey: string, version: string): void {
    const notice: StoredNotice = {
      shown: true,
      timestamp: new Date().toISOString(),
      version,
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(notice));
    } catch (error) {
      console.error('[NoticeManager] Failed to save notice state:', error);
    }
  }
}
