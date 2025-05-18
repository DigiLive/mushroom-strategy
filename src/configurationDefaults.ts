import { StrategyDefaults } from './types/strategy/strategy-generics';
import { localize } from './utilities/localize';

/**
 * Default configuration for the mushroom strategy.
 */
export const ConfigurationDefaults: StrategyDefaults = {
  areas: {
    _: {
      type: 'AreaCard',
    },
    undisclosed: {
      // TODO: Refactor undisclosed to other.
      aliases: [],
      area_id: 'undisclosed',
      created_at: 0,
      floor_id: null,
      hidden: false,
      humidity_entity_id: null,
      icon: 'mdi:floor-plan',
      labels: [],
      modified_at: 0,
      name: localize('generic.undisclosed'),
      picture: null,
      temperature_entity_id: null,
    },
  },
  card_options: {},
  device_options: {
    _: {
      group_entities: false,
    },
  },
  chips: {
    // TODO: Make chips sortable.
    weather_entity: 'auto',
    light_count: true,
    fan_count: true,
    cover_count: true,
    switch_count: true,
    climate_count: true,
    extra_chips: [],
  },
  debug: false,
  domains: {
    _: {
      hide_config_entities: undefined,
      hide_diagnostic_entities: undefined,
      showControls: true,
      stack_count: 1,
    },
    binary_sensor: {
      title: `${localize('sensor.binary')} ` + localize('sensor.sensors'),
      showControls: false,
      hidden: false,
      stack_count: 2, // TODO: Add to wiki. also for other configurations.
    },
    camera: {
      title: localize('camera.cameras'),
      showControls: false,
      hidden: false,
    },
    climate: {
      title: localize('climate.climates'),
      showControls: false,
      hidden: false,
    },
    cover: {
      title: localize('cover.covers'),
      showControls: true,
      on: {
        icon: 'mdi:arrow-up-drop-circle-outline',
        service: 'cover.open_cover',
      },
      off: {
        icon: 'mdi:arrow-up-down-circle-outline',
        service: 'cover.close_cover',
      },
      hidden: false,
    },
    default: {
      title: localize('generic.miscellaneous'),
      showControls: false,
      hidden: false,
    },
    fan: {
      title: localize('fan.fans'),
      showControls: true,
      on: {
        icon: 'mdi:fan',
        service: 'fan.turn_on',
      },
      off: {
        icon: 'mdi:fan-off',
        service: 'fan.turn_off',
      },
      hidden: false,
    },
    input_select: {
      title: localize('input_select.input_selects'),
      showControls: false,
      hidden: false,
    },
    light: {
      title: localize('light.lights'),
      showControls: true,
      on: {
        icon: 'mdi:lightbulb',
        service: 'light.turn_on',
      },
      off: {
        icon: 'mdi:lightbulb-off',
        service: 'light.turn_off',
      },
      hidden: false,
    },
    lock: {
      title: localize('lock.locks'),
      showControls: false,
      hidden: false,
    },
    media_player: {
      title: localize('media_player.media_players'),
      showControls: false,
      hidden: false,
    },
    number: {
      title: localize('generic.numbers'),
      showControls: false,
      hidden: false,
    },
    scene: {
      title: localize('scene.scenes'),
      showControls: false,
      hidden: false,
    },
    select: {
      title: localize('select.selects'),
      showControls: false,
      hidden: false,
    },
    sensor: {
      title: localize('sensor.sensors'),
      showControls: false,
      hidden: false,
    },
    switch: {
      title: localize('switch.switches'),
      showControls: true,
      on: {
        icon: 'mdi:light-switch',
        service: 'switch.turn_on',
      },
      off: {
        icon: 'mdi:light-switch-off',
        service: 'switch.turn_off',
      },
      hidden: false,
    },
    vacuum: {
      title: localize('vacuum.vacuums'),
      showControls: true,
      on: {
        icon: 'mdi:robot-vacuum',
        service: 'vacuum.start',
      },
      off: {
        icon: 'mdi:robot-vacuum-off',
        service: 'vacuum.stop',
      },
      hidden: false,
    },
  },
  extra_cards: [],
  extra_views: [],
  home_view: {
    hidden: [],
    stack_count: {
      _: 2,
    },
  },
  views: {
    camera: {
      order: 7,
      hidden: false,
    },
    climate: {
      order: 6,
      hidden: false,
    },
    cover: {
      order: 4,
      hidden: false,
    },
    fan: {
      order: 3,
      hidden: false,
    },
    home: {
      order: 1,
      hidden: false,
    },
    light: {
      order: 2,
      hidden: false,
    },
    lock: {
      order: 10,
      hidden: false,
    },
    scene: {
      order: 9,
      hidden: false,
    },
    switch: {
      order: 5,
      hidden: false,
    },
    vacuum: {
      order: 8,
      hidden: false,
    },
  },
  quick_access_cards: [],
};
