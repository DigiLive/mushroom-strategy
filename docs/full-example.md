# 📝 Full example using all the options provided with the strategy

```yaml
strategy:
  type: custom:mushroom-strategy
  options:
    views:
      light:
        order: 1
        title: illumination
      switches:
        hidden: true
        icon: mdi:toggle-switch
    home_view:
      hidden:
        - areasTitle
        - greeting
      stack_count:
        areas: [2, 1]
        persons: 3
    domains:
      _:
        hide_config_entities: true
        stack_count: 1
      light:
        order: 1
        stack_count: 2
        title: "My cool lights"
    chips:
      weather_entity: weather.forecast_home
      climate_count: false
      cover_count: false
      extra_chips:
        - type: conditional
          conditions:
            - entity: lock.front_door
              state: unlocked
          chip:
            type: entity
            entity: lock.front_door
            icon_color: red
            content_info: none
            icon: ''
            use_entity_picture: false
            tap_action:
              action: toggle
        - type: conditional
          conditions:
            - entity: cover.garage_door
              state_not: closed
          chip:
            type: entity
            entity: cover.garage_door
            icon_color: red
            content_info: none
            tap_action:
              action: toggle
    areas:
      _:
        type: default
      family_room_id:
        name: Family Room
        icon: mdi:television
        icon_color: green
        extra_cards:
          - type: custom:mushroom-chips-card
            chips:
              - type: entity
                entity: sensor.family_room_temperature
                icon: mdi:thermometer
                icon_color: pink
            alignment: center
      kitchen_id:
        name: Kitchen
        icon: mdi:silverware-fork-knife
        icon_color: red
        order: 1
      master_bedroom_id:
        name: Master Bedroom
        icon: mdi:bed-king
        icon_color: blue
      kids_bedroom_id:
        name: Kids Bedroom
        icon: mdi:flower-tulip
        icon_color: green
    card_options:
      fan.master_bedroom_fan:
        type: custom:mushroom-fan-card
      remote.harmony_hub_wk:
        hidden: true
    quick_access_cards:
      - type: custom:mushroom-cover-card
        entity: cover.garage_door
        show_buttons_control: true
      - type: horizontal-stack
        cards:
          - type: custom:mushroom-lock-card
            entity: lock.front_door
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
        title: Cool view
        path: cool-view
        icon: mdi:emoticon-cool
        badges: []
        cards:
          - type: markdown
            content: I am cool
```
