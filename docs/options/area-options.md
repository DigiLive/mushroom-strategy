# 🛋️ Area Options

The `areas` group enables you to specify the configuration of specific areas.<br>
Each configuration is identified by an area id and can have the following options:

| Name          | Type           | Default         | Description                                                                |
|:--------------|:---------------|:----------------|:---------------------------------------------------------------------------|
| `extra_cards` | array of cards | `[]`            | A list of cards to show on the top of the area sub-view.                   |
| `hidden`      | boolean        | `false`         | Set to `true` to exclude the area from the dashboard and views.            |
| `name`        | string         | `Area specific` | The name of the area.                                                      |
| `order`       | number         | `unset`         | Ordering position of the area in the list of available areas.              |
| `type`        | string         | `default`       | Set to a type of area card. (Currently supported: `default` & `HaAreaCard` |

Also, all options from the Template mushroom card and/or Home Assistant Area card are supported.<br>
Please follow the links below to see the additional options per card type.

- [Mushroom Template Card][templateDocUrl]{: target="_blank"}.
- [Home Assistant Area Card][areaDocUrl]{: target="_blank"}.

## Sorting Areas

The `order` property gives you control over how your areas are arranged in a view.

To make the most of this, it helps to understand how the system prioritizes your list:

- Any area assigned an order value will automatically move to the front/top.<br>
  This allows you to "pin" your most-used rooms—like the Kitchen or Living Room—so they are always the first things you
  see.
- If two areas share the same order value, the system will use their names to determine which one comes first.
- Any areas without an order property will be placed after/below your prioritized list, sorted alphabetically by name.

## Extra Cards

The `extra_cards` group enables you to specify the configuration of additional cards an Area view.<br>
These cards will be shown last in the view.

See Home View Options → [Extra Cards](#extra-cards) for more information.

## Example

```yaml
strategy:
  type: custom:mushroom-strategy
  options:
    areas:
      family_room_id:
        name: Family Room
        icon: mdi:television
        icon_color: green
        order: 1
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
        order: 2
      garage_id:
        hidden: true
      hallway_id:
        type: HaAreaCard
        extra_cards:
          - type: custom:xiaomi-vacuum-map-card
            map_source:
              camera: camera.xiaomi_cloud_map_extractor
            calibration_source:
              camera: true
            entity: vacuum.robot_vacuum
            vacuum_platform: default
views: []
```

## Undisclosed Area

The strategy has a special area, named `undisclosed`.<br>
This area is enabled by default and includes the entities that aren't linked to any Home Assistant area.

The area can be configured like any other area as described above.<br>
To exclude this area from the dashboard and views, set its property `hidden` to `true`.

## Setting options for all areas

Use `_` as an identifier to set the options for all areas.<br>
The following example sets the type of all area-cards to the one of Home Assistant:

### Example

```yaml
strategy:
  type: custom:mushroom-strategy
  options:
    areas:
      _:
        type: HaAreaCard
views: []
```

!!! note

    Area specific options take precedence over options set for all areas!

<!-- References -->

[templateDocUrl]: https://github.com/piitaya/lovelace-mushroom/blob/main/docs/cards/template.md

[areaDocUrl]: https://www.home-assistant.io/dashboards/area/#configuration-variables
