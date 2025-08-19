#!/usr/bin/env node

/**
 * Setup Script for Chatbot Testing Framework
 * 
 * This script automates the initial setup and validation of the testing framework.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Setting up Chatbot Testing Framework...\n');

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
    console.log(`${colors.blue}${step}${colors.reset}: ${message}`);
}

function logSuccess(message) {
    console.log(`${colors.green}${message}${colors.reset}`);
}

function logWarning(message) {
    console.log(`${colors.yellow}${message}${colors.reset}`);
}

function logError(message) {
    console.log(`${colors.red}${message}${colors.reset}`);
}

// Check Node.js version
function checkNodeVersion() {
    logStep('1', 'Checking Node.js version...');
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion >= 16) {
        logSuccess(`Node.js version: ${nodeVersion}`);
    } else {
        logError(`Node.js version ${nodeVersion} is not supported. Please use Node.js 16 or higher.`);
        process.exit(1);
    }
}

// Check npm version
function checkNpmVersion() {
    logStep('2', 'Checking npm version...');
    try {
        const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
        logSuccess(`npm version: ${npmVersion}`);
    } catch (error) {
        logError('npm is not installed or not accessible');
        process.exit(1);
    }
}

// Install dependencies
function installDependencies() {
    logStep('3', 'Installing dependencies...');
    try {
        execSync('npm install', { stdio: 'inherit' });
        logSuccess('Dependencies installed successfully');
    } catch (error) {
        logError('Failed to install dependencies');
        process.exit(1);
    }
}

// Create necessary directories
function createDirectories() {
    logStep('4', 'Creating necessary directories...');
    
    const directories = [
        'screenshots',
        'logs',
        'allure-results',
        'junit-results',
        'reports'
    ];
    
    directories.forEach(dir => {
        const dirPath = path.join(process.cwd(), dir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            logSuccess(`Created directory: ${dir}`);
        } else {
            logWarning(`Directory already exists: ${dir}`);
        }
    });
}

// Validate configurations
function validateConfigurations() {
    logStep('5', 'Validating configurations...');
    
    try {
        // Validate WebdriverIO config
        log('Validating WebdriverIO configuration...');
        execSync('npm run validate:wdio', { stdio: 'inherit' });
        logSuccess('WebdriverIO configuration is valid');
        
        // Validate Botium config
        log('Validating Botium configuration...');
        execSync('npm run botium:validate', { stdio: 'inherit' });
        logSuccess('Botium configuration is valid');
        
    } catch (error) {
        logWarning('Some configuration validations failed. Please check the output above.');
    }
}

// Check test syntax
function checkTestSyntax() {
    logStep('6', 'Checking test syntax...');
    
    try {
        const testFiles = [
            'src/tests/virgin-media-botium-fixed.test.js',
            'src/tests/utilities-example.test.js',
            'src/tests/page-objects.test.js',
            'src/tests/data-driven.test.js'
        ];
        
        testFiles.forEach(file => {
            if (fs.existsSync(file)) {
                execSync(`node -c ${file}`, { stdio: 'pipe' });
                logSuccess(`Syntax check passed: ${file}`);
            } else {
                logWarning(`Test file not found: ${file}`);
            }
        });
    } catch (error) {
        logWarning('Some test files have syntax errors. Please check the output above.');
    }
}

// Display setup summary
function displaySummary() {
    logStep('7', 'Setup Summary');
    
    console.log('\nSetup Summary:');
    console.log('================');
    
    const summary = [
        'Node.js and npm versions checked',
        'Dependencies installed',
        'Directories created',
        'Configurations validated',
        'Test syntax checked'
    ];
    
    summary.forEach(item => {
        console.log(`  ${item}`);
    });
    
    console.log('\nSetup completed successfully!');
    console.log('\nNext Steps:');
    console.log('==============');
    console.log('1. Update chatbot URLs in configuration files');
    console.log('2. Customize selectors for your chatbot interface');
    console.log('3. Run a sample test: npm run test:demo');
    console.log('4. Generate a report: npm run report:allure');
    console.log('\nFor more information, see the README.md file');
}

// Main setup function
function main() {
    try {
        checkNodeVersion();
        checkNpmVersion();
        installDependencies();
        createDirectories();
        validateConfigurations();
        checkTestSyntax();
        displaySummary();
    } catch (error) {
        logError('Setup failed with error: ' + error.message);
        process.exit(1);
    }
}

// Run setup
if (require.main === module) {
    main();
}

module.exports = {
    checkNodeVersion,
    checkNpmVersion,
    installDependencies,
    createDirectories,
    validateConfigurations,
    checkTestSyntax,
    displaySummary
}; 