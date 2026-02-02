# Tilt Volume Controller

Control system volume by tilting your device. This is a small React + Vite demo that uses device orientation data to map tilt to volume and shows a live volume indicator.

## Features

- Tilt-to-volume mapping with smooth updates
- Live volume indicator
- Clean, minimal UI
- Simple hook-based architecture

## Tech Stack

- React
- Vite
- JavaScript
- CSS

## Getting Started

1. Install dependencies:

	npm install

2. Start the dev server:

	npm run dev

3. Open the app in your browser:

	http://localhost:5173

## Usage

- On a supported mobile device, allow motion/orientation access when prompted.
- Tilt the device forward/back to change the volume.
- Use on-screen controls (if available) to calibrate or reset.

## Project Structure

- src/App.jsx — app shell
- src/components/Controls.jsx — UI controls
- src/components/VolumeIndicator.jsx — volume visualization
- src/hooks/useTilt.js — device orientation handling
- src/hooks/useAudio.js — audio/volume handling

## Notes

- DeviceOrientation support varies by browser and requires HTTPS on most platforms.
- iOS Safari requires explicit permission for motion sensors.

## Scripts

- npm run dev — start dev server
- npm run build — production build
- npm run preview — preview production build

## License

MIT
