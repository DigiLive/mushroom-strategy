# 👀 View Options

Mushroom strategy includes several views to control/view entities of a specific domain.<br>
Hidden/Disabled entities or linked to a hidden area are excluded from the view.

The following views are supported and enabled by default:

| View    | Ordering Position | Type   | Description               |
|:--------|:-----------------:|:-------|:--------------------------|
| home    |        10         | object | The strategy's Home View. |
| light   |        20         | object | View to control lights.   |
| fan     |        30         | object | View to control fans.     |
| cover   |        40         | object | View to control covers.   |
| switch  |        50         | object | View to control switches. |
| climate |        60         | object | View to control climates. |
| camera  |        70         | object | View to control cameras.  |
| vacuum  |        80         | object | View to control vacuums.  |
| scene   |        90         | object | View to control scenes.   |
| lock    |        100        | object | View to control locks.    |
| valve   |        110        | object | View to control valves.   |

The `views` group enables you to specify the configuration of a view.
Each configuration is identified by a view name and can have the following options:

| name   | type    | Default                              | description                                                                                    |
|:-------|:--------|:-------------------------------------|:-----------------------------------------------------------------------------------------------|
| hidden | boolean | `false`                              | Set to `true` to exclude the view from the dashboard                                           |
| icon   | string  | domain specific                      | Icon of the view in the navigation bar.                                                        |
| order  | number  | domain specific<br>(See table above) | Ordering position of the view in the navigation bar.                                           |
| title  | string  | domain specific                      | Title of the view in the navigation bar. (Shown when no icon is defined or hovering above it.) |

## Example

```yaml
strategy:
  type: custom:mushroom-strategy
  options:
    views:
      light:
        order: 0
        title: illumination
      switch:
        order: 1
        hidden: true
        icon: mdi:toggle-switch
views: []
```

## Sorting Views

The `order` property gives you control over how the views are arranged.

To make the most of this, it helps to understand how the system prioritizes your list:

- Any view assigned an order value will automatically move to the front/top.<br>
  This allows you to "pin" your most-used views—like the Lights or Fans—so they are always the first things you
  see.
- If two views share the same order value, the system will use their names to determine which one comes first.
- Any views without an order property will be placed after/below your prioritized list, sorted alphabetically by name.

!!! note

    Keep in mind that the build-in views have a default order as shown in the table above.

## Extra Views

The `extra_views` group enables you to specify the configuration of additional views.
Each view can have the options as described in the [Home Assistant documentation][viewDocUrl]{: target="_blank"}.

!!! tip

    You can build your view in a temporary dashboard and copy the `views` group from the YAML of that dashboard into
    group `extra_views` of the strategy configuration. The YAML can be found in the Raw configuration editor.

### Example

```yaml
strategy:
  type: custom:mushroom-strategy
  options:
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

<!-- references -->

[viewDocUrl]: https://www.home-assistant.io/dashboards/views/#views
