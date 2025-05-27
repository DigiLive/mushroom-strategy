# Area Options

The `areas` group enables you to specify the configuration of specific areas.
Each configuration is identified by an area id and can have the following options:

| Name          | Type           | Default         | Description                                                                |
|:--------------|:---------------|:----------------|:---------------------------------------------------------------------------|
| `extra_cards` | array of cards | `[]`            | A list of cards to show on the top of the area sub-view.                   |
| `hidden`      | boolean        | `false`         | Set to `true` to exclude the area from the dashboard and views.            |
| `name`        | string         | `Area specific` | The name of the area.                                                      |
| `order`       | number         | `unset`         | Ordering position of the area in the list of available areas.              |
| `type`        | string         | `default`       | Set to a type of area card. (Currently supported: `default` & `HaAreaCard` |

Also, all options from the Template mushroom card and/or Home Assistant Area card are supported.  
Please follow the links below to see the additional options per card type.

* [Mushroom Template Card][templateDocUrl]{: target="_blank"}.
* [Home Assistant Area Card][areaDocUrl]{: target="_blank"}.

## Extra Cards

The `extra_cards` group enables you to specify the configuration of additional cards an Area view.
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

The strategy has a special area, named `undisclosed`.
This area is enabled by default and includes the entities that aren't linked to any Home Assistant area.

The area can be configured like any other area as described above.
To exclude this area from the dashboard and views, set its property `hidden` to `true`.

## Setting options for all areas

Use `_` as an identifier to set the options for all areas.  
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
    Area specific options take precedence over options set for all areas.!

<!-- References -->

[templateDocUrl]: https://github.com/piitaya/lovelace-mushroom/blob/main/docs/cards/template.md

[areaDocUrl]: https://www.home-assistant.io/dashboards/area/#configuration-variables
