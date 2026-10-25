# Road Racer Deluxe

A full-screen, Persian-friendly perspective-view racing game packaged for Android with Flutter and an optimized HTML Canvas engine.

## Game modes
- **Free Drive:** drive the closed circuit at your own pace.
- **Time Trial:** complete three laps and view your total time and top speed.
- **Traffic:** drive around the circuit with moving traffic and collision nudges.
- Choose from six car colors before a session.
- Rear chase-camera perspective, shaded car body, roadside scenery, curbs and lane markers.
- Mobile touch controls with corrected left/right placement, plus keyboard controls (WASD / arrow keys, Space for handbrake, R to reset, Esc to pause).
- Performance-focused Canvas rendering, reduced pixel density on lower settings and less frequent HUD updates for smoother play on modest phones.
- Pause/resume, reset, responsive HUD, speed display, lap timer, particles, trees, sound toggle/volume, steering sensitivity and graphics quality settings.

## Project layout
- `assets/index.html`: game rendering, track, input, physics, UI and modes.
- `lib/main.dart`: full-screen Flutter WebView wrapper.
- `.github/workflows/build-apk.yml`: CI checks and Android release APK build.

## Build an APK
Pushes to `main` trigger GitHub Actions. The workflow creates the Android project, checks Dart formatting, runs analysis and tests, then builds a release APK.

To download the latest build:
1. Open the repository's **Actions** tab.
2. Open the latest successful **Build Android APK** run.
3. Under **Artifacts**, download `road-racer-android-apk` and extract the APK.

GitHub Actions artifacts are retained for 14 days. Changes on a feature branch do not update the `main` build until merged.
