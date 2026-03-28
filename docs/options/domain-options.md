# 💡 Domain Options

The `domains` group enables you to specify the configuration of a domain in a view.  
Each configuration is identified by a domain name and can have the following options:

| Option                   | type    | Default           | Description                                                               |
|:-------------------------|:--------|:------------------|:--------------------------------------------------------------------------|
| hidden                   | boolean | `false`           | Set to `true` to exclude the domain from the dashboard.                   |
| hide_config_entities     | boolean | `true`            | Set to `false` to include config-entities to the dashboard.               |
| hide_diagnostic_entities | boolean | `true`            | Set to `false` to include diagnostic-entities to the dashboard.           |
| order                    | number  | `unset`           | Ordering position of the domain entities in a view.                       |
| show_controls            | boolean | `true`            | Whether to show controls in a view, to switch all entities of the domain. |
| stack_count              | object  | `{_: 1}`          | Cards per row.[^1]                                                        |
| title                    | string  | `domain specific` | Title of the domain in a view.                                            |

[^1]:
In the different views, the cards belonging to a specific domain will be horizontally stacked into a row.  
The number of cards per row can be configured with this option.

!!! note

    * Domain `default` represents any other domain than supported by this strategy.
    * The `show_controls` option will default to false for domain which can't be controlled.
    * The `hide_config_entities` and `hide_diagnostic_entities` options are only available as an "All domains" option.

---

## Sorting Domains

The `order` property gives you control over how the domains are arranged in a view.

To make the most of this, it helps to understand how the system prioritizes your list:

- Any domain assigned an order value will automatically move to the front/top.<br>
  This allows you to "pin" your most-used domains—like lights or fans—so they are always the first things you
  see.
- If two domains share the same order value, the system will use their names to determine which one comes first.
- Any domain without an order property will be placed after/below your prioritized list, sorted alphabetically by name.

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
