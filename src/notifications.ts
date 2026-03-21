interface Notification {
  storageKey: string;
  message: string;
  title: string;
  fromVersion: string;
  toVersion: string;
}

export const NOTIFICATIONS: Notification[] = [];
