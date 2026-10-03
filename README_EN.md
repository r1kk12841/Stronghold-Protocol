# Stronghold Protocol: Covenant

[中文](README.md) · [English](README_EN.md)

An **unofficial, non-commercial fan remake** of Arknights' seasonal auto-chess tower-defense mode, *Stronghold Protocol: Covenant*. It runs in a browser and supports solo play or 1–4 player co-op.

![version](https://img.shields.io/badge/version-0.1.0-2ea44f)
![license](https://img.shields.io/badge/code%20license-GPL--3.0--or--later-blue)
![node](https://img.shields.io/badge/node-22%20%7C%2024-339933)

## Original project credit

This repository is a fork of **[sganggs/Stronghold-Protocol](https://github.com/sganggs/Stronghold-Protocol)**.

The original author and contributors created the core game, server, combat simulation, rendering system, game-data pipeline, and project documentation. This fork builds on their work and adds an English interface and an offline English game-data catalog sourced from community translations.

Please visit and credit the original repository when sharing or building on this fork.

## Important disclaimer

> [!IMPORTANT]
> - This is an unofficial fan project. It is not affiliated with, authorized by, or endorsed by Hypergryph, Yostar, or their affiliates.
> - Arknights names, characters, artwork, music, sound effects, text, and game data belong to their respective rights holders. These materials are **not** covered by the GPL-3.0 license; the license only covers original project code.
> - This project is for study, discussion, and personal non-commercial use only. Selling the project, paid distribution, paid hosting, advertising, donations, memberships, or any other form of monetization is prohibited.
> - The source repository does not include game artwork or audio. Release bundles may include assets for player convenience. Do not redistribute those assets separately or use them outside this project. See [NOTICE.md](NOTICE.md).
> - If a rights holder believes this project infringes their rights, please open an issue. Relevant content will be removed promptly.
> - The project is provided "as is", without warranty. Use it at your own risk.

| Alliance room | Strategy draft | Rest Phase — Shop and Alliances |
|---|---|---|
| ![Room](docs/img/room.jpg) | ![Strategy draft](docs/img/band-draft.jpg) | ![Rest Phase](docs/img/prep.jpg) |
| **Facing selector** | **Combat** | **Final Assault** |
| ![Facing selector](docs/img/facing-wheel.jpg) | ![Combat](docs/img/combat.jpg) | ![Final Assault](docs/img/final-assault.jpg) |

## Overview

Stronghold Protocol combines auto chess with tower defense. During each Rest Phase, players recruit Operators, arrange their formation, and issue equipment. During combat, Operators deploy automatically and defend against enemies entering from red gates. Enemies that reach a blue gate reduce Life Points.

- **Solo Simulation** and **Alliance Simulation** for 1–4 cooperative players. Empty seats can be filled by AI teammates. There is no PvP.
- A Node.js server manages rooms, turns, and the economy. By default, each player's browser simulates its own combat, keeping server requirements low.
- Chinese and English can be selected from the title screen or Settings. The selection is saved locally.
- The project aims to reproduce official rules and values using official game data and community research. Some behavior may still be inferred; corrections are welcome.

## Features

- A complete run: briefing, Strategy draft, 14 rounds, Final Assault, and result titles. Perilous difficulty and above may unlock the round-15 Hidden Core.
- Four difficulty levels with separate solo and co-op parameters.
- Recruitment, refresh, freeze, Dispatch Center upgrades, Bench and Temporary Bench management, drag-and-drop deployment, and directional facing.
- Elite promotion by combining three copies of the same Operator, followed by a free higher-tier recruitment reward.
- 112 recruitable Operators plus Elite variants, selectable Skills, Talents, Attributes, and Elite Modules.
- 23 Alliances, including eight core faction Alliances and additional Alliances. Stacks persist through a run.
- Equipment, Arts, equipment combinations, tactical Choice cards, bounties, Funds, Operators, and Alliance-stack rewards.
- Automatic Skill activation, blocking, redeployment, elemental damage and bursts, summons, push and pull mechanics, and live battlefield status.
- Terrain devices including roadblocks, platforms, Originium airflow, swamps, vents, tides, and other stage mechanics.
- Joint Defense: teammates with perfect defenses can help intercept enemies leaked by another player.
- Final Assault and Hidden Core use shared battlefields and a shared leader HP pool. Ten enemy leaders are included.
- Reconnection support: 10 minutes for co-op runs and 24 hours for solo runs in the same browser.
- Desktop and mobile controls, touch dragging, long-press details, graphics-quality settings, official-style Spine models, BGM, sound effects, emotes, and optional extracted 3D board assets.

## Quick start

### Run from source

Requirements: Node.js 22 or 24 LTS and approximately 400–500 MB of free disk space after downloading dependencies and assets.

```bash
git clone https://github.com/r1kk12841/Stronghold-Protocol.git
cd Stronghold-Protocol
npm install
npm run setup
npm start
```

Open <http://localhost:3000> if the browser does not open automatically.

`npm run setup` checks the environment and downloads approximately 250 MB of art and audio from public mirrors. Downloads can be resumed by running the command again. If no local Arknights client is detected, the game uses the included 2D board.

You can also use the launcher scripts:

- Windows: double-click `scripts\start-windows.bat`.
- macOS or Linux: run `./scripts/start.sh` or `bash scripts/start.sh`.
- Diagnostics: run `npm run doctor` to check Node.js, assets, port availability, LAN addresses, and firewall guidance.

### Release bundle

If a prepared bundle is available, download it from [Releases](../../releases/latest), extract it to a short local path, and use the launcher script above. On Windows, allow private-network access when the firewall prompt appears.

## English localization

Use the persistent `中文 / EN` switch on the title screen or select the language in Settings.

The English catalog is generated into `data/i18n-en.json` and packaged with the application, so third-party translation sites are not contacted during gameplay.

- Primary translation source: [Terra Archive — Stronghold Protocol](https://terra-archive.net/en/autochess).
- Cross-check source: [Stronghold Protocol Database](https://ak-spa-database.pages.dev/?tab=Attributes).
- Rebuild the catalog with `npm run build-i18n-en`.

Community translations remain the work of their respective authors and maintainers.

## Playing with friends

### Local network

1. Open the game, enter a callsign, and choose **Alliance Simulation**.
2. Create a room and select the difficulty. The host may add or remove AI teammates.
3. Share the four-character Alliance Key or the generated `?room=KEY` invitation link.
4. Friends on the same network can open the LAN address printed by the launcher, such as `http://192.168.x.x:3000`.
5. When everyone is ready, the host starts the simulation.

If another device cannot connect, allow Node.js through the private-network firewall and check that the Wi-Fi network does not use client or AP isolation.

### Internet play and deployment

For players outside the same LAN, use a trusted virtual-LAN tool, a tunnel, or a VPS with a reverse proxy. The application uses a persistent Node.js process and WebSocket endpoint at `/ws`; static-only and serverless hosting platforms are not suitable.

Full deployment guidance is available in [docs/DEPLOY.md](docs/DEPLOY.md).

The game has no account system. Anyone who knows the server address can connect, so share it only with people you trust and do not operate a public lobby.

## Controls

| Action | Control |
|---|---|
| Buy, upgrade, or select a Choice card | Click once to select, then click again to confirm. Press `D` to upgrade the Dispatch Center. |
| Deploy or move an Operator | Drag from the Bench to a board tile, choose a direction on the facing selector, then release. |
| Change facing | Drag an Operator back onto its current tile and choose another direction. |
| Sell, retreat, or destroy | Select the unit's tile and use the action buttons. A deployed Operator may also be dragged back to the Bench. |
| Issue equipment | Drag equipment onto an Operator. Each Operator may hold two items; replacing an item destroys the replaced one. |
| Use an Art | Drag it onto a valid tile and choose a direction. |
| View details | Right-click or long-press a unit or card. |
| Keyboard shortcuts | `R` refresh · `F` freeze · `D` upgrade · `Space` ready/pause · `Esc` cancel/close. |
| Facing selector | Arrow keys preview · `Enter` confirm · `Esc` cancel. |
| Pause in solo combat | Use the top-bar Pause button or press `Space`. Co-op combat cannot be paused. |
| Spectate | After finishing your battle, or during Rest, select a teammate and choose **Spectate**. |

## Configuration

The server listens on TCP port `3000` by default.

| Environment variable | Default | Description |
|---|---:|---|
| `PORT` | `3000` | Listening port. |
| `HOST` | `0.0.0.0` | Listening address. Use `127.0.0.1` behind a local reverse proxy. |
| `SP_COMBAT` | `client` | `client` simulates combat in browsers; `server` simulates it on the server. |
| `SP_VERIFY` | `off` | Server verification of reported combat: `off`, `sample`, or `all`. |
| `TRUST_PROXY` | `auto` | Controls whether forwarded client-address headers are trusted. |
| `DEBUG` | empty | Enable detailed logs when set. |
| `SP_NO_BROWSER` | empty | Set to `1` to prevent launcher scripts from opening a browser. |

Examples:

```bash
# macOS / Linux
PORT=8080 npm start

# PowerShell
$env:PORT=8080; npm start
```

Health check: `GET /healthz`.

## Development and tests

```bash
npm run dev
node --test
npm run build-i18n-en
```

Additional browser and rendering test commands are documented in the main [Chinese README](README.md#开发与测试). Tests that require Chrome or optional assets are skipped when those dependencies are unavailable.

Do not manually edit generated game-data files. `npm run build-data` rebuilds official game data, and `npm run build-i18n-en` rebuilds the English overlay.

## Project structure

| Path | Purpose |
|---|---|
| `server/` | Node.js HTTP server, WebSocket lobby, match engine, and shared combat simulation. |
| `shared/` | Constants and protocol definitions shared by client and server. |
| `public/` | Browser client, Preact/htm UI, PixiJS renderer, and optional Three.js board. |
| `data/` | Generated game data, English catalog, and asset manifest. |
| `tools/` | Setup, diagnostics, asset download, data generation, and local extraction tools. |
| `scripts/` | Windows, macOS, and Linux launch scripts. |
| `docs/` | Architecture, gameplay, deployment, data, and research documentation. |
| `test/` | Node.js unit and integration tests. |

## Documentation

- [Gameplay guide](docs/PLAYING.md)
- [Deployment guide](docs/DEPLOY.md)
- [Architecture and design](docs/DESIGN.md)
- [Combat simulation reference](docs/SIM.md)
- [Match and economy engine](docs/META.md)
- [Game-data pipeline](docs/DATA.md)
- [Asset pipeline and sources](docs/ASSETS.md)
- [Balance methodology](docs/BALANCE.md)
- [Research index](docs/research/00-INDEX.md)

Some documents are currently available only in Chinese; architecture and implementation references are primarily written in English.

## License

- Original project code is released under **GPL-3.0-or-later**. See [LICENSE](LICENSE).
- An additional GPL section 7 permission covers distribution together with the Spine Runtimes included through pixi-spine. See [NOTICE.md](NOTICE.md).
- Arknights game assets and data are excluded from the GPL license and remain the property of their respective rights holders.
- Third-party components retain their own licenses. See [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

## Credits and data sources

- **Original project:** [sganggs/Stronghold-Protocol](https://github.com/sganggs/Stronghold-Protocol).
- Game data: [Kengxxiao/ArknightsGameData](https://github.com/Kengxxiao/ArknightsGameData).
- Asset sources: [yuanyan3060/ArknightsGameResource](https://github.com/yuanyan3060/ArknightsGameResource), [fexli/ArknightsResource](https://github.com/fexli/ArknightsResource), [isHarryh/Ark-Models](https://github.com/isHarryh/Ark-Models), and [ArknightsAssets/ArknightsAssets2](https://github.com/ArknightsAssets/ArknightsAssets2).
- Rules reference: [PRTS Wiki](https://prts.wiki/).
- Font sources: [TimWangZi/The-font-of-Arknights](https://github.com/TimWangZi/The-font-of-Arknights) and Google Fonts.
- Libraries: [PixiJS](https://pixijs.com/), [pixi-spine](https://github.com/pixijs/spine), [three.js](https://threejs.org/), [Preact](https://preactjs.com/), [htm](https://github.com/developit/htm), and [ws](https://github.com/websockets/ws).
- English community data: [Terra Archive](https://terra-archive.net/en/autochess) and [Stronghold Protocol Database](https://ak-spa-database.pages.dev/?tab=Attributes).

Thank you to the original project's author and contributors, all referenced community projects, the translation maintainers, and Hypergryph for creating Arknights.

## Contributing

Bug reports, corrections to game behavior, documentation improvements, and pull requests are welcome.

- Run `node --test` before submitting changes.
- Submitted code is licensed under GPL-3.0-or-later.
- Do not commit game asset files; asset directories are excluded by `.gitignore`.
- Do not add advertising, payment, donation, or other monetization features.
