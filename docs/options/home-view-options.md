# 🏠 Home View Options

The `home_view` group enables you to specify the configuration of the Home view.

| Option        | type   | default  | Description                                   |
|:--------------|:-------|:---------|:----------------------------------------------|
| `hidden`      | array  | `[]`     | Array of sections to hide from the home view. |
| `stack_count` | object | `{_: 2}` | Cards per row.                                |

---

## Hiding sections

The following sections can be hidden from the Home view:

* areas
* areasTitle
* chips
* greeting
* persons

### Example

```YAML
strategy:
  type: custom:mushroom-strategy
  options:
    home_view:
      hidden:
        - greeting
        - areasTitle
```

---

## Stack Count

The `stack_count` option is a map of sections to define the number of cards per row.  
The key of the map is the section, while the value is the number of cards per row.

The `areas` section is a special case, where the value is an array of two numbers.  
The first number is the number of default cards per row, while the second number is the number of
[Home Assistant cards](https://www.home-assistant.io/dashboards/area/) per row.

### example

```yaml
home_view:
  stack_count:
    _: 2         # Two cards per row for all sections.
    persons: 3   # Three person cards per row.
    areas: [2,1] # [Two Strategy Card per row, 1 HASS card per row]
```

!!! note

    Section specific options take precedence over options set for all sections!

---

## Chip Options

The mushroom strategy has chips that indicate the number of entities for a specific domain which are in an "active"
state.  
Hidden/Disabled entities are excluded from this count.

- Tapping a chip will set corresponding entities to an "inactive" state.[^1]  
  _**Note:** The Switch chip requires a confirmation before executing its tap action to prevent accidental toggling of
  all switches._
- Holding a chip, will navigate to the corresponding view.

[^1]: For some chips, the tap action is disabled.

The `chips` group enables you to specify its configuration of chips.

| Name             | type    | default | Description                                 |
|:-----------------|:--------|:--------|:--------------------------------------------|
| `light_count`    | boolean | `false` | Number of lights on.                        |
| `fan_count`      | boolean | `false` | Number of fans on.                          |
| `cover_count`    | boolean | `false` | Number of covers not closed. No tap action. |
| `switch_count`   | boolean | `false` | Number of switches on.                      |
| `climate_count`  | boolean | `false` | Number of climate not off. No tap action.   |
| `weather_entity` | string  | `auto`  | Entity id for the weather chip to use.      |
| `extra_chips`    | array   | `[]`    | List of extra chips to show.                |

If `weather_entity` is set to `auto`, the weather chip uses the first entity of the weather domain it finds.  
You can define a custom entity to use by setting an entity id.

!!! note

    To hide the weather chip, you should hide or disable the entity itself.

### Example

```yaml
strategy:
  type: custom:mushroom-strategy
  options:
    chips:
      climate_count: false
      cover_count: false
      weather_entity: weather.forecast_home
```

---

## Extra Chips

To add custom chips, you can configure them in `extra_chips`.  
See [Mushroom Chips][chipDocUrl]{: target="_blank"} for all available chips.

!!! tip

    You can build your chips in a temporary card in another dashboard and copy the `chips` group from the YAML of that
    card into group `extra_chips` of the strategy configuration. The YAML can be found in the Raw configuration editor.

### Example

```yaml
strategy:
  type: custom:mushroom-strategy
  options:
    chips:
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
            tap_action:
              action: toggle
```

---

## Quick Access Cards

The `quick_access_cards` group enables you to specify the configuration of additional cards in the view.
These cards will be shown between the greeting card and area cards.

Each card can have the options as described at [Card Options](card-options.md).

!!! tip

    You can build your view in a temporary dashboard and copy the `views` group from the YAML of that dashboard into
    group `extra_views` of the strategy configuration. The YAML can be found in the Raw configuration editor.

### Example

```yaml
strategy:
  type: custom:mushroom-strategy
  options:
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
          - type: custom:mushroom-entity-card
            entity: sensor.front_door_lock_battery
            name: Battery
```

---

### Extra Cards

The `extra_cards` group enables you to specify the configuration of additional cards in the view.
These cards will be shown below the areas.

Each card can have the options as described at [Card Options](card-options.md).

!!! tip
    You can build your view in a temporary dashboard and copy the `views` group from the YAML of that dashboard into
    group `extra_cards` of the strategy configuration. The YAML can be found in the Raw configuration editor.

#### Example

```yaml
strategy:
  type: custom:mushroom-strategy
  options:
    extra_cards:
      - type: custom:xiaomi-vacuum-map-card
        map_source:
          camera: camera.xiaomi_cloud_map_extractor
        calibration_source:
          camera: true
        entity: vacuum.robot_vacuum
        vacuum_platform: default
```

<!-- references -->

[chipDocUrl]: https://github.com/piitaya/lovelace-mushroom/blob/main/docs/cards/chips.md
