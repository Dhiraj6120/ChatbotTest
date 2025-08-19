/**
 * Wait Utilities
 * 
 * Provides common wait functions for element interactions, conditions,
 * and timeouts across different test files.
 */

class WaitUtils {
    constructor() {
        this.defaultTimeout = 10000;
        this.shortTimeout = 5000;
        this.longTimeout = 30000;
        this.retryInterval = 500;
    }

    /**
     * Wait for element to be displayed
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds
     * @param {Object} browser - WebdriverIO browser instance
     * @returns {Promise<WebdriverIO.Element>} The element
     */
    async waitForElement(selector, timeout = this.defaultTimeout, browser = null) {
        const browserInstance = browser || global.browser;
        console.log(`⏳ Waiting for element: ${selector}`);
        
        try {
            await browserInstance.waitForDisplayed(selector, { timeout });
            const element = await browserInstance.$(selector);
            console.log(`✅ Element found: ${selector}`);
            return element;
        } catch (error) {
            console.error(`❌ Element not found: ${selector}`);
            throw error;
        }
    }

    /**
     * Wait for element to be clickable
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds
     * @param {Object} browser - WebdriverIO browser instance
     * @returns {Promise<WebdriverIO.Element>} The element
     */
    async waitForElementClickable(selector, timeout = this.defaultTimeout, browser = null) {
        const browserInstance = browser || global.browser;
        console.log(`⏳ Waiting for element to be clickable: ${selector}`);
        
        try {
            await browserInstance.waitForClickable(selector, { timeout });
            const element = await browserInstance.$(selector);
            console.log(`✅ Element is clickable: ${selector}`);
            return element;
        } catch (error) {
            console.error(`❌ Element not clickable: ${selector}`);
            throw error;
        }
    }

    /**
     * Wait for element to exist in DOM
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds
     * @param {Object} browser - WebdriverIO browser instance
     * @returns {Promise<WebdriverIO.Element>} The element
     */
    async waitForElementExist(selector, timeout = this.defaultTimeout, browser = null) {
        const browserInstance = browser || global.browser;
        console.log(`⏳ Waiting for element to exist: ${selector}`);
        
        try {
            await browserInstance.waitForExist(selector, { timeout });
            const element = await browserInstance.$(selector);
            console.log(`✅ Element exists: ${selector}`);
            return element;
        } catch (error) {
            console.error(`❌ Element does not exist: ${selector}`);
            throw error;
        }
    }

    /**
     * Wait for element to disappear
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds
     * @param {Object} browser - WebdriverIO browser instance
     */
    async waitForElementDisappear(selector, timeout = this.defaultTimeout, browser = null) {
        const browserInstance = browser || global.browser;
        console.log(`⏳ Waiting for element to disappear: ${selector}`);
        
        try {
            await browserInstance.waitUntil(
                async () => !(await browserInstance.$(selector).isDisplayed()),
                { 
                    timeout, 
                    timeoutMsg: `Element ${selector} did not disappear within ${timeout}ms` 
                }
            );
            console.log(`✅ Element disappeared: ${selector}`);
        } catch (error) {
            console.error(`❌ Element did not disappear: ${selector}`);
            throw error;
        }
    }

    /**
     * Wait for page to load completely
     * @param {number} timeout - Timeout in milliseconds
     * @param {Object} browser - WebdriverIO browser instance
     */
    async waitForPageLoad(timeout = this.longTimeout, browser = null) {
        const browserInstance = browser || global.browser;
        console.log('⏳ Waiting for page to load completely');
        
        try {
            await browserInstance.waitUntil(
                async () => await browserInstance.execute(() => document.readyState === 'complete'),
                { 
                    timeout, 
                    timeoutMsg: 'Page did not load completely within the specified timeout' 
                }
            );
            console.log('✅ Page loaded completely');
        } catch (error) {
            console.error('❌ Page did not load completely');
            throw error;
        }
    }

    /**
     * Wait for URL to change
     * @param {string} expectedUrl - Expected URL (partial match)
     * @param {number} timeout - Timeout in milliseconds
     * @param {Object} browser - WebdriverIO browser instance
     */
    async waitForUrlChange(expectedUrl, timeout = this.defaultTimeout, browser = null) {
        const browserInstance = browser || global.browser;
        console.log(`⏳ Waiting for URL to change to: ${expectedUrl}`);
        
        try {
            await browserInstance.waitUntil(
                async () => (await browserInstance.getUrl()).includes(expectedUrl),
                { 
                    timeout, 
                    timeoutMsg: `URL did not change to ${expectedUrl} within ${timeout}ms` 
                }
            );
            console.log(`✅ URL changed to: ${expectedUrl}`);
        } catch (error) {
            console.error(`❌ URL did not change to: ${expectedUrl}`);
            throw error;
        }
    }

