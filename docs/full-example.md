# 📝 Full example using all the options provided with the strategy

```yaml
strategy:
  type: custom:mushroom-strategy
  options:
    show_positions: true
    areas:
      family_room_id:
        name: Family Room
        icon: mdi:sofa
        icon_color: green
        order: 10
      kitchen_id:
        name: Kitchen
        icon: mdi:fridge
        icon_color: blue
        order: 20
    home_view:
      hidden:
        greeting: false
        areas_title: true
      stack_count:
        _: 2         # Two cards per row for all sections.
        persons: 3   # Three person cards per row.
        areas: [2,1] # [Two Strategy Card per row, 1 HASS card per row]
    domains:
      _:
        stack_count: 2
        hide_config_entities: false
      light:
        title: "My cool lights"
        order: 10
      switch:
        stack_count: 3
        show_controls: false
        hide_diagnostic_entities: false
        order: 20
      fan:
        hide_unavailable_entities: true
      default: # All other domains
        hidden: true
    badges:
      climate_count: false
      cover_count: false
      weather_entity: weather.forecast_home
      extra_badges:
        - type: custom:mushroom-template-badge
          content: Hello
          icon: mdi:mushroom
          color: red
        - type: entity
          show_name: false
          show_state: true
          show_icon: true
          entity: light.kitchen
          tap_action:
            action: toggle
    areas:
      _:
        type: default
      family_room_id:
        name: Family Room
        icon: mdi:television
        icon_color: green
        order: 10
        extra_cards:
          - type: custom:mushroom-chips-card
            chips:
              - type: entity
                entity: sensor.family_room_temperature
                icon: mdi:thermometer
                icon_color: pink
            alignment: center
    card_options:
      _:
        name:
          - type: entity
      fan.master_bedroom_fan:
        type: custom:mushroom-fan-card
        icon: mdi:fan
      sensor.temperature:
          name:
            - type: area
            - type: entity
      remote.harmony_hub_wk:
        hidden: true
      077ba0492c9bb3b3134f1f3a626a: # this is a device id
        hidden: true
    quick_access_cards:
      - type: custom:mushroom-title-card
        title: Security
      - type: custom:mushroom-cover-card
        entity: cover.garage_door
        show_buttons_control: true
      - type: horizontal-stack
        cards:
          - type: custom:mushroom-lock-card
            entity: lock.front_door
            name:
              - type: area
              - type: entity
          - type: custom:mushroom-entity-card
            entity: sensor.front_door_lock_battery
            name: Battery
    extra_cards:
      - type: custom:xiaomi-vacuum-map-card
        map_source:
          camera: camera.xiaomi_cloud_map_extractor
        calibration_source:
          camera: true
        entity: vacuum.robot_vacuum
        vacuum_platform: default
    extra_views:
      - theme: Backend-selected
        title: cool view
        path: cool-view
        order: Infinity
        icon: mdi:emoticon-cool
        badges: []
        cards:
          - type: markdown
            content: I am cool
```
