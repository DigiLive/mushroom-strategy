import { Notification } from './types/strategy/notifications';

/**
 * List of persistent notifications evaluated during dashboard generation.
 *
 * @example
 * ```ts
 * export const NOTIFICATIONS: Notification[] = [
 *   {
 *     storageKey: 'breaking_change_domains',
 *     message: 'Domain configuration keys were renamed. Check your dashboard options.',
 *     title: 'Mushroom Strategy Update',
 *     fromVersion: '3.2.0',
 *     toVersion: '3.2.9',
 *   },
 * ];
 * ```
 */
export const NOTIFICATIONS: Notification[] = [];
