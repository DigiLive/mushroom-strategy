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
      order: Infinity,
    },
  },
  card_options: {},
  badges: {
    // TODO: Make badges sortable.
    weather_entity: 'auto',
    light_count: true,
    fan_count: true,
    cover_count: true,
    switch_count: true,
    climate_count: true,
    extra_badges: [],
  },
  debug: false,
  domains: {
    _: {
      hide_config_entities: true,
      hide_diagnostic_entities: true,
      show_controls: true,
      stack_count: 1,
    },
    lock: {
      order: 10,
      title: localize('lock.locks'),
      show_controls: false,
      hidden: false,
    },
    binary_sensor: {
      order: 20,
      title: `${localize('sensor.binary')} ` + localize('sensor.sensors'),
      show_controls: false,
      hidden: false,
      stack_count: 2,
    },
    camera: {
      order: 30,
      title: localize('camera.cameras'),
      show_controls: false,
      hidden: false,
    },
    light: {
      order: 40,
      title: localize('light.lights'),
      iconOn: 'mdi:lightbulb',
      iconOff: 'mdi:lightbulb-off',
      onService: 'light.turn_on',
      offService: 'light.turn_off',
      hidden: false,
    },
    scene: {
      order: 50,
      title: localize('scene.scenes'),
      show_controls: false,
      onService: 'scene.turn_on',
      hidden: false,
    },
    climate: {
      order: 60,
      title: localize('climate.climates'),
      show_controls: false,
      hidden: false,
    },
    fan: {
      order: 70,
      title: localize('fan.fans'),
      iconOn: 'mdi:fan',
      iconOff: 'mdi:fan-off',
      onService: 'fan.turn_on',
      offService: 'fan.turn_off',
      hidden: false,
    },
    cover: {
      order: 80,
      title: localize('cover.covers'),
      iconOn: 'mdi:arrow-up',
      iconOff: 'mdi:arrow-down',
      onService: 'cover.open_cover',
      offService: 'cover.close_cover',
      hidden: false,
    },
    media_player: {
      order: 90,
      title: localize('media_player.media_players'),
      show_controls: false,
      hidden: false,
    },
    switch: {
      order: 100,
      title: localize('switch.switches'),
      iconOn: 'mdi:power-plug',
      iconOff: 'mdi:power-plug-off',
      onService: 'switch.turn_on',
      offService: 'switch.turn_off',
      hidden: false,
    },
    vacuum: {
      order: 110,
      title: localize('vacuum.vacuums'),
      iconOn: 'mdi:robot-vacuum',
      iconOff: 'mdi:robot-vacuum-off',
      onService: 'vacuum.start',
      offService: 'vacuum.stop',
      hidden: false,
    },
    valve: {
      order: 120,
      title: localize('valve.valves'),
      iconOn: 'mdi:valve-open',
      iconOff: 'mdi:valve-closed',
      onService: 'valve.open_valve',
      offService: 'valve.close_valve',
      hidden: false,
    },
    select: {
      order: 130,
      title: localize('select.selects'),
      show_controls: false,
      hidden: false,
    },
    input_select: {
      order: 140,
      title: localize('input_select.input_selects'),
      show_controls: false,
      hidden: false,
    },
    number: {
      order: 150,
      title: localize('generic.numbers'),
      show_controls: false,
      hidden: false,
    },
    sensor: {
      order: 160,
      title: localize('sensor.sensors'),
      show_controls: false,
      hidden: false,
    },
    default: {
      order: 170,
      title: localize('generic.miscellaneous'),
      show_controls: false,
      hidden: false,
    },
  },
  extra_cards: [],
  extra_views: [],
  home_view: {
    hidden: {
      areas: false,
      areas_title: false,
      badges: false,
      greeting: true,
      persons: false,
    },
    stack_count: {
      _: 2,
    },
  },
  show_positions: false,
  views: {
    camera: {
      order: 60,
      hidden: false,
    },
    climate: {
      order: 50,
      hidden: false,
    },
    cover: {
      order: 30,
      hidden: false,
    },
    fan: {
      order: 20,
      hidden: false,
    },
    home: {
      order: -Infinity,
      hidden: false,
    },
    light: {
      order: 10,
      hidden: false,
    },
    lock: {
      order: 90,
      hidden: false,
    },
    scene: {
      order: 80,
      hidden: false,
    },
    switch: {
      order: 40,
      hidden: false,
    },
    vacuum: {
      order: 70,
      hidden: false,
    },
    valve: {
      order: 100,
      hidden: false,
    },
  },
  quick_access_cards: [],
};
