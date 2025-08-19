# Chatbot Testing Framework

A comprehensive testing framework for chatbot applications using **Botium** and **WebdriverIO** with **Allure** reporting.

## 🚀 Features

- **Multi-framework Support**: Botium for conversation testing, WebdriverIO for UI automation
- **Page Object Model**: Reusable page objects for maintainable tests
- **Data-Driven Testing**: Support for JSON and CSV test data
- **Comprehensive Reporting**: Allure reports with screenshots and detailed logs
- **Utility Framework**: Helper utilities for common testing tasks
- **Virgin Media Scenarios**: Pre-built test scenarios for Virgin Media chatbot
- **Performance Testing**: Built-in performance and load testing capabilities

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **Chrome Browser** (latest version)
- **Java** (for Allure reporting)

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd chatbot-testing-project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Validate setup**:
   ```bash
   npm run setup
   ```

## 🏗️ Project Structure

```
chatbot-testing-project/
├── src/
│   ├── config/
│   │   ├── wdio.conf.js              # WebdriverIO configuration
│   │   ├── botium.json               # Botium configuration
│   │   └── virgin-media-botium.json  # Virgin Media specific config
│   ├── pages/
│   │   ├── base.page.js              # Base page object
│   │   └── chatbot.page.js           # Chatbot specific page object
│   ├── tests/
│   │   ├── virgin-media-botium-fixed.test.js  # Virgin Media tests
│   │   ├── utilities-example.test.js          # Utility examples
│   │   ├── page-objects.test.js               # Page object tests
│   │   └── data-driven.test.js                # Data-driven tests
│   └── utils/
│       ├── index.js                  # Main utilities index
│       ├── test-data-manager.js      # Test data management
│       ├── assertions.js             # Common assertions
│       ├── screenshot-manager.js     # Screenshot utilities
│       ├── wait-utils.js             # Wait functions
│       └── error-handler.js          # Error handling
├── test-data/
│   ├── sample-test-data.json         # Sample test data
│   ├── performance-test-data.csv     # Performance test data
│   ├── virgin-media-conversations.json # Virgin Media conversations
│   └── web-chatbot-conversations.json # Web chatbot conversations
├── scripts/
│   ├── run-virgin-media-tests.js     # Virgin Media test runner
│   ├── validate-wdio-config.js       # WebdriverIO config validator
│   └── test-config.js                # Botium config validator
├── docs/
│   ├── utilities-guide.md            # Utilities documentation
│   └── virgin-media-testing-guide.md # Virgin Media testing guide
└── package.json
```

## 🧪 Test Execution

### Basic Test Commands

```bash
# Run all WebdriverIO tests
npm test

# Run Botium tests
npm run test:botium

# Run Virgin Media tests
npm run test:virgin-media

# Run specific test suites
npm run test:utilities
npm run test:page-objects
npm run test:data-driven
```

### Advanced Test Commands

```bash
# Run tests in parallel
npm run test:parallel

# Run tests in headless mode
npm run test:headless

# Run tests with debug mode
npm run test:debug

# Run tests with retry logic
npm run test:retry

# Run all test suites
npm run test:all
```

### Virgin Media Specific Tests

```bash
# Run Virgin Media Botium tests
npm run test:virgin-media:botium

# Run Virgin Media WebdriverIO tests
npm run test:virgin-media:webdriverio

# Run custom Virgin Media test runner
npm run test:virgin-media
```

## 📊 Reporting

### Allure Reports

```bash
# Generate and open Allure report
npm run report:allure

# Serve Allure report (for CI/CD)
npm run report:allure:serve

# Clean report files
npm run report:clean
```

### Report Features

- **Screenshots**: Automatic screenshots on test failures
- **Console Logs**: Browser console logs captured
- **Environment Info**: Test environment details
- **Performance Metrics**: Response times and performance data
- **Test History**: Historical test results
- **Custom Attachments**: Additional test artifacts

## 🧹 Cleanup Commands

```bash
# Clean all test artifacts
npm run clean:all

# Clean specific artifacts
npm run screenshots:clean
npm run logs:clean
npm run report:clean
```

## 🔧 Configuration

### WebdriverIO Configuration

The main WebdriverIO configuration is in `src/config/wdio.conf.js`:

- **Browser**: Chrome with optimized settings
- **Framework**: Mocha with BDD syntax
- **Reporters**: Allure, JUnit, Spec
- **Screenshots**: Automatic on failure
- **Timeouts**: Configurable wait strategies
- **Parallel Execution**: Support for parallel test runs

### Botium Configuration

Botium configurations are in:
- `src/config/botium.json` - General web chatbot testing
- `src/config/virgin-media-botium.json` - Virgin Media specific testing

