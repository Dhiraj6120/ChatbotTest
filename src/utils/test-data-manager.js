/**
 * Test Data Manager Utility
 * 
 * Provides utilities for loading, validating, and managing test data
 * across different test files. Supports JSON, CSV, and dynamic data generation.
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

class TestDataManager {
    constructor() {
        this.testDataDir = path.join(__dirname, '../../test-data');
        this.cache = new Map();
        this.dataValidators = new Map();
    }

    /**
     * Load JSON test data from file
     * @param {string} filename - Name of the JSON file
     * @param {string} key - Optional key to extract specific data
     * @returns {Object|Array} Loaded test data
     */
    loadJsonData(filename, key = null) {
        const cacheKey = `json_${filename}_${key || 'all'}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const filePath = path.join(this.testDataDir, filename);
            if (!fs.existsSync(filePath)) {
                throw new Error(`Test data file not found: ${filePath}`);
            }

            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const result = key ? data[key] : data;
            
            this.cache.set(cacheKey, result);
            console.log(`📁 Loaded JSON data from ${filename}${key ? ` (key: ${key})` : ''}`);
            
            return result;
        } catch (error) {
            console.error(`❌ Error loading JSON data from ${filename}:`, error.message);
            throw error;
        }
    }

    /**
     * Load CSV test data from file
     * @param {string} filename - Name of the CSV file
     * @returns {Promise<Array>} Array of objects representing CSV rows
     */
    async loadCsvData(filename) {
        const cacheKey = `csv_${filename}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        return new Promise((resolve, reject) => {
            const filePath = path.join(this.testDataDir, filename);
            if (!fs.existsSync(filePath)) {
                reject(new Error(`Test data file not found: ${filePath}`));
                return;
            }

            const results = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    this.cache.set(cacheKey, results);
                    console.log(`📁 Loaded CSV data from ${filename}: ${results.length} rows`);
                    resolve(results);
                })
                .on('error', (error) => {
                    console.error(`❌ Error loading CSV data from ${filename}:`, error.message);
                    reject(error);
                });
        });
    }

    /**
     * Load Botium conversations from file
     * @param {string} filename - Name of the conversations file
     * @returns {Array} Array of conversation objects
     */
    loadConversations(filename) {
        try {
            const data = this.loadJsonData(filename);
            const conversations = data.convos || data;
            
            if (!Array.isArray(conversations)) {
                throw new Error('Invalid conversations format: expected array');
            }

            console.log(`💬 Loaded ${conversations.length} conversations from ${filename}`);
            return conversations;
        } catch (error) {
            console.error(`❌ Error loading conversations from ${filename}:`, error.message);
            throw error;
        }
    }

    /**
     * Get conversation by name
     * @param {string} filename - Name of the conversations file
     * @param {string} conversationName - Name of the conversation to find
     * @returns {Object|null} Conversation object or null if not found
     */
    getConversationByName(filename, conversationName) {
        try {
            const conversations = this.loadConversations(filename);
            const conversation = conversations.find(conv => conv.name === conversationName);
            
            if (!conversation) {
                console.warn(`⚠️ Conversation not found: ${conversationName}`);
                return null;
            }

            console.log(`🎯 Found conversation: ${conversationName}`);
            return conversation;
        } catch (error) {
            console.error(`❌ Error getting conversation ${conversationName}:`, error.message);
            throw error;
        }
    }

    /**
     * Generate dynamic test data
     * @param {Object} template - Template object with placeholders
     * @param {Object} variables - Variables to replace placeholders
     * @returns {Object} Generated test data
     */
    generateTestData(template, variables = {}) {
        try {
            const jsonString = JSON.stringify(template);
            let result = jsonString;

            // Replace placeholders with variables
            Object.entries(variables).forEach(([key, value]) => {
                const placeholder = `{{${key}}}`;
                result = result.replace(new RegExp(placeholder, 'g'), value);
            });

            const generatedData = JSON.parse(result);
            console.log(`🔧 Generated test data with ${Object.keys(variables).length} variables`);
            return generatedData;
        } catch (error) {
            console.error('❌ Error generating test data:', error.message);
            throw error;
        }
    }

    /**
     * Create test data template
     * @param {string} name - Template name
     * @param {Object} template - Template object
     */
    createTemplate(name, template) {
        this.dataValidators.set(name, template);
        console.log(`📝 Created template: ${name}`);
    }

    /**
     * Validate test data against template
     * @param {Object} data - Data to validate
     * @param {string} templateName - Name of the template to validate against
     * @returns {boolean} True if valid, false otherwise
     */
    validateTestData(data, templateName) {
        const template = this.dataValidators.get(templateName);
        if (!template) {
            console.warn(`⚠️ Template not found: ${templateName}`);
            return false;
        }

        try {
            const isValid = this._validateObject(data, template);
            console.log(`✅ Data validation ${isValid ? 'passed' : 'failed'} for template: ${templateName}`);
            return isValid;
        } catch (error) {
            console.error(`❌ Error validating data against template ${templateName}:`, error.message);
            return false;
        }
    }

    /**
     * Save test data to file
     * @param {string} filename - Name of the file to save
     * @param {Object|Array} data - Data to save
     * @param {string} format - File format ('json' or 'csv')
     */
    saveTestData(filename, data, format = 'json') {
        try {
            const filePath = path.join(this.testDataDir, filename);
            
            if (format === 'json') {
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            } else if (format === 'csv') {
                // Convert array of objects to CSV
                if (Array.isArray(data) && data.length > 0) {
                    const headers = Object.keys(data[0]);
                    const csvContent = [
                        headers.join(','),
                        ...data.map(row => headers.map(header => row[header]).join(','))
                    ].join('\n');
                    fs.writeFileSync(filePath, csvContent);
                }
            }

            console.log(`💾 Saved test data to ${filename} (${format})`);
        } catch (error) {
            console.error(`❌ Error saving test data to ${filename}:`, error.message);
            throw error;
        }
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        console.log('🧹 Test data cache cleared');
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
            templates: Array.from(this.dataValidators.keys())
        };
    }

    /**
     * Load environment-specific test data
     * @param {string} baseFilename - Base filename without extension
     * @param {string} environment - Environment name (dev, test, prod)
     * @returns {Object} Environment-specific test data
     */
    loadEnvironmentData(baseFilename, environment = 'test') {
        const envFilename = `${baseFilename}.${environment}.json`;
        const fallbackFilename = `${baseFilename}.json`;
        
        try {
            return this.loadJsonData(envFilename);
        } catch (error) {
            console.log(`📁 Environment-specific file not found, using fallback: ${fallbackFilename}`);
            return this.loadJsonData(fallbackFilename);
        }
    }

    /**
     * Merge multiple test data sources
     * @param {Array} sources - Array of data sources to merge
     * @returns {Object} Merged test data
     */
    mergeTestData(sources) {
        try {
            const merged = {};
            
            sources.forEach(source => {
                if (typeof source === 'string') {
                    // Load from file
                    const data = this.loadJsonData(source);
                    Object.assign(merged, data);
                } else if (typeof source === 'object') {
                    // Direct object
                    Object.assign(merged, source);
                }
            });

            console.log(`🔗 Merged ${sources.length} test data sources`);
            return merged;
        } catch (error) {
            console.error('❌ Error merging test data:', error.message);
            throw error;
        }
    }

    /**
     * Private method to validate object structure
     * @param {Object} data - Data to validate
     * @param {Object} template - Template to validate against
     * @returns {boolean} True if valid
     */
    _validateObject(data, template) {
        for (const [key, expectedType] of Object.entries(template)) {
            if (!(key in data)) {
                console.warn(`⚠️ Missing required field: ${key}`);
                return false;
            }

            const actualType = typeof data[key];
            if (actualType !== expectedType) {
                console.warn(`⚠️ Type mismatch for ${key}: expected ${expectedType}, got ${actualType}`);
                return false;
            }
        }
        return true;
    }
}

// Create singleton instance
const testDataManager = new TestDataManager();

// Export both class and singleton instance
module.exports = {
    TestDataManager,
    testDataManager
}; 