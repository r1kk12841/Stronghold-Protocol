# Native Android and Windows builds

The native clients are local-first shells:

- Solo mode loads the UI, game JSON, shared code, match engine, and simulation engine from the installed app.
- No WebSocket is opened at startup or while creating/playing a solo room.
- Creating or joining a co-op room lazily connects to `https://stronghold-protocol-a4ul.onrender.com`.
- Large images, Spine models, audio, and optional fonts are not embedded in APK/EXE. Their paths are mapped to the original upstream GitHub resource repositories through `data/asset-sources.map`.

## Content hosting

`public/assets/` and `public/fonts/` are intentionally ignored by Git. `npm run build-asset-sources` creates the small tracked URL map from the download ledger, so Render and native builds fetch each file directly from the credited upstream GitHub resource repositories. To override unmapped paths with your own GitHub Pages/release CDN, set an HTTPS origin that preserves `/assets/...` and `/fonts/...` paths:

```powershell
$env:SP_CONTENT_ORIGIN = "https://your-pages-or-cdn.example"
npm run native:build
```

`SP_BACKEND_ORIGIN` independently selects the co-op WebSocket backend. Keeping these settings separate ensures downloading art/audio never opens a game-server session.

## Android

Requirements: Node.js 22+, Android Studio with a supported JDK/SDK, and Android API 24 or newer.

```powershell
npm install
npm run android:add   # first time only
npm run android:sync
npm run android:open
```

Build a debug APK from the command line with `npm run android:apk` after the Android SDK is configured.

## Windows

```powershell
npm install
npm run windows:dev
npm run windows:dist
```

The portable executable is written under `dist-windows/`. The Electron window serves local files through the secure `sp://app/` protocol; Node integration is disabled and renderer sandboxing is enabled.
