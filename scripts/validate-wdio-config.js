#!/usr/bin/env node

/**
 * WebdriverIO Configuration Validation Script
 * 
 * This script validates the WebdriverIO configuration and checks
 * that all required components are properly set up.
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 WebdriverIO Configuration Validation\n');

// Check if wdio.conf.js exists
const configPath = path.join(__dirname, '../src/config/wdio.conf.js');

if (!fs.existsSync(configPath)) {
    console.error('❌ wdio.conf.js not found at:', configPath);
    process.exit(1);
}

console.log('✅ wdio.conf.js found');

    // Try to load the configuration
    try {
        const config = require(configPath);
        console.log('✅ Configuration file loaded successfully\n');

        // Access the exported config object
        const wdioConfig = config.config || config;

    // Validate key configuration sections
    console.log('📋 Configuration Validation:');

    // Check runner configuration
    if (wdioConfig.runner === 'local') {
        console.log('   ✅ Local runner configured');
    } else {
        console.log('   ⚠️  Runner configuration may need attention');
    }

    // Check capabilities
    if (wdioConfig.capabilities && wdioConfig.capabilities.length > 0) {
        const capability = wdioConfig.capabilities[0];
        console.log(`   ✅ Browser: ${capability.browserName} ${capability.browserVersion || 'latest'}`);
        console.log(`   ✅ Platform: ${capability.platformName || 'windows'}`);
    } else {
        console.log('   ❌ No capabilities configured');
    }

    // Check framework
    if (wdioConfig.framework === 'mocha') {
        console.log('   ✅ Mocha framework configured');
    } else {
        console.log('   ⚠️  Framework configuration may need attention');
    }

    // Check reporters
    if (wdioConfig.reporters && wdioConfig.reporters.length > 0) {
        console.log('   ✅ Reporters configured:');
        wdioConfig.reporters.forEach(reporter => {
            if (typeof reporter === 'string') {
                console.log(`      - ${reporter}`);
            } else if (Array.isArray(reporter)) {
                console.log(`      - ${reporter[0]}`);
            }
        });
    } else {
        console.log('   ⚠️  No reporters configured');
    }

    // Check services
    if (wdioConfig.services && wdioConfig.services.length > 0) {
        console.log('   ✅ Services configured:');
        wdioConfig.services.forEach(service => {
            if (typeof service === 'string') {
                console.log(`      - ${service}`);
            } else if (Array.isArray(service)) {
                console.log(`      - ${service[0]}`);
            }
        });
    } else {
        console.log('   ⚠️  No services configured');
    }

    // Check timeouts
    console.log(`   ✅ Wait timeout: ${wdioConfig.waitforTimeout || 'not set'}ms`);
    console.log(`   ✅ Connection retry timeout: ${wdioConfig.connectionRetryTimeout || 'not set'}ms`);

    // Check base URL
    if (wdioConfig.baseUrl) {
        console.log(`   ✅ Base URL: ${wdioConfig.baseUrl}`);
    } else {
        console.log('   ⚠️  Base URL not configured');
    }

    console.log('\n🔍 Hook Configuration:');
    
    const hooks = [
        'onPrepare', 'beforeSession', 'before', 'beforeTest', 
        'beforeHook', 'afterHook', 'afterTest', 'after', 
        'afterSession', 'onComplete'
    ];

    hooks.forEach(hook => {
        if (typeof wdioConfig[hook] === 'function') {
            console.log(`   ✅ ${hook} hook configured`);
        } else {
            console.log(`   ⚠️  ${hook} hook not configured`);
        }
    });

    console.log('\n📁 Directory Structure Check:');

    // Check if required directories exist or will be created
    const directories = [
        '../screenshots',
        '../allure-results',
        '../reports',
        '../logs'
    ];

    directories.forEach(dir => {
        const dirPath = path.join(__dirname, dir);
        if (fs.existsSync(dirPath)) {
            console.log(`   ✅ ${dir} exists`);
        } else {
            console.log(`   📁 ${dir} will be created by hooks`);
        }
    });

    console.log('\n📦 Package Dependencies Check:');

    // Check if required packages are installed
    const requiredPackages = [
        'webdriverio',
        '@wdio/cli',
        '@wdio/mocha-framework',
        '@wdio/allure-reporter',
        '@wdio/junit-reporter',
        '@wdio/local-runner',
        'wdio-chromedriver-service',
        'chromedriver'
    ];

    requiredPackages.forEach(pkg => {
        try {
            require(pkg);
            console.log(`   ✅ ${pkg} is installed`);
        } catch (error) {
            console.log(`   ❌ ${pkg} is not installed`);
        }
    });

    console.log('\n🎯 Custom Commands Check:');
    
    if (wdioConfig.customCommands) {
        const commands = Object.keys(wdioConfig.customCommands);
        if (commands.length > 0) {
            console.log('   ✅ Custom commands configured:');
            commands.forEach(cmd => {
                console.log(`      - ${cmd}`);
            });
        } else {
            console.log('   ⚠️  No custom commands configured');
        }
    } else {
        console.log('   ⚠️  Custom commands not configured');
    }

    console.log('\n📊 Allure Configuration Check:');
    
    // Check Allure reporter configuration
    const allureReporter = wdioConfig.reporters?.find(reporter => 
        Array.isArray(reporter) && reporter[0] === 'allure'
    );

    if (allureReporter) {
        const allureConfig = allureReporter[1];
        console.log('   ✅ Allure reporter configured with:');
        console.log(`      - Output directory: ${allureConfig.outputDir}`);
        console.log(`      - Console logs: ${allureConfig.addConsoleLogs ? 'enabled' : 'disabled'}`);
        console.log(`      - Screenshots: ${allureConfig.disableWebdriverScreenshotsReporting ? 'disabled' : 'enabled'}`);
        console.log(`      - Environment info: ${allureConfig.addEnvironmentInfo ? 'enabled' : 'disabled'}`);
    } else {
        console.log('   ❌ Allure reporter not configured');
    }

    console.log('\n🚀 Performance Configuration:');
    console.log(`   - Max instances: ${wdioConfig.maxInstances || 'not set'}`);
    console.log(`   - Max instances per capability: ${wdioConfig.maxInstancesPerCapability || 'not set'}`);

    console.log('\n📝 Recommendations:');

    // Provide recommendations based on configuration
    if (!wdioConfig.baseUrl || wdioConfig.baseUrl === 'https://your-chatbot-website.com') {
        console.log('   🔧 Update baseUrl to your actual chatbot website');
    }

    if (!wdioConfig.customCommands) {
        console.log('   🔧 Consider adding custom commands for common operations');
    }

    if (!wdioConfig.env) {
        console.log('   🔧 Consider adding environment variables for configuration');
    }

    console.log('\n✅ WebdriverIO configuration validation completed!');
    console.log('💡 Run "npm test" to execute tests with this configuration.\n');

} catch (error) {
    console.error('❌ Error loading configuration:', error.message);
    console.log('\n💡 Check that the configuration file is valid JavaScript/JSON');
    process.exit(1);
} 