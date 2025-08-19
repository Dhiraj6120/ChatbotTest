# Utilities Guide

This guide provides comprehensive documentation for all utility modules in the chatbot testing framework. These utilities are designed to be reusable across different test files and provide common functionality for test automation.

## Overview

The utilities framework consists of five main modules:

1. **Test Data Manager** - Loading, validating, and managing test data
2. **Assertions** - Common assertion functions for test validation
3. **Screenshot Manager** - Capturing and organizing screenshots
4. **Wait Utils** - Common wait functions for element interactions
5. **Error Handler** - Comprehensive error handling and recovery

## Quick Start

### Import Utilities

```javascript
// Import all utilities
const {
    testDataManager,
    assertions,
    screenshotManager,
    waitUtils,
    errorHandler,
    utils
} = require('../utils');

// Or import individual utilities
const { testDataManager } = require('../utils/test-data-manager');
const { assertions } = require('../utils/assertions');
```

### Basic Setup

```javascript
describe('My Test Suite', () => {
    beforeEach(async () => {
        // Initialize utilities with test context
        utils.initTestContext('My Test Suite', 'My Test');
        
        // Configure utilities
        utils.configureAll({
            waitTimeouts: { default: 15000, short: 5000, long: 30000 },
            retryConfig: { maxRetries: 3, retryDelay: 1000 }
        });
    });

    afterEach(async () => {
        // Reset utilities
        utils.resetAll();
    });
});
```

## Test Data Manager

### Features

- **JSON/CSV Data Loading** - Load test data from files
- **Conversation Management** - Handle Botium conversation files
- **Data Validation** - Validate data against templates
- **Dynamic Data Generation** - Generate test data with placeholders
- **Caching** - Cache loaded data for performance
- **Environment Support** - Load environment-specific data

### Usage Examples

#### Loading Test Data

```javascript
// Load JSON data
const testData = testDataManager.loadJsonData('test-data.json');

// Load specific key from JSON
const conversations = testDataManager.loadJsonData('conversations.json', 'convos');

// Load CSV data
const csvData = await testDataManager.loadCsvData('test-scenarios.csv');

// Load Botium conversations
const conversations = testDataManager.loadConversations('virgin-media-conversations.json');

// Get specific conversation
const conversation = testDataManager.getConversationByName(
    'virgin-media-conversations.json',
    'Bill Status Check'
);
```

#### Data Validation

```javascript
// Create template
testDataManager.createTemplate('user', {
    name: 'string',
    email: 'string',
    age: 'number'
});

// Validate data
const isValid = testDataManager.validateTestData(userData, 'user');
assertions.assertTrue(isValid, 'User data should be valid');
```

#### Dynamic Data Generation

```javascript
const template = {
    user: '{{name}}',
    message: 'Hello {{name}}, your account is {{accountNumber}}'
};

const variables = {
    name: 'John Doe',
    accountNumber: '12345678'
};

const generatedData = testDataManager.generateTestData(template, variables);
// Result: { user: 'John Doe', message: 'Hello John Doe, your account is 12345678' }
```

#### Environment-Specific Data

```javascript
// Load environment-specific data with fallback
const config = testDataManager.loadEnvironmentData('config', 'test');
```

## Assertions

### Features

- **Text Assertions** - Contains, matches, equals, length checks
- **Response Validation** - Bot response specific assertions
- **Performance Assertions** - Response time validation
- **Array/Object Assertions** - Collection and object validation
- **Custom Assertions** - User-defined assertion functions
- **Statistics Tracking** - Track assertion success/failure rates

### Usage Examples

#### Basic Text Assertions

```javascript
// Contains check
assertions.assertContains('Hello world', 'world');

// Regex matching
assertions.assertMatches('test@email.com', /^[^\s@]+@[^\s@]+\.[^\s@]+$/);

// Exact match
assertions.assertEquals('Hello', 'Hello');

// Length checks
assertions.assertMinLength('Hello', 3);
assertions.assertMaxLength('Short', 10);

// Empty check
assertions.assertNotEmpty('Some text');
```

