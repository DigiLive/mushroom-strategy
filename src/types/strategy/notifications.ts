/**
 * Persistent notification definition tied to a strategy version range.
 *
 * @property {string} storageKey Unique key used to track and dismiss the notification in persistent storage.
 * @property {string} message Body text displayed in the persistent notification.
 * @property {string} title Heading displayed at the top of the persistent notification.
 * @property {string} fromVersion Minimum strategy version (inclusive) for which the notification applies.
 * @property {string} toVersion Maximum strategy version (inclusive) for which the notification applies.
 */
export interface Notification {
  storageKey: string;
  message: string;
  title: string;
  fromVersion: string;
  toVersion: string;
}