    /**
     * Wait for page title to change
     * @param {string} expectedTitle - Expected title (partial match)
     * @param {number} timeout - Timeout in milliseconds
     * @param {Object} browser - WebdriverIO browser instance
     */
    async waitForTitleChange(expectedTitle, timeout = this.defaultTimeout, browser = null) {
        const browserInstance = browser || global.browser;
        console.log(`⏳ Waiting for title to change to: ${expectedTitle}`);
        
        try {
            await browserInstance.waitUntil(
                async () => (await browserInstance.getTitle()).includes(expectedTitle),
                { 
                    timeout, 
                    timeoutMsg: `Title did not change to ${expectedTitle} within ${timeout}ms` 
                }
            );
            console.log(`✅ Title changed to: ${expectedTitle}`);
        } catch (error) {
            console.error(`❌ Title did not change to: ${expectedTitle}`);
            throw error;
        }
    }

    /**
     * Wait for element count to be specific number
     * @param {string} selector - Element selector
     * @param {number} count - Expected element count
     * @param {number} timeout - Timeout in milliseconds
     * @param {Object} browser - WebdriverIO browser instance
     */
    async waitForElementCount(selector, count, timeout = this.defaultTimeout, browser = null) {
        const browserInstance = browser || global.browser;
        console.log(`⏳ Waiting for ${count} elements: ${selector}`);
        
        try {
            await browserInstance.waitUntil(
                async () => (await browserInstance.$$(selector)).length === count,
                { 
                    timeout, 
                    timeoutMsg: `Element count for ${selector} did not become ${count} within ${timeout}ms` 
                }
            );
            console.log(`✅ Found ${count} elements: ${selector}`);
        } catch (error) {
            console.error(`❌ Element count did not match: ${selector}`);
            throw error;
        }
    }

    /**
     * Wait for element text to contain expected text
     * @param {string} selector - Element selector
     * @param {string} expectedText - Expected text
     * @param {number} timeout - Timeout in milliseconds
     * @param {Object} browser - WebdriverIO browser instance
     */
    async waitForElementText(selector, expectedText, timeout = this.defaultTimeout, browser = null) {
        const browserInstance = browser || global.browser;
        console.log(`⏳ Waiting for element text to contain: ${expectedText}`);
        
        try {
            await browserInstance.waitUntil(
                async () => {
                    const element = await browserInstance.$(selector);
                    const text = await element.getText();
                    return text.toLowerCase().includes(expectedText.toLowerCase());
                },
                { 
                    timeout, 
                    timeoutMsg: `Element text did not contain "${expectedText}" within ${timeout}ms` 
                }
            );
            console.log(`✅ Element text contains: ${expectedText}`);
        } catch (error) {
            console.error(`❌ Element text did not contain: ${expectedText}`);
            throw error;
        }
    }

    /**
     * Wait for element attribute to have expected value
     * @param {string} selector - Element selector
     * @param {string} attribute - Attribute name
     * @param {string} expectedValue - Expected attribute value
     * @param {number} timeout - Timeout in milliseconds
     * @param {Object} browser - WebdriverIO browser instance
     */
    async waitForElementAttribute(selector, attribute, expectedValue, timeout = this.defaultTimeout, browser = null) {
        const browserInstance = browser || global.browser;
        console.log(`⏳ Waiting for element attribute ${attribute} to be: ${expectedValue}`);
        
        try {
            await browserInstance.waitUntil(
                async () => {
                    const element = await browserInstance.$(selector);
                    const value = await element.getAttribute(attribute);
                    return value === expectedValue;
                },
                { 
                    timeout, 
                    timeoutMsg: `Element attribute ${attribute} did not become "${expectedValue}" within ${timeout}ms` 
                }
            );
            console.log(`✅ Element attribute ${attribute} is: ${expectedValue}`);
        } catch (error) {
            console.error(`❌ Element attribute ${attribute} did not become: ${expectedValue}`);
            throw error;
        }
    }

