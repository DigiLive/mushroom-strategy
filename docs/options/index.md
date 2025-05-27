# Overview

The dashboard can be highly customized using the `options` parameter in the yaml configuration of your dashboard.

   ```yaml
   strategy:
     type: custom:mushroom-strategy
     options:
       # Custom Configuration
   ```

By default,

- All views and domains are enabled.
- All chips are enabled and count the number of "active" entities.
- For the weather chip, the entity is selected automatically unless you specify one.
- All entities without an area are added to the `undisclosed` area.
- All configuration- and diagnostic entities are hidden.

The options are divided into groups as described below.

| Name               | Type           | Default               | Description                                                                                                                               |
|:-------------------|:---------------|:----------------------|:------------------------------------------------------------------------------------------------------------------------------------------|
| areas              | object         | undisclosed           | See [Area Options](area-options.md).                                                                                                      |
| card_options       | object         | empty                 | See [Card Options](card-options.md).                                                                                                      |
| domains            | object         | All supported domains | See [Domain Options](domain-options.md).                                                                                                  |
| home_view          | object         | unset                 | See [Home View Options](home-view-options.md).                                                                                            |
| chips              | object         | All supported chips   | See [Chip Options](home-view-options.md#chip-options).                                                                                    |
| quick_access_cards | array of cards | empty                 | List of cards to show between the greeting card and the area cards.<br>See [Quick Access Cards](home-view-options.md#quick-access-cards). |
| extra_cards        | array of cards | empty                 | List of cards to show below the area cards.<br>See [extra Cards](home-view-options.md#extra-cards).                                       |
| views              | object         | All supported views   | See [View Options](view-options.md).                                                                                                      |
| extra_views        | array of views | empty                 | List of user defined views to add to the dashboard.<br>See [Extra Views](view-options.md#extra-views).                                    |

## Example

```yaml
strategy:
  type: custom:mushroom-strategy
  options:
    areas:
      family_room_id:
        name: Family Room
        icon: mdi:sofa
        icon_color: green
```
