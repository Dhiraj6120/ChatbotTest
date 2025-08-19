# WebdriverIO Configuration Guide

This guide explains the comprehensive `wdio.conf.js` configuration file for chatbot testing with WebdriverIO, Mocha, and Allure reporting.

## Configuration Overview

The `wdio.conf.js` file is configured for:
- ✅ Chrome browser automation
- ✅ Mocha test framework
- ✅ Allure reporting with screenshots
- ✅ Page Object Pattern support
- ✅ Comprehensive wait strategies
- ✅ Failure handling and debugging

## 1. Runner Configuration

```javascript
runner: 'local',
autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
        project: './tsconfig.json',
        transpileOnly: true
    }
}
```

**Features:**
- Local test runner for single machine execution
- TypeScript support with auto-compilation
- Transpile-only mode for faster compilation

## 2. Test File Configuration

```javascript
specs: [
    '../tests/**/*.js',
    '../tests/**/*.ts'
],
exclude: [
    '../tests/**/node_modules/**',
    '../tests/**/temp/**'
]
```

**Patterns:**
- Includes all `.js` and `.ts` files in the tests directory
- Excludes node_modules and temporary files
- Supports both JavaScript and TypeScript tests

## 3. Browser Capabilities

### Chrome Configuration
```javascript
capabilities: [{
    maxInstances: 5,
    browserName: 'chrome',
    browserVersion: 'latest',
    platformName: 'windows',
    acceptInsecureCerts: true,
    'goog:chromeOptions': {
        args: [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-extensions',
            '--disable-plugins',
            '--disable-images',
            '--disable-javascript',
            '--window-size=1920,1080',
            '--start-maximized',
            '--remote-debugging-port=9222'
        ],
        prefs: {
            'profile.default_content_setting_values.notifications': 2,
            'profile.default_content_setting_values.media_stream': 2,
            'profile.default_content_setting_values.geolocation': 2
        }
    }
}]
```

### Chrome Arguments Explained:
- `--no-sandbox`: Disables Chrome sandbox (useful for CI/CD)
- `--disable-dev-shm-usage`: Prevents memory issues
- `--disable-web-security`: Allows cross-origin requests
- `--disable-extensions`: Disables browser extensions
- `--disable-images`: Speeds up page loading
- `--window-size=1920,1080`: Sets browser window size
- `--start-maximized`: Starts browser maximized
- `--remote-debugging-port=9222`: Enables remote debugging

## 4. Test Framework Configuration

### Mocha Settings
```javascript
framework: 'mocha',
mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
    retries: 1
}
```

**BDD (Behavior Driven Development) Features:**
- `describe()` for test suites
- `it()` for test cases
- `before()`, `after()`, `beforeEach()`, `afterEach()` for hooks
- 60-second timeout per test
- 1 retry on failure

## 5. Wait Strategies

```javascript
waitforTimeout: 15000,
waitforInterval: 1000
```

**Wait Configuration:**
- Global wait timeout: 15 seconds
- Wait interval: 1 second
- Implicit wait: 10 seconds
- Page load timeout: 30 seconds
- Script timeout: 30 seconds

## 6. Hooks and Lifecycle

### Test Lifecycle Hooks:
```javascript
onPrepare()      // Before any tests run
beforeSession()  // Before test session starts
before()         // Before each test suite
beforeTest()     // Before each test
beforeHook()     // Before each hook
afterHook()      // After each hook
afterTest()      // After each test
after()          // After each test suite
afterSession()   // After test session ends
onComplete()     // After all tests complete
```

### Key Hook Features:
- **Screenshot capture** on test failure
- **Browser console log** capture
- **Storage cleanup** before each test
- **Cookie clearing** for test isolation
- **Directory creation** for reports and screenshots

## 7. Screenshot and Failure Handling

```javascript
afterTest: async function (test, context, { error, result, duration, passed, retries }) {
    if (!passed) {
        // Take screenshot with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const testName = test.title.replace(/\s+/g, '_');
        const screenshotPath = path.join(process.cwd(), 'screenshots', `failed_${testName}_${timestamp}.png`);
        await browser.saveScreenshot(screenshotPath);
        
        // Capture browser console logs
        const logs = await browser.getLogs('browser');
        logs.forEach(log => {
            console.log(`${log.level}: ${log.message}`);
        });
    }
}
```

**Failure Handling Features:**
- Automatic screenshot capture on test failure
- Timestamped screenshot names
- Browser console log capture
- Allure report attachment
- Detailed error logging

