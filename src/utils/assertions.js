/**
 * Common Assertions Utility
 * 
 * Provides reusable assertion functions for chatbot testing,
 * including text matching, response validation, and custom assertions.
 */

class Assertions {
    constructor() {
        this.assertionCount = 0;
        this.failedAssertions = [];
    }

    /**
     * Assert that text contains expected substring
     * @param {string} actual - Actual text
     * @param {string} expected - Expected substring
     * @param {string} message - Optional assertion message
     */
    assertContains(actual, expected, message = '') {
        this.assertionCount++;
        const assertionMessage = message || `Expected text to contain "${expected}"`;
        
        if (!actual || !expected) {
            this._recordFailure(assertionMessage, actual, expected);
            throw new Error(assertionMessage);
        }

        const contains = actual.toLowerCase().includes(expected.toLowerCase());
        if (!contains) {
            this._recordFailure(assertionMessage, actual, expected);
            throw new Error(`${assertionMessage}. Actual: "${actual}"`);
        }

        console.log(`✅ Assertion passed: ${assertionMessage}`);
    }

    /**
     * Assert that text matches regex pattern
     * @param {string} actual - Actual text
     * @param {RegExp|string} pattern - Regex pattern or string
     * @param {string} message - Optional assertion message
     */
    assertMatches(actual, pattern, message = '') {
        this.assertionCount++;
        const regex = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
        const assertionMessage = message || `Expected text to match pattern "${pattern}"`;
        
        if (!actual) {
            this._recordFailure(assertionMessage, actual, pattern);
            throw new Error(assertionMessage);
        }

        const matches = regex.test(actual);
        if (!matches) {
            this._recordFailure(assertionMessage, actual, pattern);
            throw new Error(`${assertionMessage}. Actual: "${actual}"`);
        }

        console.log(`✅ Assertion passed: ${assertionMessage}`);
    }

    /**
     * Assert that text equals expected value
     * @param {string} actual - Actual text
     * @param {string} expected - Expected text
     * @param {string} message - Optional assertion message
     */
    assertEquals(actual, expected, message = '') {
        this.assertionCount++;
        const assertionMessage = message || `Expected text to equal "${expected}"`;
        
        if (actual !== expected) {
            this._recordFailure(assertionMessage, actual, expected);
            throw new Error(`${assertionMessage}. Actual: "${actual}"`);
        }

        console.log(`✅ Assertion passed: ${assertionMessage}`);
    }

    /**
     * Assert that text is not empty
     * @param {string} actual - Actual text
     * @param {string} message - Optional assertion message
     */
    assertNotEmpty(actual, message = '') {
        this.assertionCount++;
        const assertionMessage = message || 'Expected text to not be empty';
        
        if (!actual || actual.trim() === '') {
            this._recordFailure(assertionMessage, actual, 'non-empty string');
            throw new Error(assertionMessage);
        }

        console.log(`✅ Assertion passed: ${assertionMessage}`);
    }

    /**
     * Assert that text has minimum length
     * @param {string} actual - Actual text
     * @param {number} minLength - Minimum expected length
     * @param {string} message - Optional assertion message
     */
    assertMinLength(actual, minLength, message = '') {
        this.assertionCount++;
        const assertionMessage = message || `Expected text to have minimum length of ${minLength}`;
        
        if (!actual || actual.length < minLength) {
            this._recordFailure(assertionMessage, actual, `minimum length ${minLength}`);
            throw new Error(`${assertionMessage}. Actual length: ${actual ? actual.length : 0}`);
        }

        console.log(`✅ Assertion passed: ${assertionMessage}`);
    }

    /**
     * Assert that text has maximum length
     * @param {string} actual - Actual text
     * @param {number} maxLength - Maximum expected length
     * @param {string} message - Optional assertion message
     */
    assertMaxLength(actual, maxLength, message = '') {
        this.assertionCount++;
        const assertionMessage = message || `Expected text to have maximum length of ${maxLength}`;
        
        if (actual && actual.length > maxLength) {
            this._recordFailure(assertionMessage, actual, `maximum length ${maxLength}`);
            throw new Error(`${assertionMessage}. Actual length: ${actual.length}`);
        }

        console.log(`✅ Assertion passed: ${assertionMessage}`);
    }

    /**
     * Assert that response time is within acceptable range
     * @param {number} responseTime - Actual response time in milliseconds
     * @param {number} maxTime - Maximum acceptable time in milliseconds
     * @param {string} message - Optional assertion message
     */
    assertResponseTime(responseTime, maxTime, message = '') {
        this.assertionCount++;
        const assertionMessage = message || `Expected response time to be less than ${maxTime}ms`;
        
        if (responseTime > maxTime) {
            this._recordFailure(assertionMessage, responseTime, `less than ${maxTime}ms`);
            throw new Error(`${assertionMessage}. Actual: ${responseTime}ms`);
        }

        console.log(`✅ Assertion passed: ${assertionMessage} (${responseTime}ms)`);
    }

