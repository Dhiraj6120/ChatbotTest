/**
 * Base Page Object Class
 * 
 * This class provides common WebDriver methods that can be extended
 * by other page objects. It includes basic element interactions,
 * wait strategies, and utility methods.
 */

class BasePage {
    constructor() {
        this.defaultTimeout = 10000;
        this.shortTimeout = 5000;
        this.longTimeout = 30000;
    }

    /**
     * Navigate to a specific URL
     * @param {string} url - The URL to navigate to
     */
    async navigateTo(url) {
        console.log(`🌐 Navigating to: ${url}`);
        await browser.url(url);
        await this.waitForPageLoad();
    }

    /**
     * Wait for page to fully load
     * @param {number} timeout - Timeout in milliseconds
     */
    async waitForPageLoad(timeout = this.longTimeout) {
        await browser.waitUntil(
            async () => await browser.execute(() => document.readyState === 'complete'),
            { 
                timeout, 
                timeoutMsg: 'Page did not load completely within the specified timeout' 
            }
        );
        console.log('✅ Page loaded successfully');
    }

    /**
     * Wait for element to be displayed
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds
     * @returns {WebdriverIO.Element} The element
     */
    async waitForElement(selector, timeout = this.defaultTimeout) {
        console.log(`⏳ Waiting for element: ${selector}`);
        await browser.waitForDisplayed(selector, { timeout });
        const element = await $(selector);
        console.log(`✅ Element found: ${selector}`);
        return element;
    }

    /**
     * Wait for element to be clickable
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds
     * @returns {WebdriverIO.Element} The element
     */
    async waitForElementClickable(selector, timeout = this.defaultTimeout) {
        console.log(`⏳ Waiting for element to be clickable: ${selector}`);
        await browser.waitForClickable(selector, { timeout });
        const element = await $(selector);
        console.log(`✅ Element is clickable: ${selector}`);
        return element;
    }

    /**
     * Wait for element to exist in DOM
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds
     * @returns {WebdriverIO.Element} The element
     */
    async waitForElementExist(selector, timeout = this.defaultTimeout) {
        console.log(`⏳ Waiting for element to exist: ${selector}`);
        await browser.waitForExist(selector, { timeout });
        const element = await $(selector);
        console.log(`✅ Element exists: ${selector}`);
        return element;
    }

    /**
     * Safe click on element with wait
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds
     */
    async safeClick(selector, timeout = this.defaultTimeout) {
        console.log(`🖱️ Clicking element: ${selector}`);
        const element = await this.waitForElementClickable(selector, timeout);
        await element.click();
        console.log(`✅ Clicked element: ${selector}`);
    }

    /**
     * Safe type text into element with clear
     * @param {string} selector - Element selector
     * @param {string} text - Text to type
     * @param {number} timeout - Timeout in milliseconds
     */
    async safeType(selector, text, timeout = this.defaultTimeout) {
        console.log(`⌨️ Typing text in element: ${selector}`);
        const element = await this.waitForElement(selector, timeout);
        await element.clearValue();
        await element.setValue(text);
        console.log(`✅ Typed text in element: ${selector}`);
    }

    /**
     * Get element text
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds
     * @returns {string} Element text
     */
    async getElementText(selector, timeout = this.defaultTimeout) {
        const element = await this.waitForElement(selector, timeout);
        const text = await element.getText();
        console.log(`📝 Element text: ${text}`);
        return text;
    }

    /**
     * Get element attribute value
     * @param {string} selector - Element selector
     * @param {string} attribute - Attribute name
     * @param {number} timeout - Timeout in milliseconds
     * @returns {string} Attribute value
     */
    async getElementAttribute(selector, attribute, timeout = this.defaultTimeout) {
        const element = await this.waitForElement(selector, timeout);
        const value = await element.getAttribute(attribute);
        console.log(`🔍 Element ${attribute}: ${value}`);
        return value;
    }

    /**
     * Check if element is displayed
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds
     * @returns {boolean} True if element is displayed
     */
    async isElementDisplayed(selector, timeout = this.shortTimeout) {
        try {
            await this.waitForElement(selector, timeout);
            return true;
        } catch (error) {
            console.log(`❌ Element not displayed: ${selector}`);
            return false;
        }
    }

    /**
     * Check if element exists in DOM
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds
     * @returns {boolean} True if element exists
     */
    async isElementExist(selector, timeout = this.shortTimeout) {
        try {
            await this.waitForElementExist(selector, timeout);
            return true;
        } catch (error) {
            console.log(`❌ Element does not exist: ${selector}`);
            return false;
        }
    }

    /**
     * Wait for element to disappear
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds
     */
    async waitForElementDisappear(selector, timeout = this.defaultTimeout) {
        console.log(`⏳ Waiting for element to disappear: ${selector}`);
        await browser.waitUntil(
            async () => !(await $(selector).isDisplayed()),
            { 
                timeout, 
                timeoutMsg: `Element ${selector} did not disappear within ${timeout}ms` 
            }
        );
        console.log(`✅ Element disappeared: ${selector}`);
    }

    /**
     * Scroll element into view
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds
     */
    async scrollToElement(selector, timeout = this.defaultTimeout) {
        console.log(`📜 Scrolling to element: ${selector}`);
        const element = await this.waitForElement(selector, timeout);
        await element.scrollIntoView();
        console.log(`✅ Scrolled to element: ${selector}`);
    }

