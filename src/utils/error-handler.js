/**
 * Error Handler Utility
 * 
 * Provides comprehensive error handling, logging, and recovery mechanisms
 * for test automation. Includes error categorization, retry logic, and reporting.
 */

const fs = require('fs');
const path = require('path');

class ErrorHandler {
    constructor() {
        this.errorLog = [];
        this.retryAttempts = new Map();
        this.maxRetries = 3;
        this.retryDelay = 1000;
        this.logsDir = path.join(__dirname, '../../logs');
        
        // Ensure logs directory exists
        this._ensureDirectoryExists(this.logsDir);
    }

    /**
     * Handle error with categorization and logging
     * @param {Error} error - Error object
     * @param {string} context - Error context (test name, action, etc.)
     * @param {Object} options - Additional options
     * @returns {Object} Error information
     */
    handleError(error, context = '', options = {}) {
        const errorInfo = {
            message: error.message,
            stack: error.stack,
            context: context,
            timestamp: new Date().toISOString(),
            type: this._categorizeError(error),
            severity: this._determineSeverity(error),
            recoverable: this._isRecoverable(error),
            ...options
        };

        this.errorLog.push(errorInfo);
        this._logError(errorInfo);
        
        console.error(`❌ Error in ${context}: ${error.message}`);
        
        return errorInfo;
    }

