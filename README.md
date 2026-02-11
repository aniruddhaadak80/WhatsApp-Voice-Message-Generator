# VoiceCraft - AI Voice Message Generator

VoiceCraft is a web application that converts typed text into natural-sounding voice messages suitable for sharing on WhatsApp, Telegram, and other messaging platforms. It is built on top of the Sarvam AI Bulbul v3 text-to-speech engine, which provides access to 39 distinct AI speaker voices across 11 Indian languages.

The application is designed for people who prefer sending voice messages but find themselves in noisy environments, have speech difficulties, or want to communicate in a language they cannot pronounce fluently. Rather than recording a voice note directly, users type their message, choose a voice personality, and generate a polished audio file in seconds.


## Table of Contents

1. [Features](#features)
2. [Supported Languages](#supported-languages)
3. [Available Speakers](#available-speakers)
4. [Emotion Presets](#emotion-presets)
5. [Technology Stack](#technology-stack)
6. [Project Structure](#project-structure)
7. [Prerequisites](#prerequisites)
8. [Installation](#installation)
9. [Configuration](#configuration)
10. [Running the Application](#running-the-application)
11. [Usage Guide](#usage-guide)
12. [API Reference](#api-reference)
13. [Favorites System](#favorites-system)
14. [Keyboard Shortcuts](#keyboard-shortcuts)
15. [Design System](#design-system)
16. [Browser Compatibility](#browser-compatibility)
17. [Troubleshooting](#troubleshooting)
18. [License](#license)


## Features

### Text-to-Speech Conversion
Users can type any message up to 2,500 characters and convert it into a natural-sounding voice message. The application supports code-mixed text, meaning users can freely mix English and Indian language words within the same message. Numbers larger than four digits should use commas (for example, "10,000" instead of "10000") to ensure proper pronunciation.

### 39 AI Speaker Voices
The application provides access to all 39 speaker voices available in Sarvam AI's Bulbul v3 model. Each speaker has a unique vocal identity, and users can browse through a searchable grid of speaker cards to find the voice that best matches their intent. Speakers are visually categorized by gender with distinct avatar colors.

### 11 Indian Language Support
Messages can be generated in Hindi, English (Indian), Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, and Odia. The language selection determines how the text normalization model processes language-specific formatting such as number pronunciation, abbreviations, and special characters.

### Adjustable Speaking Pace
A pace control slider allows users to set the speaking speed anywhere from 0.5x (very slow) to 2.0x (very fast) in increments of 0.1. The current pace value is displayed in a post-it style bubble with a human-readable label such as "Normal speed" or "Very fast."

### Emotion Presets
Six quick-mood preset buttons allow users to instantly configure a speaker and pace combination that matches a desired tone. Each preset selects a specific speaker voice and adjusts the pace slider automatically.

### Audio Playback with Waveform Visualization
After generating a voice message, the application displays a custom audio player with play/pause controls, a seekable progress bar, elapsed and total time display, and an animated waveform visualization. The waveform bars are color-coded to show playback progress.

### Favorites System
Users can save their preferred voice-text combinations to a favorites panel backed by browser localStorage. Each favorite stores the message text, selected speaker, language, and pace setting. Favorites can be reloaded to instantly restore all settings, or deleted individually.

### Download and Share
Generated voice messages can be downloaded as WAV audio files. On devices and browsers that support the Web Share API (such as mobile Chrome and Edge), users can share the audio file directly to WhatsApp, Telegram, or any other installed messaging application. If sharing is not supported, the application falls back to downloading the file.


## Supported Languages

| Language Code | Language         | Script     |
|---------------|------------------|------------|
| hi-IN         | Hindi            | Devanagari |
| en-IN         | English (Indian) | Latin      |
| bn-IN         | Bengali          | Bengali    |
| ta-IN         | Tamil            | Tamil      |
| te-IN         | Telugu           | Telugu     |
| mr-IN         | Marathi          | Devanagari |
| gu-IN         | Gujarati         | Gujarati   |
| kn-IN         | Kannada          | Kannada    |
| ml-IN         | Malayalam        | Malayalam  |
| pa-IN         | Punjabi          | Gurmukhi   |
| od-IN         | Odia             | Odia       |


## Available Speakers

The Bulbul v3 model provides 39 distinct speaker voices. The speaker names as accepted by the API are all lowercase:

**Female voices:** ritu, priya, neha, pooja, simran, kavya, ishita, shreya, roopa, amelia, sophia, tanya, shruti, suhani, kavitha, rupali

**Male voices:** shubh (default), aditya, rahul, rohan, amit, dev, ratan, varun, manan, sumit, kabir, aayan, ashutosh, advait, anand, tarun, sunny, mani, gokul, vijay, mohit, rehan, soham


## Emotion Presets

| Preset Name | Speaker | Pace | Intended Tone                          |
|-------------|---------|------|----------------------------------------|
| Formal      | Aditya  | 1.0x | Professional and measured delivery     |
| Friendly    | Priya   | 1.1x | Warm and conversational                |
| Energetic   | Neha    | 1.3x | Upbeat and enthusiastic                |
| Calm        | Kavya   | 0.9x | Relaxed and soothing                   |
| Confident   | Rahul   | 1.2x | Assertive and self-assured             |
| Warm        | Simran  | 0.95x| Gentle and comforting                  |


## Technology Stack

| Component       | Technology                                    |
|-----------------|-----------------------------------------------|
| Build Tool      | Vite 5.4                                      |
| Language         | Vanilla JavaScript (ES Modules)              |
| Markup          | HTML5                                         |
| Styling         | Vanilla CSS with custom design system         |
| TTS Engine      | Sarvam AI Bulbul v3 REST API                  |
| Fonts           | Google Fonts (Kalam, Patrick Hand)            |
| Icons           | Font Awesome 6.5                              |
| Storage         | Browser localStorage for favorites            |
| Sharing         | Web Share API with download fallback          |


## Project Structure

```
voice-msg-generator/
    .env                 API key configuration (git-ignored)
    .gitignore           Git ignore rules
    index.html           Main HTML document
    main.js              Application logic, API integration, UI handlers
    package.json         Node.js project configuration
    style.css            Complete stylesheet with hand-drawn design system
    vite.config.js       Vite development server configuration
```


## Prerequisites

1. Node.js version 18 or higher installed on your system.
2. npm (included with Node.js) for package management.
3. A valid Sarvam AI API subscription key. You can obtain one by signing up at https://dashboard.sarvam.ai/.


## Installation

Clone or download the project, then install the dependencies:

```bash
cd voice-msg-generator
npm install
```

This will install Vite as the sole development dependency.


## Configuration

The application requires a Sarvam AI API key to function. The key is stored in a `.env` file at the project root. This file is included in `.gitignore` to prevent accidental exposure.

Create or edit the `.env` file:

```
VITE_SARVAM_API_KEY=your_api_key_here
```

Vite exposes environment variables prefixed with `VITE_` to the client-side code through `import.meta.env`. The API key is accessed in `main.js` as `import.meta.env.VITE_SARVAM_API_KEY`.

**Important:** Since this is a client-side application, the API key will be visible in the browser's network requests. For production use, consider implementing a backend proxy to keep the key server-side.


## Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/` and will automatically open in your default browser. Vite provides hot module replacement, so any changes to the source files will be reflected immediately without a full page reload.

To build for production:

```bash
npm run build
```

The production-ready files will be generated in the `dist/` directory. To preview the production build locally:

```bash
npm run preview
```


## Usage Guide

### Step 1: Type Your Message
Enter the text you want to convert to speech in the message textarea. The character counter below the input shows your current count against the 2,500-character limit. You can write in any supported Indian language or mix languages freely.

### Step 2: Select a Speaker
Browse the speaker grid on the right panel. Click on any speaker card to select it. The active speaker is highlighted with a yellow background and red border. Use the search bar above the grid to filter speakers by name.

Alternatively, click one of the six emotion preset buttons (Formal, Friendly, Energetic, Calm, Confident, Warm) to automatically select a speaker and pace combination.

### Step 3: Choose a Language
Select the target language from the dropdown. This determines how the text normalization engine processes your input. If your message is in Hindi, select Hindi. For English messages, select English (Indian).

### Step 4: Adjust the Pace
Move the pace slider between 0.5x and 2.0x to control how fast the generated voice speaks. The current value is shown in the bubble below the slider along with a descriptive label.

### Step 5: Generate the Voice Message
Click the "Generate Voice Message" button. The button will show a loading animation while the API processes your request. Once complete, the audio player section appears with your generated voice message already playing.

### Step 6: Listen, Download, or Share
Use the audio player controls to play, pause, and seek through the message. The waveform visualization shows playback progress in real time. Three action buttons are available:
1. Heart icon: Save the current text, speaker, language, and pace combination to your favorites.
2. Download icon: Download the audio as a WAV file.
3. Share icon: Share the audio file directly to messaging apps (on supported devices) or download as a fallback.


## API Reference

The application communicates with the Sarvam AI Text-to-Speech REST API.

### Endpoint

```
POST https://api.sarvam.ai/text-to-speech
```

### Request Headers

| Header                 | Value                          |
|------------------------|--------------------------------|
| Content-Type           | application/json               |
| api-subscription-key   | Your Sarvam AI API key         |

### Request Body

```json
{
  "inputs": ["Your message text here"],
  "target_language_code": "hi-IN",
  "speaker": "aditya",
  "pace": 1.0,
  "model": "bulbul:v3"
}
```

| Parameter              | Type     | Description                                          |
|------------------------|----------|------------------------------------------------------|
| inputs                 | string[] | Array containing the text to convert (max 2500 chars)|
| target_language_code   | string   | BCP-47 language code (see Supported Languages table) |
| speaker                | string   | Lowercase speaker name (see Available Speakers)      |
| pace                   | number   | Speaking speed from 0.5 to 2.0 (default 1.0)        |
| model                  | string   | Must be "bulbul:v3"                                  |

### Response Body

```json
{
  "request_id": "unique-request-identifier",
  "audios": ["base64-encoded-audio-string"]
}
```

The `audios` array contains base64-encoded WAV audio data. The application decodes this into a binary blob and creates an object URL for playback and download.

### Important Notes

1. The `enable_preprocessing` parameter is not supported for Bulbul v3 and must not be included in the request body.
2. Speaker names must be sent in lowercase regardless of how they are displayed in the UI.
3. For numbers larger than four digits, include commas in the text (for example, "10,000") to ensure correct pronunciation.
4. The model supports code-mixed text with English and Indian languages in the same input.


## Favorites System

Favorites are stored in the browser's localStorage under the key `voicecraft_favorites` as a JSON array. Each favorite entry contains:

| Field     | Type   | Description                                |
|-----------|--------|--------------------------------------------|
| text      | string | The original message text                  |
| speaker   | string | The selected speaker name                  |
| language  | string | The BCP-47 language code                   |
| pace      | string | The pace value as a string (e.g., "1.0")   |
| timestamp | number | Unix timestamp in milliseconds             |

Favorites persist across browser sessions but are local to the browser. Clearing browser data or localStorage will remove all saved favorites.


## Keyboard Shortcuts

| Shortcut         | Action                          |
|------------------|---------------------------------|
| Ctrl + Enter     | Generate voice message          |
| Cmd + Enter      | Generate voice message (macOS)  |


## Design System

The application uses a "Hand-Drawn" design aesthetic inspired by physical sketchbooks and sticky notes. The visual identity is defined by the following characteristics:

### Typography
Headings use the Kalam font at weight 700, which resembles thick felt-tip marker writing. Body text uses Patrick Hand at weight 400, providing a legible but distinctly handwritten appearance.

### Color Palette

| Token            | Value     | Usage                             |
|------------------|-----------|-----------------------------------|
| Background       | #fdfbf7   | Warm paper base                   |
| Foreground       | #2d2d2d   | Soft pencil black for text        |
| Muted            | #e5e0d8   | Old paper, borders, backgrounds   |
| Accent           | #ff4d4d   | Red correction marker highlights  |
| Secondary Accent | #2d5da1   | Blue ballpoint pen accents        |
| Post-it          | #fff9c4   | Yellow sticky note backgrounds    |

### Borders
All interactive elements use irregular border-radius values to simulate hand-drawn, wobbly edges. Typical values include combinations like "255px 15px 225px 15px / 15px 225px 15px 255px" which produce organic, non-geometric shapes. Border widths are consistently 2px or 3px.

### Shadows
The design exclusively uses hard-offset box shadows with zero blur. A standard shadow is "4px 4px 0px 0px #2d2d2d" which creates a cut-paper, layered collage effect. Hover states reduce the offset to "2px 2px" while active/pressed states eliminate the shadow entirely with a corresponding translate transform, creating a tactile "press-flat" interaction.

### Decorative Elements
Cards feature tape strips (translucent gray rectangles positioned at the top) or thumbtack pins (red circles). Section labels use post-it yellow tag styling. Dashed borders serve as dividers between sections.

### Background Texture
The body background uses a radial gradient dot pattern ("radial-gradient(#e5e0d8 1px, transparent 1px)") at 24px intervals to simulate notebook paper grain.


## Browser Compatibility

The application works in all modern browsers that support ES Modules and the Fetch API:

| Browser         | Minimum Version | Notes                              |
|-----------------|-----------------|-------------------------------------|
| Chrome          | 87+             | Full support including Web Share    |
| Firefox         | 78+             | Web Share API not supported         |
| Safari          | 14+             | Full support including Web Share    |
| Edge            | 88+             | Full support including Web Share    |

On browsers that do not support the Web Share API, the share button falls back to downloading the audio file directly.


## Troubleshooting

### "API error: 400" on Generate
This typically indicates a malformed request body. Verify that the `.env` file contains a valid API key and that the speaker name is one of the 39 supported voices. Check the browser console for the full error response logged by the application.

### "API error: 401" or "API error: 403"
The API key is missing, invalid, or expired. Verify the `VITE_SARVAM_API_KEY` value in your `.env` file. If you recently created the key, wait a few minutes for it to activate.

### No Audio Plays After Generation
Check the browser console for errors. Ensure that the API response contains a valid base64 audio string in the `audios` array. Some browsers may block autoplay; click the play button manually if needed.

### Favorites Not Persisting
Favorites are stored in localStorage. If you are using incognito/private browsing mode, localStorage is cleared when the window is closed. Also verify that localStorage is not disabled in your browser settings.

### Web Share Not Working
The Web Share API with file sharing is only available on HTTPS connections and in specific browsers (Chrome, Edge, Safari). On localhost during development, sharing may not be available. The application will automatically fall back to downloading the file.


## License

This project is provided as-is for educational and personal use. The Sarvam AI API is subject to its own terms of service and usage limits as described at https://docs.sarvam.ai .
