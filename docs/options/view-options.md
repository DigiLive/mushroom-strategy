# 👀 View Options

Mushroom strategy includes several views to control/view entities of a specific domain.  
Hidden/Disabled entities or linked to a hidden area are excluded from the view.

The following views are supported and enabled by default:

| View    | Type   | Description                                |
|:--------|:-------|:-------------------------------------------|
| camera  | object | View to control cameras.                   |
| climate | object | View to control climates.                  |
| cover   | object | View to control covers.                    |
| fan     | object | View to control fans.                      |
| home    | object | An overview of several entities and areas. |
| light   | object | View to control lights.                    |
| lock    | object | View to control locks.                     |
| scene   | object | View to control scenes.                    |
| switch  | object | View to control switches.                  |
| vacuum  | object | View to control vacuums.                   |
| valve   | object | View to control valves.                    |

The `views` group enables you to specify the configuration of a view.
Each configuration is identified by a view name and can have the following options:

| name   | type    | Default                                                                      | description                                                                                    |
|:-------|:--------|:-----------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------|
| hidden | boolean | `false`                                                                      | Set to `true` to exclude the view from the dashboard                                           |
| icon   | string  | `domain specific`                                                            | Icon of the view in the navigation bar.                                                        |
| order  | string  | home, light, fan, cover, switch, climate, camera, vacuum, scene, lock, valve | Ordering position of the view in the navigation bar.                                           |
| title  | string  | `domain specific`                                                            | Title of the view in the navigation bar. (Shown when no icon is defined or hovering above it.) |

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

---

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
        icon: mdi:emoticon-cool
        badges: []
        cards:
          - type: markdown
            content: I am cool
```

<!-- references -->

[viewDocUrl]: https://www.home-assistant.io/dashboards/views/#views
