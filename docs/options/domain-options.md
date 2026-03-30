# 💡 Domain Options

Mushroom strategy supports several domains to control/view entities of.<br>

| Domain        | name            | Ordering Position | Description                                                         |
|:--------------|:----------------|:-----------------:|:--------------------------------------------------------------------|
| Lock          | `lock`          |        10         | Security devices for locking and unlocking doors or gates.          |
| Binary Sensor | `binary_sensor` |        20         | On/Off sensors such as motion, door/window contacts, or smoke.      |
| Camera        | `camera`        |        30         | Video stream entities from doorbells or security cameras.           |
| Light         | `light`         |        40         | Light bulbs and LED strips.                                         |
| Scene         | `scene`         |        50         | Predefined states for a group of entities (e.g., "Movie Night").    |
| Climate       | `climate`       |        60         | HVAC systems, thermostats, and temperature control units.           |
| Fan           | `fan`           |        70         | Speed-controlled or toggle devices specifically for air movement.   |
| Cover         | `cover`         |        80         | Motorized blinds, curtains, garage doors, or shutters.              |
| Media Player  | `media_player`  |        90         | Audio and video playback devices like TVs, speakers, and receivers. |
| Switch        | `switch`        |        100        | Basic toggles (e.g., for outlets or non-dimmable devices).          |
| Vacuum        | `vacuum`        |        110        | Robotic cleaners with controls for docking and cleaning cycles.     |
| Valve         | `valve`         |        120        | Controls for gas or water flow, including irrigation systems.       |
| Select        | `select`        |        130        | Configuration entities allowing a choice from a list of options.    |
| Input Select  | `input_select`  |        140        | Helper entities for choosing options within the UI or automations.  |
| Number        | `number`        |        150        | Entities representing a numerical value with a specific range.      |
| Sensor        | `sensor`        |        160        | State entities for data like temperature, humidity, or power usage. |
| Other         | `default`       |        170        | Any other domain not explicitly categorized above.                  |

The `domains` group enables you to specify the configuration of a domain in a view.<br>
Each configuration is identified by a domain name and can have the following options:

| Option                   | type    | Default             | Description                                                               |
|:-------------------------|:--------|:--------------------|:--------------------------------------------------------------------------|
| hidden                   | boolean | `false`             | Set to `true` to exclude the domain from the dashboard.                   |
| hide_config_entities     | boolean | `true`              | Set to `false` to include config-entities to the dashboard.               |
| hide_diagnostic_entities | boolean | `true`              | Set to `false` to include diagnostic-entities to the dashboard.           |
| order                    | number  | `unset`             | Ordering position of the domain entities in a view.                       |
| show_controls            | boolean | `true`              | Whether to show controls in a view, to switch all entities of the domain. |
| stack_count              | object  | `1`<br>(set by `_`) | Cards per row.[^1]                                                        |
| title                    | string  | domain specific     | Title of the domain in a view.                                            |

[^1]:
In the different views, the cards belonging to a specific domain will be horizontally stacked into a row.<br>
The number of cards per row can be configured with this option.

!!! note

    * Domain `default` represents any other domain than supported by this strategy.
    * The `show_controls` option will default to false for domains that can't be controlled.

## Sorting Domains

The `order` property gives you control over how the domains are arranged in a view.

To make the most of this, it helps to understand how the system prioritizes your list:

- Any domain assigned an order value will automatically move to the front/top.<br>
  This allows you to "pin" your most-used domains—like lights or fans—so they are always the first things you
  see.
- If two domains share the same order value, the system will use their names to determine which one comes first.
- Domains missing an `order` property or set to `undefined` will follow your prioritized list, sorted alphabetically by
  name.

## Setting options for all domains

Use `_` as the identifier to set options for all domains.

## Example

```yaml
strategy:
  type: custom:mushroom-strategy
  options:
    domains:
      _:
        stack_count: 2
        hide_config_entities: false
      light:
        title: "My cool lights"
        order: 1
      switch:
        stack_count: 3
        show_controls: false
        hide_diagnostic_entities: false
      default: # All other domains
        hidden: true
```
