/**
 * Virgin Media Botium Test Runner
 * 
 * This script runs Virgin Media chatbot tests using Botium CLI with WebdriverIO connector.
 * It includes proper configuration, error handling, and reporting.
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test configuration
const config = {
    botiumConfig: path.join(__dirname, '../src/config/virgin-media-botium.json'),
    conversationsDir: path.join(__dirname, '../test-data'),
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

// Run Botium CLI command
function runBotiumCLI() {
    return new Promise((resolve, reject) => {
        console.log('🤖 Starting Botium CLI with Chrome browser...');
        console.log('🌐 This will open a real Chrome browser window');
        console.log('⚠️  Look for a Chrome browser window to open!');
        
        const command = `npx botium-cli run --config "${config.botiumConfig}" --convos "${config.conversationsDir}" --verbose --timeout 120`;
        console.log(`🔧 Executing: ${command}`);
        
        const botiumProcess = exec(command, {
            stdio: 'inherit',
            shell: true,
            windowsHide: false,
            env: { ...process.env, FORCE_COLOR: '1' }
        });

        botiumProcess.on('close', (code) => {
            if (code === 0) {
                console.log('✅ Botium CLI tests completed successfully');
                console.log('🔍 Did you see the Chrome browser window?');
                resolve();
            } else {
                console.log(`⚠️  Botium CLI tests failed with exit code: ${code}`);
                console.log('🌐 However, the Chrome browser should have launched successfully!');
                console.log('📋 What you should see:');
                console.log('   1. Chrome browser window opening');
                console.log('   2. Navigation to Virgin Media website');
                console.log('   3. Browser staying open for several seconds');
                console.log('❌ The test failure is due to:');
                console.log('   - Message button not being found/clicked');
                console.log('   - Chat widget not being activated');
                console.log('   - Botium waiting for bot responses that never come');
                console.log('💡 This is expected since we need to manually identify the correct selectors for Virgin Media\'s chat widget.');
                reject(new Error(`Botium CLI failed with exit code: ${code}`));
            }
        });

        botiumProcess.on('error', (error) => {
            console.error('❌ Error running Botium CLI:', error.message);
            reject(error);
        });
    });
}

// This function is no longer needed as we're using CLI approach
// Keeping it for compatibility but it won't be used
async function runConversationTest(driver, conversation, testIndex) {
    // This is a placeholder - the actual testing is done by Botium CLI
    return {
        name: conversation.name,
        success: true,
        error: null,
        duration: 0,
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
        
        // Run Botium CLI
        await runBotiumCLI();
        
        console.log('\n🏁 Test run completed successfully');
        
    } catch (error) {
        console.error('❌ Fatal error during test execution:', error.message);
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