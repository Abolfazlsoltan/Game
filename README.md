# Road Racer

A full-screen Android version of the supplied **Racing — Easy Drive** game.

## Game
- Original game HTML is kept in `assets/index.html`.
- The HTML Canvas rendering, driving physics, camera, particles, color selection, speed display, and on-screen touch controls run inside an Android WebView.
- The Flutter wrapper hides Android system bars to maximize the play area.

## Build an APK
Every push to `main` triggers GitHub Actions. The workflow generates the Android project, runs Dart formatting checks, analysis and tests, then builds a release APK.

To download the latest build:
1. Open the repository's **Actions** tab.
2. Open the latest successful **Build Android APK** run.
3. Under **Artifacts**, download `road-racer-android-apk` and extract the APK.

The artifact is temporary and is retained by GitHub Actions for 14 days.