## 8. Allure Reporter Configuration

```javascript
reporters: [
    'spec',
    ['allure', {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: false,
        addConsoleLogs: true,
        docstring: true,
        command: 'allure',
        disableMochaHooks: false,
        addEnvironmentInfo: true,
        addBrowserInfo: true
    }],
    ['junit', {
        outputDir: 'reports',
        outputFileFormat: function(options) {
            return `results-${options.cid}.${options.capabilities.browserName}.xml`;
        }
    }]
]
```

**Allure Features:**
- Interactive HTML reports
- Screenshot attachments
- Console log capture
- Environment information
- Browser information
- Step-by-step test execution
- JUnit XML output for CI/CD

## 9. Page Object Pattern Support

```javascript
pageObjects: {
    baseDir: '../pages',
    pattern: '**/*.js',
    exclude: ['**/node_modules/**']
}
```

**Page Object Features:**
- Automatic page object discovery
- Support for nested page objects
- TypeScript support
- Reusable page components

## 10. Custom Commands

```javascript
customCommands: {
    waitForElement: async function(selector, timeout = 10000) {
        await this.waitForDisplayed(selector, { timeout });
        return this.$(selector);
    },
    
    safeClick: async function(selector, timeout = 10000) {
        const element = await this.waitForElementClickable(selector, timeout);
        await element.click();
    },
    
    safeType: async function(selector, text, timeout = 10000) {
        const element = await this.waitForElement(selector, timeout);
        await element.clearValue();
        await element.setValue(text);
    },
    
    takeScreenshot: async function(name) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const screenshotPath = path.join(process.cwd(), 'screenshots', `${name}_${timestamp}.png`);
        await this.saveScreenshot(screenshotPath);
        return screenshotPath;
    }
}
```

**Custom Commands Benefits:**
- Reusable wait strategies
- Safe element interactions
- Automatic screenshot capture
- Consistent timeout handling

## 11. Services Configuration

```javascript
services: [
    ['chromedriver', {
        chromedriverCustomPath: process.env.CHROMEDRIVER_PATH,
        logFileName: 'chromedriver.log',
        outputDir: 'logs',
        args: ['--verbose']
    }]
]
```

**ChromeDriver Features:**
- Automatic ChromeDriver management
- Custom ChromeDriver path support
- Verbose logging
- Log file output

## 12. Environment Configuration

```javascript
env: {
    NODE_ENV: 'test',
    TEST_ENV: 'webdriverio',
    SCREENSHOT_PATH: './screenshots',
    ALLURE_RESULTS_PATH: './allure-results'
}
```

## Usage Examples

### Running Tests
```bash
# Run all tests
npm test

# Run tests in parallel
npm run test:parallel

# Run tests in headless mode
npm run test:headless

# Generate Allure report
npm run report
```

### Test Structure Example
```javascript
describe('Chatbot Widget Tests', () => {
    beforeEach(async () => {
        await browser.url('/');
        await ChatPage.waitForChatWidget();
    });

    it('should display chat widget', async () => {
        await expect(ChatPage.chatWidget).toBeDisplayed();
    });

    it('should send message successfully', async () => {
        await ChatPage.sendMessage('Hello');
        await ChatPage.waitForBotResponse();
        await expect(ChatPage.lastBotMessage).toHaveTextContaining('Hi');
    });
});
```

## Troubleshooting

### Common Issues:

1. **ChromeDriver Issues:**
   ```bash
   npm install chromedriver --save-dev
   ```

2. **Allure Report Issues:**
   ```bash
   npm install allure-commandline --save-dev
   ```

3. **Screenshot Directory:**
   - Automatically created by `onPrepare` hook
   - Check permissions if issues occur

4. **Timeout Issues:**
   - Increase `waitforTimeout` value
   - Check network connectivity
   - Verify element selectors

### Debug Mode:
```javascript
debug: true,
execArgv: ['--inspect-brk']
```

## Performance Optimization

### Parallel Execution:
```javascript
maxInstances: 10,
maxInstancesPerCapability: 5
```

### Browser Optimization:
- Disabled images and extensions
- Optimized Chrome arguments
- Reduced memory usage

## CI/CD Integration

### Environment Variables:
```bash
export CHROMEDRIVER_PATH="/path/to/chromedriver"
export NODE_ENV=test
export TEST_ENV=ci
```

### Headless Mode for CI:
```javascript
'goog:chromeOptions': {
    args: [
        '--headless',
        '--no-sandbox',
        '--disable-dev-shm-usage'
    ]
}
``` 