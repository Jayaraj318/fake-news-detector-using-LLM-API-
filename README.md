# Fake News Detection Chrome Extension

This project is a Chrome extension for detecting fake news using the Gemini AI model. It allows users to input a news article and receive a verdict on its authenticity along with reasoning.

## Project Structure

```
fake-news-detection-extension
├── popup.html        # HTML structure for the extension's popup
├── popup.js          # JavaScript logic for handling user input and API requests
├── style.css         # CSS styles for the popup
├── manifest.json     # Configuration file for the Chrome extension
├── icon.png          # Placeholder icon for the extension
└── README.md         # Documentation for the project
```

## Installation

1. Clone the repository or download the project files.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click on "Load unpacked" and select the `fake-news-detection-extension` directory.
5. The extension should now be loaded and visible in your extensions list.

## Usage

1. Click on the extension icon in the Chrome toolbar to open the popup.
2. Enter a news article in the input box.
3. Click the "Check News" button.
4. The extension will send the article to the FastAPI backend and display whether the news is real or fake, along with the reasoning.

## Development

- The extension uses Manifest V3, which is the latest version for Chrome extensions.
- The backend API is expected to be running locally at `http://localhost:8000/check-news?text=...`. Update this URL to your deployed backend when ready.

# Fake News Detection Web Interface

## How to Launch

1. Load the Chrome extension as usual.
2. In the extension popup, click the **Web View** button.
3. A new browser tab will open with the full-featured web interface.

## What It Does

- Lets you paste or type any news article.
- Click **Check News** to get verdict and reasoning from the backend.
- Responsive and mobile-friendly design.

## How It Connects

- The web UI sends requests to the FastAPI backend at `/check-news`.
- The backend uses Gemini LLM to analyze the news and returns the result.

## Image-based Fake News Analysis

1. **Chrome Extension**: Click “Image Analysis” in the popup to open the web interface.
2. **Web Interface**: Go to `/image-analysis`, upload an image (screenshot/article), and click “Analyze Image.”
3. **Backend**: The `/check-news` endpoint now accepts either text or an image. Image uploads are processed with Tesseract OCR, then analyzed by Gemini LLM.
4. **Setup**:
   - Install Tesseract OCR and set its path in `.env`.
   - Add your Gemini API key to `.env`.
   - Start the backend and frontend as usual.

**Security:** Never commit your `.env` or API keys to version control.

## License

This project is licensed under the MIT License.