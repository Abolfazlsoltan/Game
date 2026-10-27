# Road Racer Deluxe

A Persian-friendly, full-screen perspective racing game for Android. It runs on a Canvas engine inside a Flutter WebView.

## Game modes
- **Free Drive:** explore the closed circuit without a lap limit.
- **Time Trial:** finish three laps and review session time and top speed.
- **Traffic:** drive around moving traffic and avoid collisions.
- Six car colors, rear chase view, roadside scenery, curbs, road markings, visible drift particles, and procedural engine audio.
- Touch and keyboard controls: WASD / arrows, Space or the on-screen DRIFT button for handbrake, R to reset, Esc to pause.
- Adjustable steering sensitivity, engine volume, and rendering quality.

## Modular structure
- assets/index.html — game shell and HUD.
- assets/css/game.css — styling and responsive touch layout.
- assets/js/core.js — shared state, configuration, safe preferences.
- assets/js/track.js — circuit generation, optimized nearest-track lookup, interpolation.
- assets/js/controls.js — keyboard/touch input and stuck-key protection.
- assets/js/physics.js — handling, off-road recovery, laps, traffic collisions, particles.
- assets/js/audio.js — optional Web Audio engine effect.
- assets/js/renderer.js — Canvas projection, road, scenery, cars, and effects.
- assets/js/ui.js — menus, HUD, settings, session transitions, records.
- assets/js/main.js — startup and fixed-step loop.
- lib/main.dart, lib/app.dart, lib/screens/racing_game_screen.dart — Flutter bootstrap and WebView host.

Track lookup normally checks a small neighbourhood around the last known point; a full scan is used only when the car is far away. Physics uses a capped fixed-step accumulator. The chase camera now contributes to projection, and generated slip particles are rendered.

## Build an APK
Pushes to main trigger GitHub Actions. The workflow runs JavaScript engine checks, formats and analyzes Dart, runs Flutter tests, then builds a release APK.

To download the latest build:
1. Open the repository's Actions tab.
2. Open the latest successful Build Android APK run.
3. Under Artifacts, download road-racer-android-apk and extract the APK.

GitHub Actions artifacts are retained for 14 days. Feature-branch builds do not change the main APK until merged.