    /**
     * Assert that element count matches expected value
     * @param {number} actual - Actual element count
     * @param {number} expected - Expected element count
     * @param {string} message - Optional assertion message
     */
    assertElementCount(actual, expected, message = '') {
        this.assertionCount++;
        const assertionMessage = message || `Expected element count to be ${expected}`;
        
        if (actual !== expected) {
            this._recordFailure(assertionMessage, actual, expected);
            throw new Error(`${assertionMessage}. Actual: ${actual}`);
        }

        console.log(`✅ Assertion passed: ${assertionMessage}`);
    }

    /**
     * Assert that boolean condition is true
     * @param {boolean} condition - Condition to check
     * @param {string} message - Optional assertion message
     */
    assertTrue(condition, message = '') {
        this.assertionCount++;
        const assertionMessage = message || 'Expected condition to be true';
        
        if (!condition) {
            this._recordFailure(assertionMessage, condition, true);
            throw new Error(assertionMessage);
        }

        console.log(`✅ Assertion passed: ${assertionMessage}`);
    }

    /**
     * Assert that boolean condition is false
     * @param {boolean} condition - Condition to check
     * @param {string} message - Optional assertion message
     */
    assertFalse(condition, message = '') {
        this.assertionCount++;
        const assertionMessage = message || 'Expected condition to be false';
        
        if (condition) {
            this._recordFailure(assertionMessage, condition, false);
            throw new Error(assertionMessage);
        }

        console.log(`✅ Assertion passed: ${assertionMessage}`);
    }

    /**
     * Assert that value is not null or undefined
     * @param {any} value - Value to check
     * @param {string} message - Optional assertion message
     */
    assertNotNull(value, message = '') {
        this.assertionCount++;
        const assertionMessage = message || 'Expected value to not be null or undefined';
        
        if (value === null || value === undefined) {
            this._recordFailure(assertionMessage, value, 'non-null value');
            throw new Error(assertionMessage);
        }

        console.log(`✅ Assertion passed: ${assertionMessage}`);
    }

    /**
     * Assert that array contains expected item
     * @param {Array} array - Array to check
     * @param {any} item - Item to find
     * @param {string} message - Optional assertion message
     */
    assertArrayContains(array, item, message = '') {
        this.assertionCount++;
        const assertionMessage = message || `Expected array to contain "${item}"`;
        
        if (!Array.isArray(array) || !array.includes(item)) {
            this._recordFailure(assertionMessage, array, `array containing "${item}"`);
            throw new Error(`${assertionMessage}. Actual array: [${array}]`);
        }

        console.log(`✅ Assertion passed: ${assertionMessage}`);
    }

    /**
     * Assert that array has expected length
     * @param {Array} array - Array to check
     * @param {number} length - Expected length
     * @param {string} message - Optional assertion message
     */
    assertArrayLength(array, length, message = '') {
        this.assertionCount++;
        const assertionMessage = message || `Expected array to have length ${length}`;
        
        if (!Array.isArray(array) || array.length !== length) {
            this._recordFailure(assertionMessage, array, `array with length ${length}`);
            throw new Error(`${assertionMessage}. Actual length: ${array ? array.length : 'not an array'}`);
        }

        console.log(`✅ Assertion passed: ${assertionMessage}`);
    }

    /**
     * Assert that object has expected property
     * @param {Object} obj - Object to check
     * @param {string} property - Property name
     * @param {string} message - Optional assertion message
     */
    assertHasProperty(obj, property, message = '') {
        this.assertionCount++;
        const assertionMessage = message || `Expected object to have property "${property}"`;
        
        if (!obj || !(property in obj)) {
            this._recordFailure(assertionMessage, obj, `object with property "${property}"`);
            throw new Error(assertionMessage);
        }

        console.log(`✅ Assertion passed: ${assertionMessage}`);
    }

    /**
     * Assert that object property equals expected value
     * @param {Object} obj - Object to check
     * @param {string} property - Property name
     * @param {any} expected - Expected value
     * @param {string} message - Optional assertion message
     */
    assertPropertyEquals(obj, property, expected, message = '') {
        this.assertionCount++;
        const assertionMessage = message || `Expected property "${property}" to equal "${expected}"`;
        
        if (!obj || !(property in obj) || obj[property] !== expected) {
            this._recordFailure(assertionMessage, obj[property], expected);
            throw new Error(`${assertionMessage}. Actual: "${obj ? obj[property] : 'undefined'}"`);
        }

        console.log(`✅ Assertion passed: ${assertionMessage}`);
    }

