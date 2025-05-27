# Installation

## Prerequisites

Mushroom dashboard strategy and dependencies are available in [HACS][hacsUrl]{: target="_blank"} (Home Assistant
Community Store).  
Install HACS if you don't have it already.  
For assistance, you can follow the [installation guide][hacsInstallationGuideUrl]{: target="_blank"}.

Once you have HACS installed, you can install custom integration and plug-ins.  
This guide offers you badges to open your Home Assistant on the correct page.  
If the badges don't work, try installing from HACS manually:

1. Open HACS in Home Assistant (Usually in the menu on the left side).
2. At the top, search for the component you want to install.
3. Select the `three-dot` menu on the right side of the component and select `Download`.
4. Choose the desired version and select `Download` again.

You need to install the following HACS integrations before you can use this strategy.  
Click the badges below and follow the installation instructions.  
They will open the HACS repository at your Home Assistant instance directly.

[![Open in HACS at your Home Assistant instance.][hacsBadge]][hacsMushroomUrl]{: target="_blank"} to install
[Mushroom][mushroomUrl]{: target="_blank"}.  
[![Open in HACS at your Home Assistant instance.][hacsBadge]][hacsMiniGraphUrl]{: target="_blank"} to
install [Mini graph card][miniGraphUrl]{: target="_blank"}.

## Dashboard Installation

If you meet all the prerequisites, click the badge below to install the strategy.

[![Open in HACS at your Home Assistant instance.][hacsBadge]][hacsStrategyUrl]{: target="_blank"}

## Local Installation

Please install the strategy with HACS as described above.  
If you require testing a custom build for debug purposes, follow these steps:

1. Build the strategy with `npm build` or `npm build-dev`.
2. Copy the build file(s) to folder `<your-hass-directory>/www/community/mushroom-strategy`.
3. If file `mushroom-strategy.js.gz` exists in that folder, rename or delete it.

!!! note
    Refresh the cache of the client you use to access Home Assistant.

## Updating

By default, Home Assistant will notify you when an update of the strategy is available.  
You can update the strategy by going to `Settings` found at the bottom of the sidebar.

!!! tip
    You can enable notifications of pre-releases.

    * Go to `Settings` > `Devices & services` > `Entities`.
    * Search for `Mushroom Dashboard` and switch on the `Pre-release` entity.

<!-- References -->

[hacsUrl]: https://hacs.xyz

[hacsInstallationGuideUrl]: https://hacs.xyz/docs/setup/prerequisites

[hacsBadge]: https://img.shields.io/badge/Open%20my%20HACS%20Repository-%2318BCF2?logo=homeassistant&logoColor=%23FFFFFF&labelColor=%2318BCF2

[mushroomUrl]: https://github.com/piitaya/lovelace-mushroom

[hacsMushroomUrl]: https://my.home-assistant.io/redirect/hacs_repository/?owner=piitaya&repository=lovelace-mushroom&category=frontend

[miniGraphUrl]: https://github.com/kalkih/mini-graph-card

[hacsMiniGraphUrl]: https://my.home-assistant.io/redirect/hacs_repository/?owner=kalkih&repository=mini-graph-card&category=frontend

[hacsStrategyUrl]: https://my.home-assistant.io/redirect/hacs_repository/?owner=DigiLive&repository=mushroom-strategy&category=frontend