    /**
     * Wait for custom condition
     * @param {Function} condition - Condition function that returns boolean
     * @param {number} timeout - Timeout in milliseconds
     * @param {string} message - Timeout message
     * @param {Object} browser - WebdriverIO browser instance
     */
    async waitForCondition(condition, timeout = this.defaultTimeout, message = 'Condition not met', browser = null) {
        const browserInstance = browser || global.browser;
        console.log(`⏳ Waiting for condition: ${message}`);
        
        try {
            await browserInstance.waitUntil(condition, { timeout, timeoutMsg: message });
            console.log(`✅ Condition met: ${message}`);
        } catch (error) {
            console.error(`❌ Condition not met: ${message}`);
            throw error;
        }
    }

    /**
     * Wait for network idle (no pending requests)
     * @param {number} timeout - Timeout in milliseconds
     * @param {Object} browser - WebdriverIO browser instance
     */
    async waitForNetworkIdle(timeout = this.defaultTimeout, browser = null) {
        const browserInstance = browser || global.browser;
        console.log('⏳ Waiting for network to be idle');
        
        try {
            await browserInstance.waitUntil(
                async () => {
                    const performanceEntries = await browserInstance.execute(() => 
                        performance.getEntriesByType('resource')
                    );
                    return performanceEntries.length > 0;
                },
                { 
                    timeout, 
                    timeoutMsg: 'Network did not become idle within the specified timeout' 
                }
            );
            console.log('✅ Network is idle');
        } catch (error) {
            console.error('❌ Network did not become idle');
            throw error;
        }
    }

    /**
     * Wait for JavaScript execution to complete
     * @param {string} script - JavaScript code to execute
     * @param {number} timeout - Timeout in milliseconds
     * @param {Object} browser - WebdriverIO browser instance
     * @returns {Promise<any>} Result of script execution
     */
    async waitForScriptExecution(script, timeout = this.defaultTimeout, browser = null) {
        const browserInstance = browser || global.browser;
        console.log(`⏳ Waiting for script execution: ${script.substring(0, 50)}...`);
        
        try {
            const result = await browserInstance.execute(script);
            console.log('✅ Script executed successfully');
            return result;
        } catch (error) {
            console.error('❌ Script execution failed');
            throw error;
        }
    }

    /**
     * Wait for element to be enabled
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds
     * @param {Object} browser - WebdriverIO browser instance
     * @returns {Promise<WebdriverIO.Element>} The element
     */
    async waitForElementEnabled(selector, timeout = this.defaultTimeout, browser = null) {
        const browserInstance = browser || global.browser;
        console.log(`⏳ Waiting for element to be enabled: ${selector}`);
        
        try {
            await browserInstance.waitUntil(
                async () => {
                    const element = await browserInstance.$(selector);
                    return await element.isEnabled();
                },
                { 
                    timeout, 
                    timeoutMsg: `Element ${selector} did not become enabled within ${timeout}ms` 
                }
            );
            const element = await browserInstance.$(selector);
            console.log(`✅ Element is enabled: ${selector}`);
            return element;
        } catch (error) {
            console.error(`❌ Element did not become enabled: ${selector}`);
            throw error;
        }
    }

    /**
     * Wait for element to be disabled
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds
     * @param {Object} browser - WebdriverIO browser instance
     */
    async waitForElementDisabled(selector, timeout = this.defaultTimeout, browser = null) {
        const browserInstance = browser || global.browser;
        console.log(`⏳ Waiting for element to be disabled: ${selector}`);
        
        try {
            await browserInstance.waitUntil(
                async () => {
                    const element = await browserInstance.$(selector);
                    return !(await element.isEnabled());
                },
                { 
                    timeout, 
                    timeoutMsg: `Element ${selector} did not become disabled within ${timeout}ms` 
                }
            );
            console.log(`✅ Element is disabled: ${selector}`);
        } catch (error) {
            console.error(`❌ Element did not become disabled: ${selector}`);
            throw error;
        }
    }

    /**
     * Wait for element to have specific CSS class
     * @param {string} selector - Element selector
     * @param {string} className - Expected CSS class
     * @param {number} timeout - Timeout in milliseconds
     * @param {Object} browser - WebdriverIO browser instance
     */
    async waitForElementClass(selector, className, timeout = this.defaultTimeout, browser = null) {
        const browserInstance = browser || global.browser;
        console.log(`⏳ Waiting for element to have class: ${className}`);
        
        try {
            await browserInstance.waitUntil(
                async () => {
                    const element = await browserInstance.$(selector);
                    const classes = await element.getAttribute('class');
                    return classes && classes.includes(className);
                },
                { 
                    timeout, 
                    timeoutMsg: `Element ${selector} did not get class "${className}" within ${timeout}ms` 
                }
            );
            console.log(`✅ Element has class: ${className}`);
        } catch (error) {
            console.error(`❌ Element did not get class: ${className}`);
            throw error;
        }
    }

