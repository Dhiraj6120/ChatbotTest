# Page Objects Documentation

This directory contains the page object classes for the chatbot testing framework. The page objects follow the Page Object Model (POM) design pattern to provide a clean, maintainable interface for interacting with web elements.

## File Structure

```
src/pages/
├── base.page.js          # Base page object with common WebDriver methods
├── chatbot.page.js       # Chatbot-specific page object
├── ChatPage.js           # Legacy chat page (updated to extend BasePage)
└── README.md             # This documentation file
```

## BasePage Class

The `BasePage` class provides common WebDriver methods that can be extended by other page objects. It includes basic element interactions, wait strategies, and utility methods.

### Key Features

- **Element Interactions**: Safe clicking, typing, and element waiting
- **Wait Strategies**: Multiple wait methods for different scenarios
- **Utility Methods**: Screenshots, console logs, script execution
- **Navigation**: URL handling, page refresh, back/forward navigation
- **Error Handling**: Graceful error handling with detailed logging

### Common Methods

```javascript
// Element waiting
await basePage.waitForElement(selector, timeout);
await basePage.waitForElementClickable(selector, timeout);
await basePage.waitForElementExist(selector, timeout);

// Safe interactions
await basePage.safeClick(selector, timeout);
await basePage.safeType(selector, text, timeout);

// Element information
const text = await basePage.getElementText(selector);
const attribute = await basePage.getElementAttribute(selector, 'attribute');
const isDisplayed = await basePage.isElementDisplayed(selector);

// Screenshots and utilities
const screenshotPath = await basePage.takeScreenshot(name);
const consoleLogs = await basePage.getConsoleLogs();
await basePage.clearStorage();
```

## ChatbotPage Class

The `ChatbotPage` class extends `BasePage` and provides specific methods for interacting with chatbot widgets. It includes all the requested methods plus additional functionality.

### Requested Methods

#### 1. `sendMessage(message, timeout)`
Sends a message to the chatbot.

```javascript
await chatbotPage.sendMessage('Hello, how are you?');
```

#### 2. `getLastResponse(timeout)`
Gets the last response from the chatbot.

```javascript
const response = await chatbotPage.getLastResponse();
console.log(`Bot response: ${response}`);
```

#### 3. `clickButton(buttonText, timeout)`
Clicks a button in the chat interface by text.

```javascript
await chatbotPage.clickButton('Send');
await chatbotPage.clickButton('Clear Chat');
```

#### 4. `waitForResponse(timeout)`
Waits for the bot to respond after sending a message.

```javascript
await chatbotPage.sendMessage('Test message');
await chatbotPage.waitForResponse();
```

#### 5. `isTypingIndicatorVisible(timeout)`
Checks if the typing indicator is visible.

```javascript
const isTyping = await chatbotPage.isTypingIndicatorVisible();
if (isTyping) {
    console.log('Bot is typing...');
}
```

### Additional Methods

#### Conversation Management
```javascript
// Get all messages
const messages = await chatbotPage.getAllMessages();

// Get conversation history
const history = await chatbotPage.getConversationHistory();

// Clear conversation
await chatbotPage.clearConversation();

// Get message counts
const botCount = await chatbotPage.getMessageCount('bot');
const userCount = await chatbotPage.getMessageCount('user');
```

#### Widget Management
```javascript
// Check if widget is open
const isOpen = await chatbotPage.isChatWidgetOpen();

// Open/close widget
await chatbotPage.openChatWidget();
await chatbotPage.closeChatWidget();
```

#### Response Verification
```javascript
// Send message and wait for response
const response = await chatbotPage.sendMessageAndWaitForResponse('Hello');

// Verify response contains expected text
const containsText = await chatbotPage.verifyResponseContains('hello');
```

#### Error Handling
```javascript
// Check for error messages
const errorMessage = await chatbotPage.checkForErrors();

// Wait for welcome message
const welcomeMessage = await chatbotPage.waitForWelcomeMessage();
```

## Usage Examples

### Basic Chatbot Testing

```javascript
const ChatbotPage = require('../pages/chatbot.page.js');

describe('Chatbot Tests', () => {
    let chatbotPage;

    beforeEach(async () => {
        chatbotPage = new ChatbotPage();
        await chatbotPage.open();
    });

    it('should send message and get response', async () => {
        // Send a message
        await chatbotPage.sendMessage('Hello');
        
        // Wait for response
        await chatbotPage.waitForResponse();
        
        // Get the response
        const response = await chatbotPage.getLastResponse();
        
        // Verify response
        expect(response).toBeTruthy();
        expect(response.length).toBeGreaterThan(0);
    });

    it('should handle typing indicator', async () => {
        await chatbotPage.sendMessage('Test message');
        
        // Check if typing indicator appears
        const isTyping = await chatbotPage.isTypingIndicatorVisible();
        
        if (isTyping) {
            // Wait for typing to complete
            await chatbotPage.waitForTypingIndicatorDisappear();
        }
        
        const response = await chatbotPage.getLastResponse();
        expect(response).toBeTruthy();
    });
});
```

### Advanced Testing Scenarios

