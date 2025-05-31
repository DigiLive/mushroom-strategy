# 💡 Domain Options

The `domains` group enables you to specify the configuration of a domain in a view.  
Each configuration is identified by a domain name and can have the following options:

| Option                   | type    | Default           | Description                                                               |
|:-------------------------|:--------|:------------------|:--------------------------------------------------------------------------|
| hidden                   | boolean | `false`           | Set to `true` to exclude the domain from the dashboard.                   |
| hide_config_entities     | boolean | `true`            | Set to `false` to include config-entities to the dashboard.               |
| hide_diagnostic_entities | boolean | `true`            | Set to `false` to include diagnostic-entities to the dashboard.           |
| order                    | number  | `unset`           | Ordering position of the domain entities in a view.                       |
| showControls             | boolean | `true`            | Weather to show controls in a view, to switch all entities of the domain. |
| stack_count              | object  | `{_: 1}`          | Cards per row.[^1]                                                        |
| title                    | string  | `domain specific` | Title of the domain in a view.                                            |

[^1]:
In the different views, the cards belonging to a specific domain will be horizontally stacked into a row.  
The number of cards per row can be configured with this option.

!!! note

    * Domain `default` represents any other domain than supported by this strategy.
    * The `showControls` option will default to false for domain which can't be controlled.
    * The `hide_config_entities` and `hide_diagnostic_entities` options are only available as an "All domains" option.

---

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
        showControls: false
      default: # All other domains
        hidden: true
```

??? info "Click to expand the full list of supported domains"

    - _ (All domains)
    - area
    - binary_sensor
    - camera
    - climate
    - cover
    - default (Miscellaneous)
    - fan
    - input_select
    - light
    - lock
    - media_player
    - number
    - person
    - scene
    - select
    - sensor
    - switch
    - vacuum
    - valve