    /**
     * Wait for element to not have specific CSS class
     * @param {string} selector - Element selector
     * @param {string} className - CSS class to wait for removal
     * @param {number} timeout - Timeout in milliseconds
     * @param {Object} browser - WebdriverIO browser instance
     */
    async waitForElementClassRemoved(selector, className, timeout = this.defaultTimeout, browser = null) {
        const browserInstance = browser || global.browser;
        console.log(`⏳ Waiting for element to not have class: ${className}`);
        
        try {
            await browserInstance.waitUntil(
                async () => {
                    const element = await browserInstance.$(selector);
                    const classes = await element.getAttribute('class');
                    return !classes || !classes.includes(className);
                },
                { 
                    timeout, 
                    timeoutMsg: `Element ${selector} still has class "${className}" after ${timeout}ms` 
                }
            );
            console.log(`✅ Element no longer has class: ${className}`);
        } catch (error) {
            console.error(`❌ Element still has class: ${className}`);
            throw error;
        }
    }

    /**
     * Wait for element to be visible in viewport
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds
     * @param {Object} browser - WebdriverIO browser instance
     * @returns {Promise<WebdriverIO.Element>} The element
     */
    async waitForElementInViewport(selector, timeout = this.defaultTimeout, browser = null) {
        const browserInstance = browser || global.browser;
        console.log(`⏳ Waiting for element to be in viewport: ${selector}`);
        
        try {
            await browserInstance.waitUntil(
                async () => {
                    const element = await browserInstance.$(selector);
                    return await element.isDisplayedInViewport();
                },
                { 
                    timeout, 
                    timeoutMsg: `Element ${selector} did not become visible in viewport within ${timeout}ms` 
                }
            );
            const element = await browserInstance.$(selector);
            console.log(`✅ Element is in viewport: ${selector}`);
            return element;
        } catch (error) {
            console.error(`❌ Element did not become visible in viewport: ${selector}`);
            throw error;
        }
    }

    /**
     * Wait for specific amount of time
     * @param {number} milliseconds - Time to wait in milliseconds
     */
    async wait(milliseconds) {
        console.log(`⏳ Waiting for ${milliseconds}ms`);
        await new Promise(resolve => setTimeout(resolve, milliseconds));
        console.log(`✅ Waited for ${milliseconds}ms`);
    }

    /**
     * Wait for animation to complete
     * @param {string} selector - Element selector with animation
     * @param {number} timeout - Timeout in milliseconds
     * @param {Object} browser - WebdriverIO browser instance
     */
    async waitForAnimationComplete(selector, timeout = this.defaultTimeout, browser = null) {
        const browserInstance = browser || global.browser;
        console.log(`⏳ Waiting for animation to complete: ${selector}`);
        
        try {
            await browserInstance.waitUntil(
                async () => {
                    const element = await browserInstance.$(selector);
                    const isAnimating = await browserInstance.execute((el) => {
                        const style = window.getComputedStyle(el);
                        return style.animation !== 'none' || style.transition !== 'all 0s ease 0s';
                    }, element);
                    return !isAnimating;
                },
                { 
                    timeout, 
                    timeoutMsg: `Animation did not complete for ${selector} within ${timeout}ms` 
                }
            );
            console.log(`✅ Animation completed: ${selector}`);
        } catch (error) {
            console.error(`❌ Animation did not complete: ${selector}`);
            throw error;
        }
    }

    /**
     * Set custom timeout values
     * @param {Object} timeouts - Timeout configuration
     */
    setTimeouts(timeouts) {
        if (timeouts.default) this.defaultTimeout = timeouts.default;
        if (timeouts.short) this.shortTimeout = timeouts.short;
        if (timeouts.long) this.longTimeout = timeouts.long;
        if (timeouts.retryInterval) this.retryInterval = timeouts.retryInterval;
        
        console.log('⏱️ Timeouts updated:', {
            default: this.defaultTimeout,
            short: this.shortTimeout,
            long: this.longTimeout,
            retryInterval: this.retryInterval
        });
    }

    /**
     * Get current timeout configuration
     * @returns {Object} Current timeout configuration
     */
    getTimeouts() {
        return {
            default: this.defaultTimeout,
            short: this.shortTimeout,
            long: this.longTimeout,
            retryInterval: this.retryInterval
        };
    }
}

// Create singleton instance
const waitUtils = new WaitUtils();

// Export both class and singleton instance
module.exports = {
    WaitUtils,
    waitUtils
}; 