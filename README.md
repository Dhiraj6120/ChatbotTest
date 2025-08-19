# Chatbot Testing Project

A comprehensive Node.js project for testing chatbots using Botium and WebdriverIO with Allure reporting.

## Project Structure

```
├── package.json
├── README.md
├── src/
│   ├── config/
│   │   ├── wdio.conf.js          # WebdriverIO configuration
│   │   └── botium.json           # Botium configuration
│   ├── pages/
│   │   └── ChatPage.js           # Page Object Model for chat interface
│   └── tests/
│       ├── chatbot.test.js       # Basic chatbot tests
│       └── data-driven.test.js   # Data-driven tests
└── test-data/
    ├── conversations.json        # Botium conversation flows
    └── test-scenarios.csv        # CSV test data for parameterized testing
```

## Prerequisites

- Node.js (v14 or higher)
- Chrome browser
- ChromeDriver (automatically managed by the project)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

### WebdriverIO Configuration
The WebdriverIO configuration is located in `src/config/wdio.conf.js`. Key settings:
- Browser: Chrome
- Framework: Mocha
- Reporter: Allure
- Base URL: http://localhost (update as needed)

### Botium Configuration
Botium configuration is in `src/config/botium.json`. Update the following:
- `WEBDRIVERIO_URL`: Your chatbot application URL
- Selectors: Update CSS selectors to match your chatbot interface

## Usage

### Running WebdriverIO Tests
```bash
# Run all tests
npm test

# Run tests in parallel
npm run test:parallel

# Run tests in headless mode
npm run test:headless

# Generate and open Allure report
npm run report
```

### Running Botium Tests
```bash
# Run Botium tests
npm run test:botium
```

## Test Data

### Conversations (JSON)
Located in `test-data/conversations.json`, contains predefined conversation flows for Botium testing.

### Test Scenarios (CSV)
Located in `test-data/test-scenarios.csv`, contains parameterized test data for data-driven testing.

## Page Object Model

The `ChatPage.js` provides methods for:
- Opening the chat interface
- Sending messages
- Waiting for bot responses
- Retrieving messages
- Clearing chat history

## Test Examples

### Basic Test
```javascript
it('should respond to user greeting', async () => {
    await ChatPage.sendMessage('Hello');
    await ChatPage.waitForBotResponse();
    
    const botResponse = await ChatPage.getLastBotMessage();
    expect(botResponse).toBeTruthy();
});
```

### Data-Driven Test
Tests automatically read from CSV file and execute for each scenario.

## Reporting

The project uses Allure for test reporting:
- Screenshots on test failure
- Detailed test execution logs
- Interactive HTML reports

## Customization

### Adding New Tests
1. Create test files in `src/tests/`
2. Import the ChatPage object
3. Use the provided methods for interaction

### Updating Selectors
Update the selectors in `ChatPage.js` to match your chatbot interface:
```javascript
this.selectors = {
    chatContainer: '#your-chat-container',
    messageInput: '#your-message-input',
    // ... other selectors
};
```

### Adding Test Data
- Add new conversations to `conversations.json`
- Add new scenarios to `test-scenarios.csv`

## Troubleshooting

### Common Issues
1. **ChromeDriver issues**: The project automatically manages ChromeDriver
2. **Selector not found**: Update selectors in ChatPage.js
3. **Timeout errors**: Increase timeout values in configuration

### Debug Mode
Run tests with debug logging:
```bash
DEBUG=* npm test
```

## Contributing

1. Follow the existing code structure
2. Add appropriate tests for new features
3. Update documentation as needed

## License

MIT License 