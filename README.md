# Road Racer — Flet Prototype

A small top-down driving game prototype built with Python and Flet.

## Features

- Detailed red car built from native Flet controls
- Road with lane markings and roadside grass
- Touch controls to steer left and right
- Toggleable turbo speed
- Distance counter and restart button
- Android APK build through GitHub Actions

## Run locally

```bash
python -m pip install -r requirements.txt
python main.py
```

## Build Android APK

Every push to `main` starts the **Build Android APK** GitHub Actions workflow. When it succeeds, open the workflow run and download the `road-racer-apk` artifact.

Workflow runs: https://github.com/Abolfazlsoltan/Game/actions/workflows/build-apk.yml
