const { config } = require('@wdio/cli');
const path = require('path');

exports.config = {
    // ====================
    // Runner Configuration
    // ====================
    runner: 'local',
    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            project: './tsconfig.json',
            transpileOnly: true
        }
    },

    // ==================
    // Specify Test Files
    // ==================
    specs: [
        '../tests/**/*.js',
        '../tests/**/*.ts'
    ],
    exclude: [
        '../tests/**/node_modules/**',
        '../tests/**/temp/**'
    ],

    // ============
    // Capabilities
    // ============
    maxInstances: 10,
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
                '--start-maximized',
                '--window-size=1920,1080',
                '--remote-debugging-port=9222'
            ],
            prefs: {
                'profile.default_content_setting_values.notifications': 2,
                'profile.default_content_setting_values.media_stream': 2,
                'profile.default_content_setting_values.geolocation': 2
            }
        },
        'goog:loggingPrefs': {
            browser: 'ALL',
            driver: 'ALL'
        }
    }],

    // ===================
    // Test Configurations
    // ===================
    logLevel: 'info',
    bail: 1, // Stop on first failure to prevent infinite loops
    baseUrl: 'https://your-chatbot-website.com',
    waitforTimeout: 15000,
    connectionRetryTimeout: 30000, // Reduced from 120000 to prevent long hangs
    connectionRetryCount: 1, // Reduced from 3 to prevent multiple retries
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
        retries: 0 // No retries to prevent infinite loops
    },

    // =====
    // Hooks
    // =====
    onPrepare: function (config, capabilities) {
        console.log('Starting Virgin Media WebdriverIO test session...');
        
        // Create directories if they don't exist
        const fs = require('fs');
        const path = require('path');
        
        const dirs = ['screenshots', 'logs', 'allure-results', 'test-results'];
        dirs.forEach(dir => {
            const dirPath = path.join(process.cwd(), dir);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
                console.log(`Created directory: ${dir}`);
            }
        });
        
        console.log('Test session ready');
    },

    beforeSession: function (config, capabilities, specs) {
        console.log('Test session configuration loaded');
    },

    before: function (capabilities, specs) {
        console.log('Setting up test environment...');
        
        // Set implicit wait
        browser.setTimeout({ implicit: 10000 });
        
        // Set page load timeout
        browser.setTimeout({ pageLoad: 30000 });
        
        // Set script timeout
        browser.setTimeout({ script: 30000 });
    },

    beforeTest: function (test, context) {
        console.log(`Starting test: ${test.title}`);
        
        // Validate browser session before each test
        try {
            browser.getTitle();
        } catch (error) {
            if (error.message.includes('invalid session id') || 
                error.message.includes('no such session') ||
                error.message.includes('chrome not reachable')) {
                console.log('Browser session is invalid. Stopping test execution.');
                throw new Error('Invalid browser session detected. Please restart the test.');
            }
        }
        
        // Clear browser storage before each test
        try {
            browser.execute('window.localStorage.clear();');
            browser.execute('window.sessionStorage.clear();');
            browser.deleteAllCookies();
        } catch (error) {
            console.log(`Could not clear browser storage: ${error.message}`);
        }
    },

    beforeHook: function (test, context) {
        console.log(`Executing hook for: ${test.title}`);
    },

    afterHook: function (test, context, { error, result, duration, passed, retries }) {
        if (error) {
            console.log(`Hook failed: ${error.message}`);
        }
    },

    afterTest: async function (test, context, { error, result, duration, passed, retries }) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const testName = test.title.replace(/\s+/g, '_');
        
        if (!passed) {
            console.log(`Test failed: ${test.title}`);
            
            // Check if browser session is still valid before taking screenshot
            let sessionValid = false;
            try {
                await browser.getTitle();
                sessionValid = true;
            } catch (error) {
                if (error.message.includes('invalid session id') || 
                    error.message.includes('no such session') ||
                    error.message.includes('chrome not reachable')) {
                    console.log('Browser session is invalid, skipping screenshot and logs');
                    sessionValid = false;
                }
            }
            
            if (sessionValid) {
                // Take screenshot on failure
                try {
                    const screenshotPath = path.join(process.cwd(), 'screenshots', `failed_${testName}_${timestamp}.png`);
                    await browser.saveScreenshot(screenshotPath);
                    console.log(`Screenshot saved: ${screenshotPath}`);
                    
                    // Attach screenshot to Allure report
                    const allure = require('allure-commandline');
                    if (allure) {
                        allure.addAttachment('Screenshot', screenshotPath, 'image/png');
                    }
                } catch (screenshotError) {
                    console.log(`Failed to take screenshot: ${screenshotError.message}`);
                }
                
                // Capture browser console logs
                try {
                    const logs = await browser.getLogs('browser');
                    if (logs.length > 0) {
                        console.log('Browser console logs:');
                        logs.forEach(log => {
                            console.log(`   ${log.level}: ${log.message}`);
                        });
                    }
                } catch (logError) {
                    console.log(`Failed to capture logs: ${logError.message}`);
                }
            }
        } else {
            console.log(`Test passed: ${test.title} (${duration}ms)`);
        }
    },

    after: function (result, capabilities, specs) {
        console.log('Cleaning up test environment...');
    },

    afterSession: function (config, capabilities, specs) {
        console.log('Test session completed');
    },

    onComplete: function (exitCode, config, capabilities, results) {
        console.log('All tests completed!');
        
        // Generate Allure report
        const allure = require('allure-commandline');
        if (allure) {
            console.log('Generating Allure report...');
            allure(['generate', 'allure-results', '--clean']);
        }
    },

    // ===================
    // Services
    // ===================
    services: [
        ['chromedriver', {
            chromedriverCustomPath: process.env.CHROMEDRIVER_PATH,
            logFileName: 'chromedriver.log',
            outputDir: 'logs',
            args: ['--verbose']
        }]
    ],

    // ===================
    // Reporter Configuration
    // ===================
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: false,
            disableWebdriverScreenshotsReporting: false,
            addConsoleLogs: true,
            docstring: true,
            command: true,
            environmentInfo: {
                framework: 'WebdriverIO',
                version: '8.x',
                node: process.version,
                platform: process.platform,
                browser: 'Chrome',
                testEnvironment: 'chatbot-testing'
            },
            issueLinkTemplate: 'https://github.com/your-repo/issues/{}',
            tmsLinkTemplate: 'https://your-tms.com/test-cases/{}',
            addAttachments: true,
            allureCommandline: 'allure',
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
    ],

    // ===================
    // Page Object Pattern Support
    // ===================
    pageObjects: {
        baseDir: '../pages',
        pattern: '**/*.js',
        exclude: ['**/node_modules/**']
    },

    // ===================
    // Wait Strategies
    // ===================
    waitforTimeout: 15000,
    waitforInterval: 1000,

    // ===================
    // Browser Configuration
    // ===================
    browserName: 'chrome',
    browserVersion: 'latest',
    platformName: 'windows',

    // ===================
    // Performance Configuration
    // ===================
    maxInstancesPerCapability: 5,
    maxInstances: 10,

    // ===================
    // Debug Configuration
    // ===================
    debug: false,
    execArgv: [],

    // ===================
    // Custom Commands
    // ===================
    customCommands: {
        waitForElement: async function(selector, timeout = 10000) {
            await this.waitForDisplayed(selector, { timeout });
            return this.$(selector);
        },
        
        waitForElementClickable: async function(selector, timeout = 10000) {
            await this.waitForClickable(selector, { timeout });
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
    },

    // ===================
    // Environment Variables
    // ===================
    env: {
        NODE_ENV: 'test',
        TEST_ENV: 'webdriverio',
        SCREENSHOT_PATH: './screenshots',
        ALLURE_RESULTS_PATH: './allure-results'
    }
}; 