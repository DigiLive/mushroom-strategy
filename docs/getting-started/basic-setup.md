# Basic Setup

To apply the Mushroom Strategy to a dashboard:

1. In the UI of the dashboard, select :material-pencil: in the top right corner.
2. If not taken to a Raw Configuration editor, click the three-dot menu in the top right corner.
3. Select `Raw configuration editor`.
4. Empty the configuration and add the following lines:

   ```yaml
   strategy:
     type: custom:mushroom-strategy
   views: []
   ```

> [!NOTE]
> You may see the following error:

```
 Error loading the dashboard strategy:
     Error: Timeout waiting for strategy
     element ||-strategy-mushroom-strategy to
     be registered
```

This is mainly because of cache issues or HACS didn't create a reference.  
Try clearing the cache of your client and/or re-downloading the strategy from HACS.

If it still doesn't work, please consult guide
[How to solve: Error loading the dashboard strategy](https://github.com/DigiLive/mushroom-strategy/discussions/90).
