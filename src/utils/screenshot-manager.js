/**
 * Screenshot Manager Utility
 * 
 * Provides utilities for capturing, organizing, and managing screenshots
 * across different test files. Includes automatic naming, categorization,
 * and integration with test reporting.
 */

const fs = require('fs');
const path = require('path');

class ScreenshotManager {
    constructor() {
        this.screenshotsDir = path.join(__dirname, '../../screenshots');
        this.screenshotCount = 0;
        this.currentTestName = '';
        this.currentSuiteName = '';
        this.screenshotHistory = [];
        
        // Ensure screenshots directory exists
        this._ensureDirectoryExists(this.screenshotsDir);
    }

    /**
     * Set current test context for automatic naming
     * @param {string} suiteName - Test suite name
     * @param {string} testName - Test name
     */
    setTestContext(suiteName, testName) {
        this.currentSuiteName = this._sanitizeName(suiteName);
        this.currentTestName = this._sanitizeName(testName);
        console.log(`📸 Screenshot context set: ${suiteName} > ${testName}`);
    }

    /**
     * Take screenshot with automatic naming
     * @param {string} description - Optional description for the screenshot
     * @param {Object} browser - WebdriverIO browser instance
     * @returns {Promise<string>} Path to the saved screenshot
     */
    async takeScreenshot(description = '', browser = null) {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const descriptionPart = description ? `_${this._sanitizeName(description)}` : '';
            const filename = `${this.currentSuiteName}_${this.currentTestName}${descriptionPart}_${timestamp}.png`;
            const filePath = path.join(this.screenshotsDir, filename);

            if (browser) {
                await browser.saveScreenshot(filePath);
            } else {
                // Fallback to global browser if available
                if (typeof browser !== 'undefined' && browser.saveScreenshot) {
                    await browser.saveScreenshot(filePath);
                } else {
                    throw new Error('No browser instance provided for screenshot');
                }
            }

            this.screenshotCount++;
            const screenshotInfo = {
                path: filePath,
                filename,
                description,
                suite: this.currentSuiteName,
                test: this.currentTestName,
                timestamp: new Date().toISOString(),
                size: fs.statSync(filePath).size
            };

            this.screenshotHistory.push(screenshotInfo);
            console.log(`📸 Screenshot saved: ${filename}`);
            
            return filePath;
        } catch (error) {
            console.error('❌ Error taking screenshot:', error.message);
            throw error;
        }
    }

    /**
     * Take screenshot on test failure
     * @param {string} errorMessage - Error message for context
     * @param {Object} browser - WebdriverIO browser instance
     * @returns {Promise<string>} Path to the saved screenshot
     */
    async takeFailureScreenshot(errorMessage, browser = null) {
        const description = `failure_${this._sanitizeName(errorMessage.substring(0, 50))}`;
        return await this.takeScreenshot(description, browser);
    }

    /**
     * Take screenshot at specific test step
     * @param {string} stepName - Name of the test step
     * @param {Object} browser - WebdriverIO browser instance
     * @returns {Promise<string>} Path to the saved screenshot
     */
    async takeStepScreenshot(stepName, browser = null) {
        const description = `step_${this._sanitizeName(stepName)}`;
        return await this.takeScreenshot(description, browser);
    }

    /**
     * Take screenshot before and after action
     * @param {string} actionName - Name of the action
     * @param {Function} action - Action to perform
     * @param {Object} browser - WebdriverIO browser instance
     * @returns {Promise<Object>} Object with before and after screenshot paths
     */
    async takeBeforeAfterScreenshots(actionName, action, browser = null) {
        try {
            // Take before screenshot
            const beforePath = await this.takeScreenshot(`before_${actionName}`, browser);
            
            // Perform action
            await action();
            
            // Take after screenshot
            const afterPath = await this.takeScreenshot(`after_${actionName}`, browser);
            
            console.log(`📸 Before/After screenshots taken for: ${actionName}`);
            
            return {
                before: beforePath,
                after: afterPath,
                action: actionName
            };
        } catch (error) {
            console.error(`❌ Error taking before/after screenshots for ${actionName}:`, error.message);
            throw error;
        }
    }

    /**
     * Take screenshot with custom filename
     * @param {string} filename - Custom filename (without extension)
     * @param {Object} browser - WebdriverIO browser instance
     * @returns {Promise<string>} Path to the saved screenshot
     */
    async takeCustomScreenshot(filename, browser = null) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fullFilename = `${this._sanitizeName(filename)}_${timestamp}.png`;
        const filePath = path.join(this.screenshotsDir, fullFilename);

        try {
            if (browser) {
                await browser.saveScreenshot(filePath);
            } else {
                throw new Error('No browser instance provided for screenshot');
            }

            this.screenshotCount++;
            const screenshotInfo = {
                path: filePath,
                filename: fullFilename,
                description: filename,
                suite: this.currentSuiteName,
                test: this.currentTestName,
                timestamp: new Date().toISOString(),
                size: fs.statSync(filePath).size
            };

            this.screenshotHistory.push(screenshotInfo);
            console.log(`📸 Custom screenshot saved: ${fullFilename}`);
            
            return filePath;
        } catch (error) {
            console.error('❌ Error taking custom screenshot:', error.message);
            throw error;
        }
    }

    /**
     * Take screenshot for specific element
     * @param {string} elementSelector - CSS selector for the element
     * @param {string} description - Description for the screenshot
     * @param {Object} browser - WebdriverIO browser instance
     * @returns {Promise<string>} Path to the saved screenshot
     */
    async takeElementScreenshot(elementSelector, description, browser = null) {
        try {
            if (!browser) {
                throw new Error('Browser instance required for element screenshot');
            }

            const element = await browser.$(elementSelector);
            if (!element) {
                throw new Error(`Element not found: ${elementSelector}`);
            }

            // Scroll element into view
            await element.scrollIntoView();
            
            // Take screenshot
            const screenshotPath = await this.takeScreenshot(`element_${description}`, browser);
            
            console.log(`📸 Element screenshot taken for: ${elementSelector}`);
            return screenshotPath;
        } catch (error) {
            console.error('❌ Error taking element screenshot:', error.message);
            throw error;
        }
    }

    /**
     * Take screenshot for full page
     * @param {string} description - Description for the screenshot
     * @param {Object} browser - WebdriverIO browser instance
     * @returns {Promise<string>} Path to the saved screenshot
     */
    async takeFullPageScreenshot(description, browser = null) {
        try {
            if (!browser) {
                throw new Error('Browser instance required for full page screenshot');
            }

            // Scroll to top
            await browser.execute('window.scrollTo(0, 0)');
            
            // Take screenshot
            const screenshotPath = await this.takeScreenshot(`fullpage_${description}`, browser);
            
            console.log(`📸 Full page screenshot taken: ${description}`);
            return screenshotPath;
        } catch (error) {
            console.error('❌ Error taking full page screenshot:', error.message);
            throw error;
        }
    }

    /**
     * Get screenshot statistics
     * @returns {Object} Screenshot statistics
     */
    getScreenshotStats() {
        const totalSize = this.screenshotHistory.reduce((sum, screenshot) => sum + screenshot.size, 0);
        
        return {
            totalScreenshots: this.screenshotCount,
            totalSize: totalSize,
            totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
            currentSuite: this.currentSuiteName,
            currentTest: this.currentTestName,
            history: this.screenshotHistory
        };
    }

    /**
     * Get screenshots for specific test
     * @param {string} suiteName - Suite name to filter by
     * @param {string} testName - Test name to filter by
     * @returns {Array} Array of screenshot info objects
     */
    getScreenshotsForTest(suiteName, testName) {
        return this.screenshotHistory.filter(screenshot => 
            screenshot.suite === this._sanitizeName(suiteName) &&
            screenshot.test === this._sanitizeName(testName)
        );
    }

    /**
     * Get screenshots by date range
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Array} Array of screenshot info objects
     */
    getScreenshotsByDateRange(startDate, endDate) {
        return this.screenshotHistory.filter(screenshot => {
            const screenshotDate = new Date(screenshot.timestamp);
            return screenshotDate >= startDate && screenshotDate <= endDate;
        });
    }

    /**
     * Clean up old screenshots
     * @param {number} daysToKeep - Number of days to keep screenshots
     * @returns {Promise<number>} Number of screenshots deleted
     */
    async cleanupOldScreenshots(daysToKeep = 7) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
            
            let deletedCount = 0;
            
            for (const screenshot of this.screenshotHistory) {
                const screenshotDate = new Date(screenshot.timestamp);
                if (screenshotDate < cutoffDate) {
                    try {
                        if (fs.existsSync(screenshot.path)) {
                            fs.unlinkSync(screenshot.path);
                            deletedCount++;
                            console.log(`🗑️ Deleted old screenshot: ${screenshot.filename}`);
                        }
                    } catch (error) {
                        console.warn(`⚠️ Could not delete screenshot: ${screenshot.filename}`);
                    }
                }
            }
            
            // Remove from history
            this.screenshotHistory = this.screenshotHistory.filter(screenshot => {
                const screenshotDate = new Date(screenshot.timestamp);
                return screenshotDate >= cutoffDate;
            });
            
            console.log(`🧹 Cleaned up ${deletedCount} old screenshots`);
            return deletedCount;
        } catch (error) {
            console.error('❌ Error cleaning up old screenshots:', error.message);
            throw error;
        }
    }

    /**
     * Create screenshot report
     * @param {string} outputPath - Path to save the report
     * @returns {Promise<string>} Path to the generated report
     */
    async createScreenshotReport(outputPath = null) {
        try {
            const stats = this.getScreenshotStats();
            const report = {
                generatedAt: new Date().toISOString(),
                statistics: stats,
                screenshots: this.screenshotHistory,
                summary: {
                    totalScreenshots: stats.totalScreenshots,
                    totalSizeMB: stats.totalSizeMB,
                    suites: [...new Set(this.screenshotHistory.map(s => s.suite))],
                    tests: [...new Set(this.screenshotHistory.map(s => s.test))]
                }
            };

            const reportPath = outputPath || path.join(this.screenshotsDir, `screenshot-report-${Date.now()}.json`);
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
            
            console.log(`📊 Screenshot report generated: ${reportPath}`);
            return reportPath;
        } catch (error) {
            console.error('❌ Error creating screenshot report:', error.message);
            throw error;
        }
    }

    /**
     * Reset screenshot manager state
     */
    reset() {
        this.screenshotCount = 0;
        this.currentTestName = '';
        this.currentSuiteName = '';
        this.screenshotHistory = [];
        console.log('🔄 Screenshot manager reset');
    }

    /**
     * Ensure directory exists
     * @param {string} dirPath - Directory path
     */
    _ensureDirectoryExists(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`📁 Created screenshots directory: ${dirPath}`);
        }
    }

    /**
     * Sanitize name for filename
     * @param {string} name - Name to sanitize
     * @returns {string} Sanitized name
     */
    _sanitizeName(name) {
        return name
            .replace(/[^a-zA-Z0-9\s-_]/g, '')
            .replace(/\s+/g, '_')
            .toLowerCase()
            .substring(0, 50);
    }
}

// Create singleton instance
const screenshotManager = new ScreenshotManager();

// Export both class and singleton instance
module.exports = {
    ScreenshotManager,
    screenshotManager
}; 