#### Bot Response Assertions

```javascript
// Keyword checking
assertions.assertResponseContainsKeywords(
    'Hello! How can I help you today?',
    ['Hello', 'help']
);

// Pattern matching
assertions.assertResponsePattern(
    'Your bill is $45.50',
    'Your bill is $*'
);

// Response time validation
assertions.assertResponseTime(1500, 3000); // 1.5s response time, max 3s
```

#### Collection Assertions

```javascript
// Array assertions
const messages = ['msg1', 'msg2', 'msg3'];
assertions.assertArrayContains(messages, 'msg2');
assertions.assertArrayLength(messages, 3);

// Object assertions
const user = { name: 'John', age: 30 };
assertions.assertHasProperty(user, 'name');
assertions.assertPropertyEquals(user, 'age', 30);
```

#### Conversation Assertions

```javascript
const conversation = [
    { sender: 'user', messageText: 'Hi' },
    { sender: 'bot', messageText: 'Hello!' }
];

assertions.assertConversationLength(conversation, 2);
assertions.assertConversationEndsWith(conversation, 'Hello!');
```

#### Custom Assertions

```javascript
assertions.assertCustom(
    () => {
        const result = someComplexCalculation();
        return result > 0 && result < 100;
    },
    'Result should be between 0 and 100'
);
```

## Screenshot Manager

### Features

- **Automatic Naming** - Context-aware screenshot naming
- **Multiple Types** - Regular, step, failure, element, full-page screenshots
- **Before/After Capture** - Capture screenshots before and after actions
- **Statistics Tracking** - Track screenshot count and sizes
- **Cleanup** - Automatic cleanup of old screenshots
- **Reporting** - Generate screenshot reports

### Usage Examples

#### Basic Screenshots

```javascript
// Take regular screenshot
const screenshotPath = await screenshotManager.takeScreenshot('initial_page');

// Take step screenshot
await screenshotManager.takeStepScreenshot('user_login');

// Take custom screenshot
await screenshotManager.takeCustomScreenshot('custom_test_state');
```

#### Specialized Screenshots

```javascript
// Take failure screenshot
await screenshotManager.takeFailureScreenshot('Element not found error');

// Take element screenshot
await screenshotManager.takeElementScreenshot(
    '#chat-widget',
    'chat_widget_state'
);

// Take full page screenshot
await screenshotManager.takeFullPageScreenshot('complete_page');
```

#### Before/After Screenshots

```javascript
const beforeAfter = await screenshotManager.takeBeforeAfterScreenshots(
    'form_submission',
    async () => {
        await form.fill();
        await form.submit();
    }
);

// beforeAfter contains { before: 'path1', after: 'path2', action: 'form_submission' }
```

#### Screenshot Management

```javascript
// Get statistics
const stats = screenshotManager.getScreenshotStats();
console.log(`Total screenshots: ${stats.totalScreenshots}`);

// Get screenshots for specific test
const testScreenshots = screenshotManager.getScreenshotsForTest('My Suite', 'My Test');

// Clean up old screenshots (keep last 7 days)
const deletedCount = await screenshotManager.cleanupOldScreenshots(7);

// Create report
const reportPath = await screenshotManager.createScreenshotReport();
```

## Wait Utils

### Features

- **Element Waiting** - Wait for elements to be displayed, clickable, exist
- **Condition Waiting** - Wait for custom conditions
- **Page Loading** - Wait for page load completion
- **URL/Title Changes** - Wait for navigation changes
- **Element Count** - Wait for specific number of elements
- **Animation Completion** - Wait for CSS animations to finish
- **Configurable Timeouts** - Customizable timeout values

### Usage Examples

#### Element Waiting

