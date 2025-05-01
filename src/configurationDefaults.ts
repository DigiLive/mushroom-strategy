import { StrategyDefaults } from './types/strategy/strategy-generics';
import { localize } from './utilities/localize';

/**
 * Default configuration for the mushroom strategy.
 */
export const ConfigurationDefaults: StrategyDefaults = {
  areas: {
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
    },
    binary_sensor: {
      title: `${localize('sensor.binary')} ` + localize('sensor.sensors'),
      showControls: false,
      hidden: false,
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
      iconOn: 'mdi:arrow-up',
      iconOff: 'mdi:arrow-down',
      onService: 'cover.open_cover',
      offService: 'cover.close_cover',
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
      iconOn: 'mdi:fan',
      iconOff: 'mdi:fan-off',
      onService: 'fan.turn_on',
      offService: 'fan.turn_off',
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
      iconOn: 'mdi:lightbulb',
      iconOff: 'mdi:lightbulb-off',
      onService: 'light.turn_on',
      offService: 'light.turn_off',
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
      onService: 'scene.turn_on',
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
      iconOn: 'mdi:power-plug',
      iconOff: 'mdi:power-plug-off',
      onService: 'switch.turn_on',
      offService: 'switch.turn_off',
      hidden: false,
    },
    vacuum: {
      title: localize('vacuum.vacuums'),
      showControls: true,
      hidden: false,
    },
  },
  extra_cards: [],
  extra_views: [],
  home_view: {
    hidden: [],
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
