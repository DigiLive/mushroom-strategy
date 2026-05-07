# ⚙️ Overview

The dashboard can be highly customized using the `options` parameter in the YAML configuration of your dashboard.

   ```yaml
   strategy:
     type: custom:mushroom-strategy
     options:
       # Custom Configuration
   ```

By default,

- All views and domains are enabled.
- All badges are enabled and count the number of "active" entities.
- For the weather badge, the entity is selected automatically unless you specify one.
- All entities without an area are added to the `undisclosed` area.
- All configuration- and diagnostic entities are hidden.

The options are divided into groups as described below.

| Name                 | Type           | Default               | Description                                                                                                                               |
|:---------------------|:---------------|:----------------------|:------------------------------------------------------------------------------------------------------------------------------------------|
| `show_positions`     | bool           | false                 | Toggles the visibility of positioned elements (Area, View, Domain).                                                                       |
| `areas`              | object         | {undisclosed}         | See [Area Options](area-options.md).                                                                                                      |
| `card_options`       | object         | empty                 | See [Card Options](card-options.md).                                                                                                      |
| `domains`            | object         | All supported domains | See [Domain Options](domain-options.md).                                                                                                  |
| `home_view`          | object         | unset                 | See [Home View Options](home-view-options.md).                                                                                            |
| `badges`             | object         | All supported badges  | See [Badge Options](home-view-options.md#badge-options).                                                                                  |
| `quick_access_cards` | array of cards | empty                 | List of cards to show between the greeting card and the area cards.<br>See [Quick Access Cards](home-view-options.md#quick-access-cards). |
| `extra_cards`        | array of cards | empty                 | List of cards to show below the area cards.<br>See [extra Cards](home-view-options.md#extra-cards).                                       |
| `views`              | object         | All supported views   | See [View Options](view-options.md).                                                                                                      |
| `extra_views`        | array of views | empty                 | List of user defined views to add to the dashboard.<br>See [Extra Views](view-options.md#extra-views).                                    |

## Global Options

### Element Positioning

Elements like **Areas**, **Views**, and **Domains** are automatically assigned an `order` value based on their position
in their respective alphabetically sorted list. This value gives you control over how those elements are arranged in the
dashboard, with lower values appearing first.

To make the most of this, it helps to understand how the strategy prioritizes a sorted list:

- Each element is assigned an `order` value that corresponds to its position in the alphabetically sorted list.<br>
  For example, if you have three areas named "Bedroom", "Kitchen", and "Living Room", they would be assigned `order`
  values of 10, 20, and 30 respectively.
- Setting this value in the configuration allows you to "pin" your most-used elements in between others.
- If two elements share the same order value, the strategy will use their names to determine which one comes first.
- Elements missing the `order` property (or set to `undefined`) will follow the prioritized list, sorted alphabetically
  by name.

The visibility of the ordering positions can be toggled with the `show_positions` option.<br>
This can be helpful when you have a long list and want to quickly identify their order values.

## Example

```yaml
strategy:
  type: custom:mushroom-strategy
  options:
    show_positions: true
    areas:
      family_room_id:
        name: Family Room
        icon: mdi:sofa
        icon_color: green
        order: 10
      kitchen_id:
        name: Kitchen
        icon: mdi:fridge
        icon_color: blue
        order: 20
```