    /**
     * Take screenshot with custom name
     * @param {string} name - Screenshot name
     * @returns {string} Screenshot file path
     */
    async takeScreenshot(name) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const screenshotPath = `./screenshots/${name}_${timestamp}.png`;
        await browser.saveScreenshot(screenshotPath);
        console.log(`📸 Screenshot saved: ${screenshotPath}`);
        return screenshotPath;
    }

    /**
     * Wait for a specific condition
     * @param {Function} condition - Condition function that returns boolean
     * @param {number} timeout - Timeout in milliseconds
     * @param {string} message - Timeout message
     */
    async waitForCondition(condition, timeout = this.defaultTimeout, message = 'Condition not met') {
        console.log(`⏳ Waiting for condition: ${message}`);
        await browser.waitUntil(condition, { timeout, timeoutMsg: message });
        console.log(`✅ Condition met: ${message}`);
    }

    /**
     * Execute JavaScript in browser
     * @param {string} script - JavaScript code to execute
     * @param {...any} args - Arguments to pass to the script
     * @returns {any} Result of script execution
     */
    async executeScript(script, ...args) {
        console.log(`🔧 Executing script: ${script.substring(0, 50)}...`);
        const result = await browser.execute(script, ...args);
        console.log(`✅ Script executed successfully`);
        return result;
    }

    /**
     * Get browser console logs
     * @returns {Array} Array of console log entries
     */
    async getConsoleLogs() {
        try {
            const logs = await browser.getLogs('browser');
            console.log(`📝 Retrieved ${logs.length} console logs`);
            return logs;
        } catch (error) {
            console.log(`⚠️ Could not retrieve console logs: ${error.message}`);
            return [];
        }
    }

    /**
     * Clear browser storage
     */
    async clearStorage() {
        console.log('🧹 Clearing browser storage');
        await this.executeScript('window.localStorage.clear();');
        await this.executeScript('window.sessionStorage.clear();');
        await browser.deleteAllCookies();
        console.log('✅ Browser storage cleared');
    }

    /**
     * Refresh the current page
     */
    async refreshPage() {
        console.log('🔄 Refreshing page');
        await browser.refresh();
        await this.waitForPageLoad();
        console.log('✅ Page refreshed');
    }

    /**
     * Go back to previous page
     */
    async goBack() {
        console.log('⬅️ Going back to previous page');
        await browser.back();
        await this.waitForPageLoad();
        console.log('✅ Navigated back');
    }

    /**
     * Go forward to next page
     */
    async goForward() {
        console.log('➡️ Going forward to next page');
        await browser.forward();
        await this.waitForPageLoad();
        console.log('✅ Navigated forward');
    }

    /**
     * Get current page URL
     * @returns {string} Current URL
     */
    async getCurrentUrl() {
        const url = await browser.getUrl();
        console.log(`🌐 Current URL: ${url}`);
        return url;
    }

    /**
     * Get page title
     * @returns {string} Page title
     */
    async getPageTitle() {
        const title = await browser.getTitle();
        console.log(`📄 Page title: ${title}`);
        return title;
    }

    /**
     * Wait for URL to change
     * @param {string} expectedUrl - Expected URL (partial match)
     * @param {number} timeout - Timeout in milliseconds
     */
    async waitForUrlChange(expectedUrl, timeout = this.defaultTimeout) {
        console.log(`⏳ Waiting for URL to change to: ${expectedUrl}`);
        await browser.waitUntil(
            async () => (await this.getCurrentUrl()).includes(expectedUrl),
            { 
                timeout, 
                timeoutMsg: `URL did not change to ${expectedUrl} within ${timeout}ms` 
            }
        );
        console.log(`✅ URL changed to: ${expectedUrl}`);
    }

    /**
     * Wait for page title to change
     * @param {string} expectedTitle - Expected title (partial match)
     * @param {number} timeout - Timeout in milliseconds
     */
    async waitForTitleChange(expectedTitle, timeout = this.defaultTimeout) {
        console.log(`⏳ Waiting for title to change to: ${expectedTitle}`);
        await browser.waitUntil(
            async () => (await this.getPageTitle()).includes(expectedTitle),
            { 
                timeout, 
                timeoutMsg: `Title did not change to ${expectedTitle} within ${timeout}ms` 
            }
        );
        console.log(`✅ Title changed to: ${expectedTitle}`);
    }

    /**
     * Get all elements matching selector
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds
     * @returns {Array} Array of elements
     */
    async getAllElements(selector, timeout = this.defaultTimeout) {
        console.log(`🔍 Getting all elements: ${selector}`);
        await this.waitForElementExist(selector, timeout);
        const elements = await $$(selector);
        console.log(`✅ Found ${elements.length} elements: ${selector}`);
        return elements;
    }

    /**
     * Get element count
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds
     * @returns {number} Number of elements
     */
    async getElementCount(selector, timeout = this.shortTimeout) {
        try {
            const elements = await this.getAllElements(selector, timeout);
            return elements.length;
        } catch (error) {
            console.log(`❌ Could not get element count for: ${selector}`);
            return 0;
        }
    }

    /**
     * Wait for element count to be specific number
     * @param {string} selector - Element selector
     * @param {number} count - Expected element count
     * @param {number} timeout - Timeout in milliseconds
     */
    async waitForElementCount(selector, count, timeout = this.defaultTimeout) {
        console.log(`⏳ Waiting for ${count} elements: ${selector}`);
        await browser.waitUntil(
            async () => (await this.getElementCount(selector)) === count,
            { 
                timeout, 
                timeoutMsg: `Element count for ${selector} did not become ${count} within ${timeout}ms` 
            }
        );
        console.log(`✅ Found ${count} elements: ${selector}`);
    }
}

module.exports = BasePage; 