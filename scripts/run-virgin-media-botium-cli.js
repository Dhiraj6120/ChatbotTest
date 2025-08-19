/**
 * Virgin Media Botium CLI Test Runner
 * 
 * This script runs Virgin Media chatbot tests using Botium CLI with WebdriverIO connector.
 * It will open an actual Chrome browser and run the tests against the live Virgin Media chatbot.
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

// Run Botium CLI command
function runBotiumCLI() {
    return new Promise((resolve, reject) => {
        console.log('🤖 Starting Botium CLI with Chrome browser...');
        console.log('🌐 This will open a real Chrome browser window');
        
        const command = `npx botium-cli run --config "${config.botiumConfig}" --convos "${config.conversationsDir}" --verbose`;
        console.log(`🔧 Executing: ${command}`);
        
        const botiumProcess = exec(command, {
            stdio: 'inherit',
            shell: true,
            windowsHide: false
        });

        botiumProcess.on('close', (code) => {
            if (code === 0) {
                console.log('✅ Botium CLI tests completed successfully');
                resolve();
            } else {
                console.log(`❌ Botium CLI tests failed with exit code: ${code}`);
                reject(new Error(`Botium CLI failed with exit code: ${code}`));
            }
        });

        botiumProcess.on('error', (error) => {
            console.error('❌ Error running Botium CLI:', error.message);
            reject(error);
        });
    });
}

// Main test execution function
async function runVirginMediaTests() {
    console.log('🚀 Starting Virgin Media Botium CLI Tests');
    console.log('==========================================');
    
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