# 👀 View Options

Mushroom strategy includes several views to control/view entities of a specific domain.<br>
Hidden/Disabled entities or linked to a hidden area are excluded from the view.

The following views are supported and enabled by default:

| View      | name     | Ordering Position | Type   | Description               |
|:----------|:---------|:-----------------:|:-------|:--------------------------|
| `home`    | Home     |     -Infinity     | object | The strategy's Home View. |
| `light`   | Lights   |        10         | object | View to control lights.   |
| `fan`     | Fans     |        20         | object | View to control fans.     |
| `cover`   | Covers   |        30         | object | View to control covers.   |
| `switch`  | Switches |        40         | object | View to control switches. |
| `climate` | Climates |        50         | object | View to control climates. |
| `camera`  | Cameras  |        60         | object | View to control cameras.  |
| `vacuum`  | Vacuums  |        70         | object | View to control vacuums.  |
| `scene`   | Scenes   |        80         | object | View to control scenes.   |
| `lock`    | Locks    |        90         | object | View to control locks.    |
| `valve`   | Valves   |        100        | object | View to control valves.   |

The `views` group enables you to specify the configuration of a view.
Each configuration is identified by a view name and can have the following options:

| name     | type    | Default                              | description                                                                                    |
|:---------|:--------|:-------------------------------------|:-----------------------------------------------------------------------------------------------|
| `hidden` | boolean | `false`                              | Set to `true` to exclude the view from the dashboard                                           |
| `icon`   | string  | domain specific                      | Icon of the view in the navigation bar.                                                        |
| `order`  | number  | domain specific<br>(See table above) | Ordering position of the view in the navigation bar.                                           |
| `title`  | string  | domain specific                      | Title of the view in the navigation bar. (Shown when no icon is defined or hovering above it.) |

## Sorting Views

The `order` property gives you control over how views are arranged in the top of the dashboard.

To make the most of this, it helps to understand how the strategy prioritizes these elements, as explained in chapter
[Element Positioning](index.md#element-positioning).

Possible values for `order` are:

- Any number, with lower values appearing first. For example, a view with `order: 10` will appear before an area with
  `order: 20`.
- `undefined` or missing `order` property, which will follow your prioritized list, sorted alphabetically by name.
- `Infinity` or `-Infinity` to always show a view last or first, respectively.

!!! note

    By default…

    - The strategy pre-assigns a position to the build-in views, regardless if the view is hidden or not.
    - The Home view is assigned the lowest possible `order` value, ensuring it appears first in the list.
    
## Example

```yaml
strategy:
  type: custom:mushroom-strategy
  show_positions: true
  options:
    views:
      light:
        order: 10
        title: illumination
      switch:
        order: 20
        hidden: true
        icon: mdi:toggle-switch
      fan:
        order: 30
        icon: mdi:fan
views: []
```

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
