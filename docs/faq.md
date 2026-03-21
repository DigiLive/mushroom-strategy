# Frequently Asked Questions

??? question "How do I add a device or entity to an area?"

    You can add devices to an area by going to `Settings` found at the bottom of the sidebar.

    1. Select `Devices & services`.
    2. Select `Devices` or `Entities`at the top.
    3. Choose the device or entity you wish to add to an area.
    4. Select :material-pencil: or :material-cog: in the top right corner.
    5. Choose an area in the area field.

    !!! warning
        If you created an entity manually (in your `configuration.yaml`), you may need to create a `unique_id` before 
        you can set an area to it.  
        See Home Assistant's [documentation](https://www.home-assistant.io/faq/unique_id){: target="_blank"} for more 
        info about unique ids.

??? question "How do I hide entities from the Strategy?"

    When creating this dashboard for the first time, you might be overwhelmed by the number of entities.  
    To reduce the number of entities shown, you can hide these entities by following the steps below:
    
    1. Click and hold the entity.
    2. Click :material-cog: in the top right corner of the popup.
    3. Set `Visible` to `off`.
    
    
    !!! note
        If you don't want to hide the entity from all dashboards, you can use [Card Options](options/card-options.md)
        to hide specific entities and devices.

??? question "How do I get the id of entities, devices and areas?"

    * Entity Id
        1. Select `Settings` at the bottom of the sidebar.
        2. Select `Devices & services`.
        3. Select `Entities` at the top.
        4. Choose the entity you want to get the id of.
        5. Click :material-cog: in the top right corner of the popup.

    * Device Id
        1. Select `Settings` at the bottom of the sidebar.
        2. Select `Devices & services`.
        3. Select `Devices` at the top.
        4. Select the device you want to get the id of.
        5. The device id is shown as the **last** part of the url in the address bar.
           E.g.: `https://.../config/devices/device/h55b6k54j76g56`

    * Area Id
        1. Select `Settings` at the bottom of the sidebar.
        2. Select `Areas`.
        3. Select :material-pencil: of the area you want to get the id of.

??? question "I'm presented with "Edit dashboard" instead of the "Raw configuration editor". What do I do?"

    This happens if you've removed the `options` key from your dashboard configuration.
    
    The easiest way to fix this is to delete the dashboard and follow the steps of the 
    [Basic Setup](getting-started/basic-setup.md) again.

??? question "Can I get the raw YAML code which the strategy generates?"

    You can get the generated YAML, but **NOT** without "Taking Control" of the dashboard.
    
    After setting up the strategy and options to your linking, you can follow these steps:
    
    1. Click the :material-pencil: icon in the top right corner of the dashboard.<br>
       The **Raw configuration** editor will open.
    2. Delete the entire content of the editor and replace it with the following code:
    
        ```yaml
        strategy:
          type: custom:mushroom-strategy
        ```

    3. Click `Save` and exit the edit mode.
    4. Click the :material-pencil: icon in the top right corner of the dashboard.<br>
       The **Dashboard** editor will open.
    5. Click the three-dot menu in the top right corner of the editor.
    6. Select `Take control`.
    7. Click `Take control`.<br>
       `Start with an empty dashboard` will not have any effect.
    8. Click `Done` at the top right corner of the dashboard.
    
    You can now edit the dashboard as you would normally do with any other dashboard.

    To get the YAML:

    1. Click the :material-pencil: icon in the top right corner of the dashboard.
    2. Click the three-dot menu in the top right corner of  the dashboard.
    3. Select `Raw configuration editor`.
