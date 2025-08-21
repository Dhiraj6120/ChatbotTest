/**
 * Utilities Index
 * 
 * Main entry point for all utility modules. Provides easy access to
 * all helper utilities for test automation.
 */

// Import all utility modules
const { testDataManager } = require('./test-data-manager');
const { assertions } = require('./assertions');
const { screenshotManager } = require('./screenshot-manager');
const { waitUtils } = require('./wait-utils');
const { errorHandler } = require('./error-handler');
const SessionManager = require('./session-manager');

// Export all utilities
module.exports = {
    // Test Data Management
    testDataManager,
    
    // Assertions
    assertions,
    
    // Screenshot Management
    screenshotManager,
    
    // Wait Utilities
    waitUtils,
    
    // Error Handling
    errorHandler,
    
    // Session Management
    SessionManager,
    
    // Convenience methods for common operations
    utils: {
        /**
         * Initialize all utilities with test context
         * @param {string} suiteName - Test suite name
         * @param {string} testName - Test name
         */
        initTestContext(suiteName, testName) {
            screenshotManager.setTestContext(suiteName, testName);
            console.log(`🔧 Utilities initialized for: ${suiteName} > ${testName}`);
        },

        /**
         * Reset all utilities state
         */
        resetAll() {
            testDataManager.clearCache();
            assertions.resetStats();
            screenshotManager.reset();
            errorHandler.clearErrorLog();
            console.log('🔄 All utilities reset');
        },

        /**
         * Get comprehensive statistics from all utilities
         * @returns {Object} Combined statistics
         */
        getAllStats() {
            return {
                testData: testDataManager.getCacheStats(),
                assertions: assertions.getStats(),
                screenshots: screenshotManager.getScreenshotStats(),
                errors: errorHandler.getErrorStats(),
                waitConfig: waitUtils.getTimeouts()
            };
        },

        /**
         * Create comprehensive report from all utilities
         * @param {string} outputDir - Output directory for reports
         * @returns {Promise<Object>} Report paths
         */
        async createComprehensiveReport(outputDir = null) {
            const reports = {};
            
            try {
                // Create error report
                reports.errorReport = await errorHandler.createErrorReport(
                    outputDir ? `${outputDir}/error-report.json` : null
                );
                
                // Create screenshot report
                reports.screenshotReport = await screenshotManager.createScreenshotReport(
                    outputDir ? `${outputDir}/screenshot-report.json` : null
                );
                
                // Create combined statistics report
                const stats = this.getAllStats();
                const combinedReport = {
                    generatedAt: new Date().toISOString(),
                    summary: {
                        testDataCacheSize: stats.testData.size,
                        totalAssertions: stats.assertions.total,
                        totalScreenshots: stats.screenshots.totalScreenshots,
                        totalErrors: stats.errors.totalErrors
                    },
                    details: stats
                };
                
                const combinedReportPath = outputDir ? 
                    `${outputDir}/combined-report.json` : 
                    `./logs/combined-report-${Date.now()}.json`;
                
                const fs = require('fs');
                fs.writeFileSync(combinedReportPath, JSON.stringify(combinedReport, null, 2));
                reports.combinedReport = combinedReportPath;
                
                console.log('📊 Comprehensive report created');
                return reports;
            } catch (error) {
                console.error('❌ Error creating comprehensive report:', error.message);
                throw error;
            }
        },

        /**
         * Configure all utilities with custom settings
         * @param {Object} config - Configuration object
         */
        configureAll(config) {
            if (config.waitTimeouts) {
                waitUtils.setTimeouts(config.waitTimeouts);
            }
            
            if (config.retryConfig) {
                errorHandler.setRetryConfig(config.retryConfig);
            }
            
            if (config.screenshotConfig) {
                // Add screenshot configuration if needed
                console.log('📸 Screenshot configuration updated');
            }
            
            console.log('⚙️ All utilities configured');
        }
    }
};

// Export individual utilities for direct access
module.exports.testDataManager = testDataManager;
module.exports.assertions = assertions;
module.exports.screenshotManager = screenshotManager;
module.exports.waitUtils = waitUtils;
module.exports.errorHandler = errorHandler;
module.exports.SessionManager = SessionManager; 