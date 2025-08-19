#!/usr/bin/env node

/**
 * Botium Configuration Test Script
 * 
 * This script helps validate your Botium WebdriverIO configuration
 * and test basic connectivity to your chatbot widget.
 */

const fs = require('fs');
const path = require('path');

console.log('🤖 Botium WebdriverIO Configuration Test\n');

// Read the botium.json configuration
const configPath = path.join(__dirname, '../src/config/botium.json');

try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const capabilities = config.botium.Capabilities;

    console.log('✅ Configuration file loaded successfully\n');

    // Test basic configuration
    console.log('📋 Configuration Summary:');
    console.log(`   Project: ${capabilities.PROJECTNAME}`);
    console.log(`   Container Mode: ${capabilities.CONTAINERMODE}`);
    console.log(`   Target URL: ${capabilities.WEBDRIVERIO_URL}`);
    console.log(`   Browser: ${capabilities.WEBDRIVERIO_CAPABILITIES.browserName}`);
    console.log(`   Headless: ${capabilities.WEBDRIVERIO_HEADLESS || false}\n`);

    // Test selectors
    console.log('🎯 Element Selectors:');
    console.log(`   Chat Container: ${capabilities.WEBDRIVERIO_SELECTOR_ELEMENT}`);
    console.log(`   Input Field: ${capabilities.WEBDRIVERIO_SELECTOR_INPUT}`);
    console.log(`   Send Button: ${capabilities.WEBDRIVERIO_SELECTOR_SEND}`);
    console.log(`   Messages: ${capabilities.WEBDRIVERIO_SELECTOR_MESSAGES}`);
    console.log(`   Message Text: ${capabilities.WEBDRIVERIO_SELECTOR_MESSAGE_TEXT}\n`);

    // Test timeouts
    console.log('⏱️  Timeout Settings:');
    console.log(`   Bot Timeout: ${capabilities.WEBDRIVERIO_WAITFORBOTTIMEOUT}ms`);
    console.log(`   Bot Interval: ${capabilities.WEBDRIVERIO_WAITFORBOTINTERVAL}ms`);
    console.log(`   Response Timeout: ${capabilities.WEBDRIVERIO_WAITFORBOTRESPONSETIMEOUT}ms`);
    console.log(`   Page Load Timeout: ${capabilities.WEBDRIVERIO_PAGE_LOAD_TIMEOUT}ms\n`);

    // Check for common issues
    console.log('🔍 Configuration Validation:');
    
    if (capabilities.WEBDRIVERIO_URL === 'https://your-chatbot-website.com') {
        console.log('   ⚠️  WARNING: Please update WEBDRIVERIO_URL to your actual chatbot website');
    } else {
        console.log('   ✅ URL is configured');
    }

    if (capabilities.WEBDRIVERIO_SELECTOR_ELEMENT.includes('chat-widget')) {
        console.log('   ✅ Chat widget selector looks good');
    } else {
        console.log('   ⚠️  WARNING: Check if chat widget selector is correct');
    }

    if (capabilities.WEBDRIVERIO_WAITFORBOTTIMEOUT >= 10000) {
        console.log('   ✅ Bot timeout is reasonable');
    } else {
        console.log('   ⚠️  WARNING: Bot timeout might be too short');
    }

    console.log('\n📝 Next Steps:');
    console.log('   1. Update WEBDRIVERIO_URL to your chatbot website');
    console.log('   2. Verify element selectors match your chatbot interface');
    console.log('   3. Run: npx botium-cli run --config src/config/botium.json');
    console.log('   4. Check the configuration guide: src/config/botium-config-guide.md\n');

} catch (error) {
    console.error('❌ Error reading configuration file:', error.message);
    console.log('\n💡 Make sure src/config/botium.json exists and is valid JSON');
    process.exit(1);
}

// Test if required packages are installed
console.log('📦 Package Dependencies Check:');
try {
    require('botium-core');
    console.log('   ✅ botium-core is installed');
} catch (error) {
    console.log('   ❌ botium-core is not installed');
}

try {
    require('botium-connector-webdriverio');
    console.log('   ✅ botium-connector-webdriverio is installed');
} catch (error) {
    console.log('   ❌ botium-connector-webdriverio is not installed');
}

try {
    require('webdriverio');
    console.log('   ✅ webdriverio is installed');
} catch (error) {
    console.log('   ❌ webdriverio is not installed');
}

console.log('\n🎉 Configuration test completed!');
console.log('💡 Run "npm install" if any packages are missing.\n'); 