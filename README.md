# Mushroom dashboard strategy

[![Release][releaseBadge]][releaseUrl]
[![HACS][hacsBadge]][hacsUrl]
[![Codacy][codacyBadge]][codacyUrl]

![Preview GIF](./docs/preview.gif)

<details>
  <summary>More images...</summary>

![Automatic](./docs/auto.png)

![Views](./docs/views.png)

![customizable](./docs/customizable.png)
</details>

## What is the Mushroom Dashboard Strategy?

Mushroom Dashboard Strategy provides a strategy for Home Assistant to automatically generate a dashboard
using [Mushroom][mushroomUrl] cards.

Dashboard cards are generated for your Home Assistant's entities, devices and areas, divided over several views.
Starting at the Home view, you can enter an area subview.
For easy access, separate views are generated for entities which belong to specific domains.

### Features

* 🛠 Automatically create a dashboard with three lines of YAML.
* 😍 Built-in Views for device-specific controls.
* 🎨 Many options to customize to fit your needs.
* 📈 [Mini graph][miniGraphUrl] cards for sensor entities.

> [!TIP]
> If you like this package, please star the [project at GitHub][repositoryUrl]!

## Getting started

The strategy is easily installable from [HACS][hacsUrl] (Home Assistant Community Store).
Please visit [Installation Guide][installationUrl] at our Wiki.

## Need some help?

Visit the [Discussions][discussionsUrl] page or
the [Wiki][wikiUrl].

## Have an idea or want to report a bug?

Make sure your idea or bug isn't discussed already in our Discussions or Issues!
Visit the [issues][issuesUrl] page.

## Collaborators

* [DigiLive](https://github.com/DigiLive)

  [![Sponsor DigiLive][sponsorBadge]](https://github.com/sponsors/DigiLive)

* [Aalian Khan](https://github.com/AalianKhan)

<!-- Badge References -->

[codacyBadge]: https://app.codacy.com/project/badge/Grade/24de1e79aea445499917d9acd5ce9e04

[hacsBadge]: https://img.shields.io/badge/HACS-Default-blue

[releaseBadge]: https://img.shields.io/github/v/tag/digilive/mushroom-strategy?filter=v2.3.3-alpha.1&label=Release

[sponsorBadge]: https://img.shields.io/badge/Sponsor_him-%E2%9D%A4-%23db61a2.svg?&logo=github&color=%23fe8e86

<!-- Repository References -->

[codacyUrl]: https://app.codacy.com/gh/DigiLive/mushroom-strategy/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade

[repositoryUrl]: https://github.com/DigiLive/mushroom-strategy

[releaseUrl]: https://github.com/DigiLive/mushroom-strategy/releases/tag/v2.3.3-alpha.1

[issuesUrl]: https://github.com/DigiLive/mushroom-strategy/issues

[discussionsUrl]: https://github.com/DigiLive/mushroom-strategy/discussions

[wikiUrl]: https://github.com/DigiLive/mushroom-strategy/wiki

[installationUrl]: https://github.com/DigiLive/mushroom-strategy/wiki#installation

<!-- Other References -->

[hacsUrl]: https://hacs.xyz

[mushroomUrl]: https://github.com/piitaya/lovelace-mushroom

[miniGraphUrl]: https://github.com/kalkih/mini-graph-card