```javascript
it('should handle conversation flow', async () => {
    // Send initial message
    await chatbotPage.sendMessage('Hi there');
    await chatbotPage.waitForResponse();
    
    // Get conversation history
    const history = await chatbotPage.getConversationHistory();
    console.log('Conversation history:', history);
    
    // Send follow-up message
    await chatbotPage.sendMessage('How are you?');
    await chatbotPage.waitForResponse();
    
    // Verify response contains expected text
    const containsGreeting = await chatbotPage.verifyResponseContains('good');
    expect(containsGreeting).toBe(true);
    
    // Get message counts
    const botMessages = await chatbotPage.getMessageCount('bot');
    const userMessages = await chatbotPage.getMessageCount('user');
    
    expect(botMessages).toBeGreaterThan(0);
    expect(userMessages).toBeGreaterThan(0);
});
```

### Error Handling

```javascript
it('should handle errors gracefully', async () => {
    try {
        await chatbotPage.sendMessage('Invalid input');
        await chatbotPage.waitForResponse();
        
        // Check for error messages
        const errorMessage = await chatbotPage.checkForErrors();
        
        if (errorMessage) {
            console.log('Error detected:', errorMessage);
            // Handle error appropriately
        }
        
    } catch (error) {
        console.log('Test error:', error.message);
        // Take screenshot for debugging
        await chatbotPage.takeScreenshot('error_test');
    }
});
```

## Configuration

### Selectors

The page objects use flexible selectors that work with different chatbot implementations:

```javascript
this.selectors = {
    chatWidget: '#chat-widget, .chat-container, [data-testid="chat-widget"]',
    messageInput: '#chat-input, .chat-input, input[placeholder*="message"]',
    sendButton: '#send-button, .send-button, button[type="submit"]',
    botMessages: '.bot-message, .assistant-message, [data-testid="bot-message"]',
    userMessages: '.user-message, .human-message, [data-testid="user-message"]',
    typingIndicator: '.loading, .typing-indicator, [data-testid="loading"]'
};
```

### Timeouts

Configurable timeouts for different operations:

```javascript
this.defaultTimeout = 10000;    // 10 seconds
this.shortTimeout = 5000;        // 5 seconds
this.longTimeout = 30000;        // 30 seconds
this.responseTimeout = 30000;    // 30 seconds for bot response
this.typingTimeout = 10000;      // 10 seconds for typing indicator
```

## Best Practices

### 1. Page Object Inheritance

Always extend `BasePage` for new page objects:

```javascript
const BasePage = require('./base.page.js');

class MyPage extends BasePage {
    constructor() {
        super();
        // Add page-specific selectors and methods
    }
}
```

### 2. Error Handling

Use try-catch blocks for operations that may fail:

```javascript
try {
    await chatbotPage.sendMessage('Test message');
    const response = await chatbotPage.getLastResponse();
    expect(response).toBeTruthy();
} catch (error) {
    console.log('Operation failed:', error.message);
    await chatbotPage.takeScreenshot('test_failure');
}
```

### 3. Wait Strategies

Use appropriate wait methods instead of hard delays:

```javascript
// Good - wait for element
await chatbotPage.waitForElement(selector);

// Good - wait for condition
await chatbotPage.waitForResponse();

// Bad - hard delay
await browser.pause(5000);
```

### 4. Screenshots

Take screenshots for debugging and reporting:

```javascript
// Take screenshot on failure
try {
    await chatbotPage.sendMessage('Test');
} catch (error) {
    await chatbotPage.takeScreenshot('send_message_failure');
    throw error;
}
```

### 5. Logging

Use descriptive console logs for debugging:

```javascript
console.log('💬 Sending message:', message);
console.log('📝 Bot response:', response);
console.log('✅ Test completed successfully');
```

## Troubleshooting

### Common Issues

1. **Element not found**: Check if selectors match your chatbot interface
2. **Timeout errors**: Increase timeout values for slow responses
3. **Typing indicator issues**: Verify typing indicator selectors
4. **Response not received**: Check if bot is actually responding

### Debug Mode

Enable debug logging by setting log level:

```javascript
// In your test configuration
logLevel: 'debug'
```

### Screenshot Debugging

Take screenshots at key points to debug issues:

```javascript
await chatbotPage.takeScreenshot('before_send_message');
await chatbotPage.sendMessage('Test');
await chatbotPage.takeScreenshot('after_send_message');
await chatbotPage.waitForResponse();
await chatbotPage.takeScreenshot('after_response');
```

## Integration with Test Framework

The page objects work seamlessly with WebdriverIO and Mocha:

```javascript
// In your test files
const ChatbotPage = require('../pages/chatbot.page.js');

describe('Chatbot Tests', () => {
    let chatbotPage;

    beforeEach(async () => {
        chatbotPage = new ChatbotPage();
        await chatbotPage.open();
    });

    it('should test chatbot functionality', async () => {
        // Your test logic here
    });
});
```

## Extending the Page Objects

To add new functionality, extend the existing classes:

```javascript
class CustomChatbotPage extends ChatbotPage {
    constructor() {
        super();
        // Add custom selectors
        this.selectors.customElement = '.custom-element';
    }

    async customMethod() {
        // Add custom functionality
        await this.waitForElement(this.selectors.customElement);
    }
}
```

This modular approach ensures maintainable and reusable test code for chatbot testing. 