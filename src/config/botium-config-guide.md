# Botium WebdriverIO Configuration Guide

This guide explains how to configure the `botium.json` file for testing web-based chatbot widgets using WebdriverIO.

## Configuration Overview

The `botium.json` file contains all the settings needed to test a web-based chatbot widget. Here's what each section does:

## 1. Browser Configuration

### Basic Browser Settings
```json
"WEBDRIVERIO_CAPABILITIES": {
  "browserName": "chrome",
  "browserVersion": "latest",
  "platformName": "windows"
}
```

### Chrome Options
```json
"goog:chromeOptions": {
  "args": [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-web-security",
    "--disable-features=VizDisplayCompositor",
    "--window-size=1920,1080"
  ],
  "prefs": {
    "profile.default_content_setting_values.notifications": 2
  }
}
```

**Common Chrome Arguments:**
- `--no-sandbox`: Disables Chrome sandbox (useful for CI/CD)
- `--disable-dev-shm-usage`: Prevents memory issues
- `--disable-web-security`: Allows cross-origin requests
- `--window-size=1920,1080`: Sets browser window size
- `--headless`: Runs browser in headless mode

## 2. Chatbot URL Configuration

```json
"WEBDRIVERIO_URL": "https://your-chatbot-website.com"
```

**Update this to your actual chatbot website URL.**

## 3. Element Selectors

### Chat Widget Container
```json
"WEBDRIVERIO_SELECTOR_ELEMENT": "#chat-widget, .chat-container, [data-testid='chat-widget']"
```

### Input Field
```json
"WEBDRIVERIO_SELECTOR_INPUT": "#chat-input, .chat-input, input[placeholder*='message'], textarea[placeholder*='message'], [data-testid='chat-input']"
```

### Send Button
```json
"WEBDRIVERIO_SELECTOR_SEND": "#send-button, .send-button, button[type='submit'], [data-testid='send-button'], .chat-send-btn"
```

### Messages
```json
"WEBDRIVERIO_SELECTOR_MESSAGES": ".chat-message, .message, [data-testid='message'], .msg, .conversation-item"
```

### Message Text
```json
"WEBDRIVERIO_SELECTOR_MESSAGE_TEXT": ".message-text, .msg-text, .content, [data-testid='message-text'], .chat-bubble-text"
```

### Bot Messages
```json
"WEBDRIVERIO_SELECTOR_BOT_MESSAGE": ".bot-message, .assistant-message, [data-testid='bot-message'], .chat-bubble.bot"
```

### User Messages
```json
"WEBDRIVERIO_SELECTOR_USER_MESSAGE": ".user-message, .human-message, [data-testid='user-message'], .chat-bubble.user"
```

### Loading Indicator
```json
"WEBDRIVERIO_SELECTOR_LOADING": ".loading, .typing-indicator, [data-testid='loading'], .chat-typing"
```

### Chat Widget Toggle
```json
"WEBDRIVERIO_SELECTOR_CHAT_WIDGET_TOGGLE": "#chat-toggle, .chat-toggle, [data-testid='chat-toggle'], .chat-widget-button"
```

## 4. Timeout Configuration

```json
"WEBDRIVERIO_WAITFORBOTTIMEOUT": 15000,        // Wait for bot to be ready
"WEBDRIVERIO_WAITFORBOTINTERVAL": 500,         // Check interval
"WEBDRIVERIO_WAITFORBOTRESPONSETIMEOUT": 30000, // Wait for bot response
"WEBDRIVERIO_IMPLICIT_WAIT": 5000,             // Implicit wait for elements
"WEBDRIVERIO_PAGE_LOAD_TIMEOUT": 30000,        // Page load timeout
"WEBDRIVERIO_SCRIPT_TIMEOUT": 30000            // Script execution timeout
```

## 5. Interaction Settings

```json
"WEBDRIVERIO_CLEAR_INPUT_BEFORE_SEND": true,   // Clear input before typing
"WEBDRIVERIO_SEND_KEYS_DELAY": 100,            // Delay between keystrokes
"WEBDRIVERIO_CLICK_DELAY": 200                 // Delay after clicks
```

## 6. Screenshot and Logging

```json
"WEBDRIVERIO_SCREENSHOT_ON_FAILURE": true,
"WEBDRIVERIO_SCREENSHOT_PATH": "./screenshots"
```

## Common Chatbot Widget Selectors

### Intercom
```json
"WEBDRIVERIO_SELECTOR_ELEMENT": ".intercom-launcher",
"WEBDRIVERIO_SELECTOR_INPUT": ".intercom-comment-input",
"WEBDRIVERIO_SELECTOR_SEND": ".intercom-comment-send",
"WEBDRIVERIO_SELECTOR_MESSAGES": ".intercom-comment"
```

### Zendesk Chat
```json
"WEBDRIVERIO_SELECTOR_ELEMENT": "#launcher",
"WEBDRIVERIO_SELECTOR_INPUT": "#chat-input",
"WEBDRIVERIO_SELECTOR_SEND": ".send-button",
"WEBDRIVERIO_SELECTOR_MESSAGES": ".message"
```

### Drift
```json
"WEBDRIVERIO_SELECTOR_ELEMENT": ".drift-widget",
"WEBDRIVERIO_SELECTOR_INPUT": ".drift-widget-input",
"WEBDRIVERIO_SELECTOR_SEND": ".drift-widget-send",
"WEBDRIVERIO_SELECTOR_MESSAGES": ".drift-widget-message"
```

### Custom Chatbot
```json
"WEBDRIVERIO_SELECTOR_ELEMENT": "#my-chat-widget",
"WEBDRIVERIO_SELECTOR_INPUT": "#my-chat-input",
"WEBDRIVERIO_SELECTOR_SEND": "#my-send-button",
"WEBDRIVERIO_SELECTOR_MESSAGES": ".my-chat-message"
```

## How to Find Selectors

1. **Open Developer Tools** (F12)
2. **Inspect the chat widget elements**
3. **Right-click and "Copy selector"**
4. **Test selectors in browser console:**
   ```javascript
   document.querySelector('your-selector')
   ```

## Testing Your Configuration

1. **Update the URL** to your chatbot website
2. **Update selectors** to match your chatbot interface
3. **Run a test:**
   ```bash
   npx botium-cli run --config src/config/botium.json
   ```

## Troubleshooting

### Common Issues:

1. **Element not found**: Check if selectors are correct
2. **Timeout errors**: Increase timeout values
3. **Browser not starting**: Check Chrome installation
4. **Cross-origin issues**: Add `--disable-web-security` to Chrome args

### Debug Mode:
```json
"Logging": {
  "LEVEL": "debug"
}
```

## Environment Variables

You can override settings using environment variables:
```bash
export BOTIUM_WEBDRIVERIO_URL="https://your-site.com"
export BOTIUM_WEBDRIVERIO_SELECTOR_INPUT="#custom-input"
```

## Headless Mode

For CI/CD environments, enable headless mode:
```json
"WEBDRIVERIO_HEADLESS": true
``` 