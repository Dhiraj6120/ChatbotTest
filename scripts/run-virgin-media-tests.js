/**
 * Virgin Media Botium Test Runner
 * 
 * This script runs Virgin Media chatbot tests using Botium with WebdriverIO connector.
 * It includes proper configuration, error handling, and reporting.
 */

const { BotDriver, Capabilities } = require('botium-core');
const fs = require('fs');
const path = require('path');

// Test configuration
const config = {
    botiumConfig: path.join(__dirname, '../src/config/virgin-media-botium.json'),
    conversationsFile: path.join(__dirname, '../test-data/virgin-media-conversations.json'),
    screenshotsDir: path.join(__dirname, '../screenshots/virgin-media'),
    logsDir: path.join(__dirname, '../logs'),
    resultsDir: path.join(__dirname, '../test-results/virgin-media')
};

// Ensure directories exist
function ensureDirectories() {
    const dirs = [
        config.screenshotsDir,
        config.logsDir,
        config.resultsDir
    ];
    
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`📁 Created directory: ${dir}`);
        }
    });
}

// Load Botium configuration
function loadBotiumConfig() {
    try {
        const configData = fs.readFileSync(config.botiumConfig, 'utf8');
        return JSON.parse(configData);
    } catch (error) {
        console.error('❌ Error loading Botium configuration:', error.message);
        process.exit(1);
    }
}

// Load conversations
function loadConversations() {
    try {
        const conversationsData = fs.readFileSync(config.conversationsFile, 'utf8');
        return JSON.parse(conversationsData);
    } catch (error) {
        console.error('❌ Error loading conversations:', error.message);
        process.exit(1);
    }
}

// Initialize Botium driver
async function initializeDriver(botiumConfig) {
    console.log('🤖 Initializing Botium driver...');
    
    try {
        const driver = new BotDriver(Capabilities.botium(botiumConfig));
        await driver.Build();
        await driver.Start();
        console.log('✅ Botium driver initialized successfully');
        return driver;
    } catch (error) {
        console.error('❌ Error initializing Botium driver:', error.message);
        throw error;
    }
}

// Run a single conversation test
async function runConversationTest(driver, conversation, testIndex) {
    const testName = conversation.name;
    console.log(`\n🧪 Running test ${testIndex + 1}: ${testName}`);
    
    const startTime = Date.now();
    let success = false;
    let error = null;
    
    try {
        // Run the conversation
        await driver.Build();
        await driver.Start();
        
        for (let i = 0; i < conversation.convo.length; i++) {
            const message = conversation.convo[i];
            
            if (message.sender === 'me') {
                console.log(`   👤 User: ${message.messageText}`);
                await driver.UserSays(message);
            } else if (message.sender === 'bot') {
                await driver.WaitBotSays();
                await driver.BotSays(message);
                console.log(`   🤖 Bot: ${message.messageText.substring(0, 100)}...`);
            }
        }
        
        success = true;
        const duration = Date.now() - startTime;
        console.log(`   ✅ Test completed successfully in ${duration}ms`);
        
    } catch (err) {
        error = err;
        const duration = Date.now() - startTime;
        console.log(`   ❌ Test failed after ${duration}ms: ${err.message}`);
        
        // Take screenshot on failure
        try {
            const screenshotPath = path.join(config.screenshotsDir, `failure_${testIndex}_${Date.now()}.png`);
            await driver.container.seleniumWebdriver.takeScreenshot().then(data => {
                fs.writeFileSync(screenshotPath, data, 'base64');
                console.log(`   📸 Screenshot saved: ${screenshotPath}`);
            });
        } catch (screenshotError) {
            console.log(`   ⚠️ Could not take screenshot: ${screenshotError.message}`);
        }
    } finally {
        try {
            await driver.Stop();
            await driver.Clean();
        } catch (cleanupError) {
            console.log(`   ⚠️ Cleanup error: ${cleanupError.message}`);
        }
    }
    
    return {
        name: testName,
        success,
        error: error ? error.message : null,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
    };
}

// Generate test report
function generateReport(testResults) {
    const totalTests = testResults.length;
    const passedTests = testResults.filter(result => result.success).length;
    const failedTests = totalTests - passedTests;
    const successRate = ((passedTests / totalTests) * 100).toFixed(2);
    
    const report = {
        summary: {
            totalTests,
            passedTests,
            failedTests,
            successRate: `${successRate}%`,
            timestamp: new Date().toISOString()
        },
        results: testResults
    };
    
    // Save report to file
    const reportPath = path.join(config.resultsDir, `virgin-media-test-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Print summary
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success Rate: ${successRate}%`);
    console.log(`Report saved: ${reportPath}`);
    
    // Print detailed results
    console.log('\n📋 Detailed Results:');
    console.log('===================');
    testResults.forEach((result, index) => {
        const status = result.success ? '✅ PASS' : '❌ FAIL';
        const duration = `${result.duration}ms`;
        console.log(`${index + 1}. ${result.name} - ${status} (${duration})`);
        if (!result.success && result.error) {
            console.log(`   Error: ${result.error}`);
        }
    });
    
    return report;
}

// Main test runner
async function runVirginMediaTests() {
    console.log('🚀 Starting Virgin Media Botium Tests');
    console.log('=====================================');
    
    try {
        // Ensure directories exist
        ensureDirectories();
        
        // Load configuration and conversations
        const botiumConfig = loadBotiumConfig();
        const conversations = loadConversations();
        
        console.log(`📁 Loaded ${conversations.convos.length} conversation tests`);
        
        // Initialize driver
        const driver = await initializeDriver(botiumConfig);
        
        // Run all conversation tests
        const testResults = [];
        
        for (let i = 0; i < conversations.convos.length; i++) {
            const conversation = conversations.convos[i];
            const result = await runConversationTest(driver, conversation, i);
            testResults.push(result);
            
            // Add delay between tests
            if (i < conversations.convos.length - 1) {
                console.log('   ⏳ Waiting 2 seconds before next test...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
        // Generate and save report
        const report = generateReport(testResults);
        
        // Cleanup
        try {
            await driver.Stop();
            await driver.Clean();
        } catch (cleanupError) {
            console.log(`⚠️ Final cleanup error: ${cleanupError.message}`);
        }
        
        // Exit with appropriate code
        const exitCode = report.summary.failedTests > 0 ? 1 : 0;
        console.log(`\n🏁 Test run completed with exit code: ${exitCode}`);
        process.exit(exitCode);
        
    } catch (error) {
        console.error('❌ Fatal error during test execution:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n⚠️ Test execution interrupted by user');
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('\n⚠️ Test execution terminated');
    process.exit(1);
});

// Run tests if this script is executed directly
if (require.main === module) {
    runVirginMediaTests();
}

module.exports = {
    runVirginMediaTests,
    config
}; 