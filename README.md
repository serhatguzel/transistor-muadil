# Transistor Guide

A cross-platform mobile and web app for looking up **transistor equivalents** (cross-references). Search by part number to find equivalent parts and open datasheets from Datasheet Archive.

![Expo](https://img.shields.io/badge/Expo-~54-black?style=flat&logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.81-blue?style=flat&logo=react)

> **Project status:** New development and improvements are planned for this project. The codebase will be updated with additional features and enhancements.

---

## Features

- **Search by part number** — Find equivalents by typing a transistor or part number.
- **Exact match highlight** — When the query matches a part exactly, it is shown in a highlighted section.
- **Datasheet viewer** — Open datasheets in-app (WebView on mobile) or in a new tab (web) via [Datasheet Archive](https://www.datasheetarchive.com).
- **Multi-language** — Turkish (Türkçe), English, and Spanish (Español). Language preference is persisted on web.
- **Cross-platform** — Runs on **iOS**, **Android**, and **Web** with a single codebase (Expo).

---

## Tech Stack

- **Expo** (~54) with React Native
- **React** 19, **React Native** 0.81
- **expo-file-system** (legacy) for reading bundled data on native
- **react-native-webview** for in-app datasheet viewing on mobile
- **expo-asset** for bundled assets and data

---

## Prerequisites

- **Node.js** (LTS recommended)
- **npm** or **yarn**
- For native builds: **Expo Go** app (iOS/Android) or **Xcode** / **Android Studio** for development builds

---

## Installation

```bash
git clone <repository-url>
cd transistor-muadil
npm install
```

---

## Running the App

| Command | Description |
|--------|-------------|
| `npm start` | Start Expo dev server (QR code for Expo Go) |
| `npm run android` | Run on Android device/emulator |
| `npm run ios` | Run on iOS simulator/device |
| `npm run web` | Run in the browser |

After `npm start`, scan the QR code with Expo Go (Android) or the Camera app (iOS) to open the app on your device.

---

## Project Structure

```
transistor-muadil/
├── App.js                 # Main app: search, list, modal, language
├── app.json               # Expo config (name, slug, icons, splash)
├── constants.js            # Assets, URLs, UI/colors/spacing, WebView zoom
├── data/
│   └── crossref.txt       # Part number ↔ equivalents (whitespace-separated)
├── assets/                # Logo, splash assets
├── components/            # Reusable UI (e.g. AboutModal)
├── locales/               # tr, en, es translations
├── styles/                # Shared styles
└── package.json
```

---

## Data Format

The app reads `data/crossref.txt`. Each line is:

- **First token**: part number  
- **Remaining tokens**: equivalent part numbers (space- or tab-separated)

Example:

```
2N3055 2N3055
2N3235 2N3055
2N3174 TIP2955
```

You can replace or extend `crossref.txt` to update the cross-reference database; the app loads it at startup.

---

## Configuration

- **Datasheet base URL**: `constants.js` → `URLS.DATASHEET_ARCHIVE_BASE` (default: Datasheet Archive).
- **Search limits**: `constants.js` → `UI.DEFAULT_RESULTS_LIMIT`, `UI.SEARCH_RESULTS_LIMIT`.
- **App name / icon / splash**: `app.json` and `assets/`.

---

## Building for Production

The project includes **EAS** configuration (`eas.json`). To build standalone apps:

```bash
npx eas build --platform all
```

Adjust `eas.json` and Expo credentials as needed for your team.

---

## License

This project is open source. See the repository for license details.

---

## Contributing

1. Fork the repository (if applicable).
2. Create a feature branch, make your changes, and ensure the app runs with `npm start` and `npm run web`.
3. Open a pull request with a short description of the change.