```javascript
// Wait for element to be displayed
const element = await waitUtils.waitForElement('#chat-widget');

// Wait for element to be clickable
await waitUtils.waitForElementClickable('#send-button');

// Wait for element to exist in DOM
await waitUtils.waitForElementExist('.message');

// Wait for element to disappear
await waitUtils.waitForElementDisappear('.loading');
```

#### Page and Navigation Waiting

```javascript
// Wait for page to load completely
await waitUtils.waitForPageLoad();

// Wait for URL change
await waitUtils.waitForUrlChange('/dashboard');

// Wait for title change
await waitUtils.waitForTitleChange('Dashboard');
```

#### Custom Conditions

```javascript
// Wait for custom condition
await waitUtils.waitForCondition(
    async () => {
        const messages = await browser.$$('.message');
        return messages.length >= 3;
    },
    10000,
    'Should have at least 3 messages'
);

// Wait for element count
await waitUtils.waitForElementCount('.message', 5);

// Wait for element text
await waitUtils.waitForElementText('#status', 'Ready');
```

#### Advanced Waiting

```javascript
// Wait for element attribute
await waitUtils.waitForElementAttribute('#button', 'disabled', 'true');

// Wait for element to be enabled/disabled
await waitUtils.waitForElementEnabled('#submit-button');
await waitUtils.waitForElementDisabled('#loading-button');

// Wait for CSS class
await waitUtils.waitForElementClass('#status', 'success');
await waitUtils.waitForElementClassRemoved('#status', 'loading');

// Wait for animation completion
await waitUtils.waitForAnimationComplete('#animated-element');
```

#### Configuration

```javascript
// Set custom timeouts
waitUtils.setTimeouts({
    default: 20000,
    short: 10000,
    long: 60000
});

// Get current configuration
const config = waitUtils.getTimeouts();
```

## Error Handler

### Features

- **Error Categorization** - Automatically categorize errors by type
- **Retry Logic** - Execute functions with automatic retry
- **Error Recovery** - Handle different types of errors appropriately
- **Comprehensive Logging** - Log errors with context and metadata
- **Statistics Tracking** - Track error patterns and frequencies
- **Reporting** - Generate detailed error reports

### Usage Examples

#### Basic Error Handling

```javascript
try {
    await someOperation();
} catch (error) {
    const errorInfo = errorHandler.handleError(error, 'Operation failed');
    console.log(`Error type: ${errorInfo.type}, Severity: ${errorInfo.severity}`);
}
```

#### Retry Logic

```javascript
const result = await errorHandler.executeWithRetry(
    async () => {
        // Potentially flaky operation
        return await apiCall();
    },
    'API call',
    { maxRetries: 3, retryDelay: 1000 }
);
```

#### Specialized Error Handling

```javascript
// Handle element errors
try {
    await element.click();
} catch (error) {
    const recoverable = await errorHandler.handleElementError(
        error,
        '#button',
        'click'
    );
}

// Handle network errors
try {
    await fetch('/api/data');
} catch (error) {
    const errorInfo = errorHandler.handleNetworkError(error, '/api/data', 'GET');
}

// Handle timeout errors
try {
    await waitUtils.waitForElement('#slow-element', 1000);
} catch (error) {
    const errorInfo = errorHandler.handleTimeoutError(error, 'Element wait', 1000);
}

// Handle assertion errors
try {
    expect(actual).toBe(expected);
} catch (error) {
    const errorInfo = errorHandler.handleAssertionError(
        error,
        'Value comparison',
        actual,
        expected
    );
}
```

#### Error Statistics and Reporting

```javascript
// Get error statistics
const stats = errorHandler.getErrorStats();
console.log(`Total errors: ${stats.totalErrors}`);
console.log(`Error types:`, stats.errorTypes);

// Create error report
const reportPath = await errorHandler.createErrorReport();

// Clear error log
errorHandler.clearErrorLog();
```

## Integration Examples

### Complete Test with All Utilities

