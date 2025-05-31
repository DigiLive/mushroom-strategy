# :material-cards-outline: Card Options

The `card_options` group enables you to specify the configuration of entity cards.
Each configuration is identified by an entity id and can have the following options:

| name   | type    | default           | description                                           |
|:-------|:--------|:------------------|:------------------------------------------------------|
| hidden | boolean | `false`           | Set to `true` to exclude the card from the dashboard. |
| type   | string  | `domain specific` | The type for card to apply.                           |
| ...    | ...     | `type specific`   | An option belonging to the given card type.           |

Depending on the type of card, you can also specify options belonging to that type.

Providing a device id will enable you to hide all the entities associated with that device.

## Example

```yaml
strategy:
  type: custom:mushroom-strategy
  options:
    card_options:
      fan.master_bedroom_fan:
        type: custom:mushroom-fan-card
        icon: mdi:fan
      remote.harmony_hub_wk:
        hidden: true
      077ba0492c9bb3b3134f1f3a626a: # this is a device id
        hidden: true
```

!!! tip

    You can build your card at another dashboard and copy the `cards` group from the YAML of that dashboard into group
    `card_options` of the strategy configuration. The YAML can be found in the Raw configuration editor.