    /**
     * Execute function with retry logic
     * @param {Function} fn - Function to execute
     * @param {string} context - Context for error handling
     * @param {Object} options - Retry options
     * @returns {Promise<any>} Function result
     */
    async executeWithRetry(fn, context = '', options = {}) {
        const maxRetries = options.maxRetries || this.maxRetries;
        const retryDelay = options.retryDelay || this.retryDelay;
        const retryKey = `${context}_${Date.now()}`;
        
        this.retryAttempts.set(retryKey, 0);
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`🔄 Attempt ${attempt}/${maxRetries} for: ${context}`);
                const result = await fn();
                console.log(`✅ Success on attempt ${attempt}: ${context}`);
                this.retryAttempts.delete(retryKey);
                return result;
            } catch (error) {
                const errorInfo = this.handleError(error, context, { attempt, maxRetries });
                
                if (attempt === maxRetries) {
                    console.error(`❌ Failed after ${maxRetries} attempts: ${context}`);
                    this.retryAttempts.delete(retryKey);
                    throw error;
                }
                
                if (!this._isRetryable(error)) {
                    console.log(`⚠️ Non-retryable error, stopping retries: ${context}`);
                    this.retryAttempts.delete(retryKey);
                    throw error;
                }
                
                console.log(`⏳ Retrying in ${retryDelay}ms...`);
                await this.wait(retryDelay);
            }
        }
    }

    /**
     * Handle element interaction errors
     * @param {Error} error - Error object
     * @param {string} selector - Element selector
     * @param {string} action - Action being performed
     * @param {Object} browser - Browser instance
     * @returns {Promise<boolean>} Success status
     */
    async handleElementError(error, selector, action, browser = null) {
        const context = `${action} on element: ${selector}`;
        const errorInfo = this.handleError(error, context, { selector, action });
        
        if (errorInfo.type === 'ElementNotFound') {
            console.log(`🔍 Element not found, checking if it exists: ${selector}`);
            try {
                if (browser) {
                    const exists = await browser.$(selector).isExisting();
                    console.log(`📊 Element exists: ${exists}`);
                }
            } catch (checkError) {
                console.log(`📊 Could not check element existence: ${checkError.message}`);
            }
        }
        
        return errorInfo.recoverable;
    }

    /**
     * Handle network/API errors
     * @param {Error} error - Error object
     * @param {string} url - URL being accessed
     * @param {string} method - HTTP method
     * @returns {Object} Error information
     */
    handleNetworkError(error, url, method = 'GET') {
        const context = `${method} request to: ${url}`;
        const errorInfo = this.handleError(error, context, { url, method });
        
        if (errorInfo.type === 'NetworkError') {
            console.log(`🌐 Network error detected, checking connectivity...`);
            // Add network connectivity check logic here
        }
        
        return errorInfo;
    }

    /**
     * Handle timeout errors
     * @param {Error} error - Error object
     * @param {string} context - Timeout context
     * @param {number} timeout - Timeout value
     * @returns {Object} Error information
     */
    handleTimeoutError(error, context, timeout) {
        const errorInfo = this.handleError(error, context, { timeout, type: 'TimeoutError' });
        
        console.log(`⏰ Timeout occurred after ${timeout}ms: ${context}`);
        
        return errorInfo;
    }

    /**
     * Handle assertion errors
     * @param {Error} error - Error object
     * @param {string} assertion - Assertion description
     * @param {any} actual - Actual value
     * @param {any} expected - Expected value
     * @returns {Object} Error information
     */
    handleAssertionError(error, assertion, actual, expected) {
        const context = `Assertion failed: ${assertion}`;
        const errorInfo = this.handleError(error, context, {
            type: 'AssertionError',
            actual,
            expected,
            assertion
        });
        
        console.log(`🔍 Assertion failed: ${assertion}`);
        console.log(`   Expected: ${expected}`);
        console.log(`   Actual: ${actual}`);
        
        return errorInfo;
    }

    /**
     * Handle browser errors
     * @param {Error} error - Error object
     * @param {string} action - Browser action
     * @param {Object} browser - Browser instance
     * @returns {Promise<Object>} Error information
     */
    async handleBrowserError(error, action, browser = null) {
        const context = `Browser action: ${action}`;
        const errorInfo = this.handleError(error, context, { action, type: 'BrowserError' });
        
        if (browser) {
            try {
                const url = await browser.getUrl();
                const title = await browser.getTitle();
                errorInfo.browserState = { url, title };
                console.log(`🌐 Browser state - URL: ${url}, Title: ${title}`);
            } catch (stateError) {
                console.log(`⚠️ Could not get browser state: ${stateError.message}`);
            }
        }
        
        return errorInfo;
    }

    /**
     * Create error report
     * @param {string} outputPath - Path to save the report
     * @returns {Promise<string>} Path to the generated report
     */
    async createErrorReport(outputPath = null) {
        try {
            const report = {
                generatedAt: new Date().toISOString(),
                summary: this._generateErrorSummary(),
                errors: this.errorLog,
                retryStats: this._getRetryStats(),
                recommendations: this._generateRecommendations()
            };

            const reportPath = outputPath || path.join(this.logsDir, `error-report-${Date.now()}.json`);
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
            
            console.log(`📊 Error report generated: ${reportPath}`);
            return reportPath;
        } catch (error) {
            console.error('❌ Error creating error report:', error.message);
            throw error;
        }
    }

    /**
     * Get error statistics
     * @returns {Object} Error statistics
     */
    getErrorStats() {
        const totalErrors = this.errorLog.length;
        const errorTypes = {};
        const severities = {};
        
        this.errorLog.forEach(error => {
            errorTypes[error.type] = (errorTypes[error.type] || 0) + 1;
            severities[error.severity] = (severities[error.severity] || 0) + 1;
        });
        
        return {
            totalErrors,
            errorTypes,
            severities,
            recoverableErrors: this.errorLog.filter(e => e.recoverable).length,
            nonRecoverableErrors: this.errorLog.filter(e => !e.recoverable).length
        };
    }

    /**
     * Clear error log
     */
    clearErrorLog() {
        this.errorLog = [];
        this.retryAttempts.clear();
        console.log('🧹 Error log cleared');
    }

    /**
     * Set retry configuration
     * @param {Object} config - Retry configuration
     */
    setRetryConfig(config) {
        if (config.maxRetries) this.maxRetries = config.maxRetries;
        if (config.retryDelay) this.retryDelay = config.retryDelay;
        
        console.log('⚙️ Retry configuration updated:', {
            maxRetries: this.maxRetries,
            retryDelay: this.retryDelay
        });
    }

    /**
     * Wait for specified time
     * @param {number} milliseconds - Time to wait
     */
    async wait(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    /**
     * Categorize error type
     * @param {Error} error - Error object
     * @returns {string} Error category
     */
    _categorizeError(error) {
        const message = error.message.toLowerCase();
        const stack = error.stack.toLowerCase();
        
        if (message.includes('element') || message.includes('selector')) {
            return 'ElementNotFound';
        }
        if (message.includes('timeout') || message.includes('timed out')) {
            return 'TimeoutError';
        }
        if (message.includes('network') || message.includes('connection')) {
            return 'NetworkError';
        }
        if (message.includes('assert') || message.includes('expected')) {
            return 'AssertionError';
        }
        if (message.includes('browser') || message.includes('webdriver')) {
            return 'BrowserError';
        }
        if (message.includes('javascript') || message.includes('script')) {
            return 'JavaScriptError';
        }
        
        return 'UnknownError';
    }

    /**
     * Determine error severity
     * @param {Error} error - Error object
     * @returns {string} Error severity
     */
    _determineSeverity(error) {
        const message = error.message.toLowerCase();
        
        if (message.includes('critical') || message.includes('fatal')) {
            return 'Critical';
        }
        if (message.includes('timeout') || message.includes('element not found')) {
            return 'High';
        }
        if (message.includes('network') || message.includes('connection')) {
            return 'Medium';
        }
        if (message.includes('assertion') || message.includes('expected')) {
            return 'Low';
        }
        
        return 'Medium';
    }

    /**
     * Check if error is recoverable
     * @param {Error} error - Error object
     * @returns {boolean} True if recoverable
     */
    _isRecoverable(error) {
        const message = error.message.toLowerCase();
        
        // Non-recoverable errors
        if (message.includes('fatal') || message.includes('critical')) {
            return false;
        }
        
        // Recoverable errors
        if (message.includes('timeout') || message.includes('element not found')) {
            return true;
        }
        
        return true; // Default to recoverable
    }

    /**
     * Check if error is retryable
     * @param {Error} error - Error object
     * @returns {boolean} True if retryable
     */
    _isRetryable(error) {
        const message = error.message.toLowerCase();
        
        // Non-retryable errors
        if (message.includes('fatal') || message.includes('critical') || message.includes('assertion')) {
            return false;
        }
        
        // Retryable errors
        if (message.includes('timeout') || message.includes('network') || message.includes('element not found')) {
            return true;
        }
        
        return true; // Default to retryable
    }

    /**
     * Log error to file
     * @param {Object} errorInfo - Error information
     */
    _logError(errorInfo) {
        try {
            const logEntry = {
                timestamp: errorInfo.timestamp,
                level: 'ERROR',
                context: errorInfo.context,
                message: errorInfo.message,
                type: errorInfo.type,
                severity: errorInfo.severity
            };
            
            const logPath = path.join(this.logsDir, 'error.log');
            const logLine = JSON.stringify(logEntry) + '\n';
            
            fs.appendFileSync(logPath, logLine);
        } catch (logError) {
            console.error('❌ Error writing to log file:', logError.message);
        }
    }

    /**
     * Generate error summary
     * @returns {Object} Error summary
     */
    _generateErrorSummary() {
        const stats = this.getErrorStats();
        const recentErrors = this.errorLog.slice(-10); // Last 10 errors
        
        return {
            totalErrors: stats.totalErrors,
            errorTypes: stats.errorTypes,
            severities: stats.severities,
            recentErrors: recentErrors.map(e => ({
                timestamp: e.timestamp,
                context: e.context,
                type: e.type,
                severity: e.severity
            }))
        };
    }

    /**
     * Get retry statistics
     * @returns {Object} Retry statistics
     */
    _getRetryStats() {
        return {
            totalRetryAttempts: this.retryAttempts.size,
            currentRetries: Array.from(this.retryAttempts.values())
        };
    }

    /**
     * Generate recommendations based on errors
     * @returns {Array} Array of recommendations
     */
    _generateRecommendations() {
        const recommendations = [];
        const stats = this.getErrorStats();
        
        if (stats.errorTypes['ElementNotFound'] > 0) {
            recommendations.push('Review element selectors and ensure they are up to date');
        }
        if (stats.errorTypes['TimeoutError'] > 0) {
            recommendations.push('Consider increasing timeout values for slow operations');
        }
        if (stats.errorTypes['NetworkError'] > 0) {
            recommendations.push('Check network connectivity and API endpoints');
        }
        if (stats.errorTypes['AssertionError'] > 0) {
            recommendations.push('Review test assertions and expected values');
        }
        
        return recommendations;
    }

    /**
     * Ensure directory exists
     * @param {string} dirPath - Directory path
     */
    _ensureDirectoryExists(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`📁 Created logs directory: ${dirPath}`);
        }
    }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

// Export both class and singleton instance
module.exports = {
    ErrorHandler,
    errorHandler
}; 