    /**
     * Assert that bot response contains expected keywords
     * @param {string} response - Bot response text
     * @param {Array} keywords - Array of expected keywords
     * @param {string} message - Optional assertion message
     */
    assertResponseContainsKeywords(response, keywords, message = '') {
        this.assertionCount++;
        const assertionMessage = message || `Expected response to contain keywords: [${keywords.join(', ')}]`;
        
        if (!response || !Array.isArray(keywords)) {
            this._recordFailure(assertionMessage, response, `response containing keywords`);
            throw new Error(assertionMessage);
        }

        const missingKeywords = keywords.filter(keyword => 
            !response.toLowerCase().includes(keyword.toLowerCase())
        );

        if (missingKeywords.length > 0) {
            this._recordFailure(assertionMessage, response, `response containing all keywords`);
            throw new Error(`${assertionMessage}. Missing keywords: [${missingKeywords.join(', ')}]`);
        }

        console.log(`✅ Assertion passed: ${assertionMessage}`);
    }

    /**
     * Assert that bot response follows expected pattern
     * @param {string} response - Bot response text
     * @param {string} pattern - Expected response pattern
     * @param {string} message - Optional assertion message
     */
    assertResponsePattern(response, pattern, message = '') {
        this.assertionCount++;
        const assertionMessage = message || `Expected response to follow pattern: "${pattern}"`;
        
        // Convert pattern to regex (simple pattern matching)
        const regexPattern = pattern
            .replace(/\*/g, '.*')  // * matches any characters
            .replace(/\?/g, '.')   // ? matches single character
            .replace(/\[.*?\]/g, '.*'); // [text] matches any text
        
        const regex = new RegExp(regexPattern, 'i');
        
        if (!regex.test(response)) {
            this._recordFailure(assertionMessage, response, `response matching pattern "${pattern}"`);
            throw new Error(`${assertionMessage}. Actual: "${response}"`);
        }

        console.log(`✅ Assertion passed: ${assertionMessage}`);
    }

    /**
     * Assert that conversation has expected number of messages
     * @param {Array} conversation - Conversation messages array
     * @param {number} expectedCount - Expected message count
     * @param {string} message - Optional assertion message
     */
    assertConversationLength(conversation, expectedCount, message = '') {
        this.assertionCount++;
        const assertionMessage = message || `Expected conversation to have ${expectedCount} messages`;
        
        if (!Array.isArray(conversation) || conversation.length !== expectedCount) {
            this._recordFailure(assertionMessage, conversation.length, expectedCount);
            throw new Error(`${assertionMessage}. Actual: ${conversation ? conversation.length : 'not an array'}`);
        }

        console.log(`✅ Assertion passed: ${assertionMessage}`);
    }

    /**
     * Assert that conversation ends with expected message
     * @param {Array} conversation - Conversation messages array
     * @param {string} expectedEnding - Expected ending message
     * @param {string} message - Optional assertion message
     */
    assertConversationEndsWith(conversation, expectedEnding, message = '') {
        this.assertionCount++;
        const assertionMessage = message || `Expected conversation to end with "${expectedEnding}"`;
        
        if (!Array.isArray(conversation) || conversation.length === 0) {
            this._recordFailure(assertionMessage, conversation, `conversation ending with "${expectedEnding}"`);
            throw new Error(assertionMessage);
        }

        const lastMessage = conversation[conversation.length - 1];
        const lastText = lastMessage.messageText || lastMessage.text || '';

        if (!lastText.toLowerCase().includes(expectedEnding.toLowerCase())) {
            this._recordFailure(assertionMessage, lastText, `message ending with "${expectedEnding}"`);
            throw new Error(`${assertionMessage}. Actual ending: "${lastText}"`);
        }

        console.log(`✅ Assertion passed: ${assertionMessage}`);
    }

    /**
     * Custom assertion function
     * @param {Function} assertionFn - Custom assertion function
     * @param {string} message - Optional assertion message
     */
    assertCustom(assertionFn, message = '') {
        this.assertionCount++;
        const assertionMessage = message || 'Custom assertion';
        
        try {
            const result = assertionFn();
            if (!result) {
                this._recordFailure(assertionMessage, result, true);
                throw new Error(assertionMessage);
            }
            console.log(`✅ Assertion passed: ${assertionMessage}`);
        } catch (error) {
            this._recordFailure(assertionMessage, error.message, 'successful execution');
            throw new Error(`${assertionMessage}: ${error.message}`);
        }
    }

    /**
     * Get assertion statistics
     * @returns {Object} Assertion statistics
     */
    getStats() {
        return {
            total: this.assertionCount,
            failed: this.failedAssertions.length,
            passed: this.assertionCount - this.failedAssertions.length,
            failedAssertions: this.failedAssertions
        };
    }

    /**
     * Reset assertion statistics
     */
    resetStats() {
        this.assertionCount = 0;
        this.failedAssertions = [];
        console.log('🔄 Assertion statistics reset');
    }

    /**
     * Record failed assertion
     * @param {string} message - Assertion message
     * @param {any} actual - Actual value
     * @param {any} expected - Expected value
     */
    _recordFailure(message, actual, expected) {
        this.failedAssertions.push({
            message,
            actual,
            expected,
            timestamp: new Date().toISOString()
        });
    }
}

// Create singleton instance
const assertions = new Assertions();

// Export both class and singleton instance
module.exports = {
    Assertions,
    assertions
}; 