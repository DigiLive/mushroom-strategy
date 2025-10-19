export const NOTIFICATIONS = [
  {
    storageKey: 'chips_deprecation',
    title: 'Mushroom Strategy',
    message:
      '## Deprecation Notice\n' +
      'As of v3.0.0, chips are replaced by badges.\n' +
      'From that version on, you must rename all `chip` or `chips` references and settings in your YAML configuration.\n' +
      'The [documentation](https://digilive.github.io/mushroom-strategy/options/home-view-options/) will be updated accordingly.',
    fromVersion: '2.3.5',
    toVersion: '3.0.0',
  },
  {
    storageKey: 'greetingCard_poll',
    title: 'Mushroom Strategy',
    message:
      '## Greeting Card Poll\n' +
      "Please follow below link to read about the greeting card's future and cast your vote.\n" +
      'https://github.com/DigiLive/mushroom-strategy/discussions/259',
    fromVersion: '2.4.1',
    toVersion: '3.0.0',
  },
];