### Test Data Management

Test data is organized in the `test-data/` directory:

- **JSON Files**: Structured test scenarios and user data
- **CSV Files**: Performance test data and data-driven scenarios
- **Conversation Files**: Botium conversation flows

## 🛠️ Utilities Framework

The utilities framework provides reusable components:

### Test Data Manager
```javascript
const { testDataManager } = require('./src/utils');

// Load test data
const data = testDataManager.loadJsonData('sample-test-data.json');
const csvData = await testDataManager.loadCsvData('performance-test-data.csv');
```

### Assertions
```javascript
const { assertions } = require('./src/utils');

// Common assertions
assertions.assertContains(actual, expected);
assertions.assertResponseTime(responseTime, maxTime);
assertions.assertResponseContainsKeywords(response, keywords);
```

### Screenshot Manager
```javascript
const { screenshotManager } = require('./src/utils');

// Take screenshots
await screenshotManager.takeScreenshot('test-step');
await screenshotManager.takeFailureScreenshot(errorMessage);
```

### Wait Utils
```javascript
const { waitUtils } = require('./src/utils');

// Wait functions
await waitUtils.waitForElement(selector);
await waitUtils.waitForElementClickable(selector);
await waitUtils.waitForPageLoad();
```

### Error Handler
```javascript
const { errorHandler } = require('./src/utils');

// Error handling with retry
await errorHandler.executeWithRetry(asyncFunction, 'context');
```

## 🧪 Writing Tests

### WebdriverIO Test Example

```javascript
const ChatbotPage = require('../pages/chatbot.page.js');

describe('Chatbot Tests', () => {
    let chatbotPage;

    beforeEach(async () => {
        chatbotPage = new ChatbotPage();
        await chatbotPage.open();
    });

    it('should send a message and get response', async () => {
        await chatbotPage.sendMessage('Hello');
        const response = await chatbotPage.getLastResponse();
        expect(response).toContain('Hi there');
    });
});
```

### Botium Test Example

```javascript
const { BotDriver, Capabilities } = require('botium-core');

describe('Botium Tests', () => {
    let driver;

    beforeAll(async () => {
        driver = new BotDriver(Capabilities.botium({
            CONTAINERMODE: 'webdriverio',
            // ... configuration
        }));
        await driver.Build();
        await driver.Start();
    });

    it('should handle conversation flow', async () => {
        await driver.UserSays({ messageText: 'Hello' });
        await driver.WaitBotSays();
        await driver.BotSays({ messageText: /Hi there/i });
    });
});
```

### Data-Driven Test Example

```javascript
const { testDataManager } = require('../utils');

describe('Data-Driven Tests', () => {
    let testData;

    beforeAll(async () => {
        testData = testDataManager.loadJsonData('sample-test-data.json');
    });

    testData.testScenarios.basicConversations.forEach(scenario => {
        it(`should handle ${scenario.name}`, async () => {
            // Test implementation
        });
    });
});
```

## 🔍 Validation and Debugging

### Configuration Validation

```bash
# Validate WebdriverIO configuration
npm run validate:wdio

# Validate Botium configuration
npm run botium:validate

# Validate all configurations
npm run validate:all
```

### Debug Mode

```bash
# Run tests with debug output
npm run test:debug

# Check test syntax
node -c src/tests/*.test.js
```

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Chatbot Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:all
      - run: npm run report:allure:serve
```

## 📝 Customization

### Adding New Test Scenarios

1. **Create test data** in `test-data/` directory
2. **Add test methods** in page objects
3. **Write test cases** in `src/tests/`
4. **Update configurations** as needed

### Extending Utilities

1. **Add new methods** to utility classes
2. **Update index.js** to export new utilities
3. **Add documentation** in `docs/`
4. **Create example tests**

## 🐛 Troubleshooting

### Common Issues

1. **Chrome Driver Issues**:
   ```bash
   npm install chromedriver --save-dev
   ```

2. **Allure Report Issues**:
   ```bash
   npm install allure-commandline --save-dev
   ```

3. **Botium Connection Issues**:
   - Check URL configuration
   - Verify selectors
   - Check network connectivity

### Debug Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Validate all configurations
npm run validate:all

# Run with verbose logging
npm run test:debug
```

## 📚 Documentation

- [Utilities Guide](docs/utilities-guide.md) - Detailed utilities documentation
- [Virgin Media Testing Guide](docs/virgin-media-testing-guide.md) - Virgin Media specific testing
- [WebdriverIO Configuration Guide](src/config/wdio-config-guide.md) - WebdriverIO setup
- [Botium Configuration Guide](src/config/botium-config-guide.md) - Botium setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review troubleshooting section

---

**Happy Testing! 🧪✨** 