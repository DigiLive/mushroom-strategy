# 📝 Full example using all the options provided with the strategy

```yaml
strategy:
  type: custom:mushroom-strategy
  options:
    show_positions: true
    views:
      light:
        order: 10
        title: illumination
      switches:
        hidden: true
        icon: mdi:toggle-switch
    home_view:
      hidden:
        greeting: false
        areas_title: true
      stack_count:
        areas: [2, 1]
        persons: 3
    domains:
      _:
        hide_config_entities: true
        stack_count: 1
      default:
        hidden_domains:
          - automation
          - script
      light:
        order: 10
        stack_count: 2
        title: "My cool lights"
        hide_diagnostic_entities: false
    badges:
      weather_entity: weather.forecast_home
      climate_count: false
      cover_count: false
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
        extra_cards:
          - type: custom:mushroom-badges-card
            badges:
              - type: entity
                entity: sensor.family_room_temperature
                icon: mdi:thermometer
                icon_color: pink
            alignment: center
      kitchen_id:
        name: Kitchen
        icon: mdi:silverware-fork-knife
        icon_color: red
        order: 10
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