```javascript
describe('Complete Integration Test', () => {
    beforeEach(async () => {
        utils.initTestContext('Integration Test', 'Complete Flow');
    });

    it('should demonstrate complete utility integration', async () => {
        try {
            // Load test data
            const conversation = testDataManager.getConversationByName(
                'conversations.json',
                'Test Conversation'
            );

            // Initialize page
            await chatbotPage.open();
            await waitUtils.waitForPageLoad();

            // Take initial screenshot
            await screenshotManager.takeScreenshot('test_start');

            // Execute with retry logic
            const result = await errorHandler.executeWithRetry(
                async () => {
                    await chatbotPage.sendMessage(conversation.convo[0].messageText);
                    await waitUtils.waitForElement('.bot-message');
                    
                    const response = await chatbotPage.getLastResponse();
                    assertions.assertContains(response, 'expected text');
                    
                    return response;
                },
                'Conversation test'
            );

            // Take final screenshot
            await screenshotManager.takeScreenshot('test_complete');

        } catch (error) {
            await screenshotManager.takeFailureScreenshot(error.message);
            throw error;
        }
    });
});
```

### Performance Testing

```javascript
it('should monitor performance with utilities', async () => {
    const metrics = {};

    // Measure page load
    const start = Date.now();
    await chatbotPage.open();
    await waitUtils.waitForPageLoad();
    metrics.pageLoad = Date.now() - start;

    // Measure element interaction
    const elementStart = Date.now();
    await waitUtils.waitForElement('#chat-widget');
    metrics.elementWait = Date.now() - elementStart;

    // Assert performance
    assertions.assertResponseTime(metrics.pageLoad, 5000);
    assertions.assertResponseTime(metrics.elementWait, 2000);
});
```

## Best Practices

### 1. Initialization

- Always initialize utilities with test context in `beforeEach`
- Configure utilities once in `beforeAll`
- Reset utilities in `afterEach`

### 2. Error Handling

- Use retry logic for flaky operations
- Take screenshots on failures
- Log errors with meaningful context
- Handle different error types appropriately

### 3. Performance

- Cache test data when possible
- Use appropriate timeout values
- Monitor performance metrics
- Clean up old screenshots regularly

### 4. Maintainability

- Use consistent naming conventions
- Document custom assertions
- Keep utility configurations in separate files
- Regular cleanup of logs and reports

### 5. Reporting

- Generate comprehensive reports after test runs
- Include screenshots in failure reports
- Track error patterns over time
- Monitor assertion success rates

## Configuration

### Global Configuration

```javascript
// Configure all utilities at once
utils.configureAll({
    waitTimeouts: {
        default: 15000,
        short: 5000,
        long: 30000
    },
    retryConfig: {
        maxRetries: 3,
        retryDelay: 1000
    },
    screenshotConfig: {
        autoCleanup: true,
        maxAge: 7 // days
    }
});
```

### Environment-Specific Configuration

```javascript
// Load environment-specific configuration
const config = testDataManager.loadEnvironmentData('config', process.env.NODE_ENV);

// Apply configuration
utils.configureAll(config.utilities);
```

## Troubleshooting

### Common Issues

1. **Element Not Found Errors**
   - Check selector validity
   - Increase timeout values
   - Verify element exists in DOM

2. **Screenshot Failures**
   - Ensure screenshots directory exists
   - Check browser permissions
   - Verify disk space

3. **Data Loading Issues**
   - Check file paths
   - Validate JSON/CSV format
   - Verify file permissions

4. **Performance Issues**
   - Reduce timeout values
   - Implement caching
   - Clean up old data

### Debug Mode

```javascript
// Enable debug logging
process.env.DEBUG = 'true';

// Get detailed statistics
const stats = utils.getAllStats();
console.log('Debug stats:', JSON.stringify(stats, null, 2));
```

This comprehensive utilities framework provides all the tools needed for robust, maintainable test automation with proper error handling, reporting, and performance monitoring. 