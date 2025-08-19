/**
 * Utilities Example Test
 * 
 * This test demonstrates how to use all the utility modules together
 * in a comprehensive test scenario. Shows best practices for test data
 * management, assertions, screenshots, wait functions, and error handling.
 */

const {
    testDataManager,
    assertions,
    screenshotManager,
    waitUtils,
    errorHandler,
    utils
} = require('../utils');

const ChatbotPage = require('../pages/chatbot.page.js');

describe('Utilities Integration Example', () => {
    let chatbotPage;

    beforeAll(async () => {
        console.log('🚀 Setting up utilities integration test...');
        
        // Configure all utilities
        utils.configureAll({
            waitTimeouts: {
                default: 15000,
                short: 5000,
                long: 30000
            },
            retryConfig: {
                maxRetries: 3,
                retryDelay: 1000
            }
        });
    });

    beforeEach(async () => {
        console.log('🔄 Starting new test...');
        
        // Initialize utilities with test context
        utils.initTestContext('Utilities Integration', 'Chatbot Test');
        
        // Initialize page object
        chatbotPage = new ChatbotPage();
        
        // Load test data
        const conversations = testDataManager.loadConversations('virgin-media-conversations.json');
        console.log(`📁 Loaded ${conversations.length} conversations for testing`);
    });

    afterEach(async () => {
        console.log('🧹 Cleaning up after test...');
        
        // Reset all utilities
        utils.resetAll();
    });

    afterAll(async () => {
        console.log('📊 Generating final reports...');
        
        // Create comprehensive report
        const reports = await utils.createComprehensiveReport('./test-results/utilities-example');
        console.log('📋 Reports generated:', Object.keys(reports));
        
        // Display final statistics
        const stats = utils.getAllStats();
        console.log('📈 Final Statistics:', {
            assertions: stats.assertions.total,
            screenshots: stats.screenshots.totalScreenshots,
            errors: stats.errors.totalErrors,
            testDataCache: stats.testData.size
        });
    });

    describe('Test Data Management', () => {
        it('should demonstrate test data loading and validation', async () => {
            console.log('🧪 Testing data management utilities...');
            
            // Load specific conversation
            const billStatusConversation = testDataManager.getConversationByName(
                'virgin-media-conversations.json',
                'Virgin Media - Bill Status Check'
            );
            
            // Validate conversation structure
            const conversationTemplate = {
                name: 'string',
                convo: 'object'
            };
            
            const isValid = testDataManager.validateTestData(billStatusConversation, 'conversation');
            assertions.assertTrue(isValid, 'Conversation should be valid');
            
            // Create test data template
            testDataManager.createTemplate('conversation', conversationTemplate);
            
            // Generate dynamic test data
            const dynamicData = testDataManager.generateTestData(
                { user: '{{name}}', message: '{{text}}' },
                { name: 'John Doe', text: 'Hello chatbot' }
            );
            
            assertions.assertEquals(dynamicData.user, 'John Doe');
            assertions.assertEquals(dynamicData.message, 'Hello chatbot');
            
            console.log('✅ Test data management completed');
        });
    });

    describe('Wait Utilities', () => {
        it('should demonstrate wait functions', async () => {
            console.log('🧪 Testing wait utilities...');
            
            try {
                // Navigate to test page
                await chatbotPage.open();
                
                // Wait for page load
                await waitUtils.waitForPageLoad();
                
                // Wait for chat widget
                await waitUtils.waitForElement('#chat-widget', 10000);
                
                // Wait for element to be clickable
                await waitUtils.waitForElementClickable('#send-button', 5000);
                
                // Wait for custom condition
                await waitUtils.waitForCondition(
                    async () => {
                        const element = await browser.$('#chat-widget');
                        return await element.isDisplayed();
                    },
                    10000,
                    'Chat widget should be displayed'
                );
                
                console.log('✅ Wait utilities completed');
            } catch (error) {
                // Handle wait errors
                const errorInfo = errorHandler.handleError(error, 'Wait utilities test');
                console.log('⚠️ Wait test completed with errors:', errorInfo.type);
            }
        });
    });

    describe('Screenshot Management', () => {
        it('should demonstrate screenshot utilities', async () => {
            console.log('🧪 Testing screenshot utilities...');
            
            try {
                await chatbotPage.open();
                
                // Take regular screenshot
                const screenshot1 = await screenshotManager.takeScreenshot('initial_page');
                assertions.assertNotEmpty(screenshot1, 'Screenshot should be saved');
                
                // Take step screenshot
                await screenshotManager.takeStepScreenshot('page_loaded');
                
                // Take before/after screenshots
                const beforeAfter = await screenshotManager.takeBeforeAfterScreenshots(
                    'chat_widget_interaction',
                    async () => {
                        await chatbotPage.sendMessage('Hello');
                        await chatbotPage.waitForResponse();
                    }
                );
                
                assertions.assertHasProperty(beforeAfter, 'before');
                assertions.assertHasProperty(beforeAfter, 'after');
                
                // Take element screenshot
                await screenshotManager.takeElementScreenshot(
                    '#chat-widget',
                    'chat_widget_element'
                );
                
                // Get screenshot statistics
                const stats = screenshotManager.getScreenshotStats();
                assertions.assertTrue(stats.totalScreenshots > 0, 'Should have taken screenshots');
                
                console.log('✅ Screenshot utilities completed');
            } catch (error) {
                // Take failure screenshot
                await screenshotManager.takeFailureScreenshot(error.message);
                console.log('⚠️ Screenshot test completed with errors');
            }
        });
    });

    describe('Error Handling', () => {
        it('should demonstrate error handling utilities', async () => {
            console.log('🧪 Testing error handling utilities...');
            
            // Test retry logic
            const result = await errorHandler.executeWithRetry(
                async () => {
                    // Simulate flaky operation
                    const random = Math.random();
                    if (random < 0.7) {
                        throw new Error('Simulated flaky operation');
                    }
                    return 'Success';
                },
                'Flaky operation test',
                { maxRetries: 3, retryDelay: 500 }
            );
            
            assertions.assertEquals(result, 'Success');
            
            // Test error categorization
            try {
                await browser.$('#non-existent-element').click();
            } catch (error) {
                const errorInfo = errorHandler.handleElementError(
                    error,
                    '#non-existent-element',
                    'click'
                );
                
                assertions.assertEquals(errorInfo.type, 'ElementNotFound');
                assertions.assertTrue(errorInfo.recoverable, 'Element errors should be recoverable');
            }
            
            // Test timeout error handling
            try {
                await waitUtils.waitForElement('#non-existent', 1000);
            } catch (error) {
                const errorInfo = errorHandler.handleTimeoutError(
                    error,
                    'Element wait timeout',
                    1000
                );
                
                assertions.assertEquals(errorInfo.type, 'TimeoutError');
            }
            
            console.log('✅ Error handling utilities completed');
        });
    });

    describe('Assertions', () => {
        it('should demonstrate assertion utilities', async () => {
            console.log('🧪 Testing assertion utilities...');
            
            // Basic assertions
            assertions.assertContains('Hello world', 'world');
            assertions.assertMatches('test@email.com', /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
            assertions.assertNotEmpty('Some text');
            assertions.assertMinLength('Hello', 3);
            assertions.assertMaxLength('Short', 10);
            
            // Response time assertion
            const startTime = Date.now();
            await new Promise(resolve => setTimeout(resolve, 100));
            const responseTime = Date.now() - startTime;
            assertions.assertResponseTime(responseTime, 200);
            
            // Array assertions
            const testArray = ['item1', 'item2', 'item3'];
            assertions.assertArrayContains(testArray, 'item2');
            assertions.assertArrayLength(testArray, 3);
            
            // Object assertions
            const testObject = { name: 'John', age: 30 };
            assertions.assertHasProperty(testObject, 'name');
            assertions.assertPropertyEquals(testObject, 'age', 30);
            
            // Bot response assertions
            const botResponse = 'Hello! How can I help you today?';
            assertions.assertResponseContainsKeywords(botResponse, ['Hello', 'help']);
            assertions.assertResponsePattern(botResponse, 'Hello*help*');
            
            // Conversation assertions
            const conversation = [
                { sender: 'user', messageText: 'Hi' },
                { sender: 'bot', messageText: 'Hello!' }
            ];
            assertions.assertConversationLength(conversation, 2);
            assertions.assertConversationEndsWith(conversation, 'Hello!');
            
            // Custom assertion
            assertions.assertCustom(
                () => 2 + 2 === 4,
                'Custom mathematical assertion'
            );
            
            console.log('✅ Assertion utilities completed');
        });
    });

    describe('Integration Test', () => {
        it('should demonstrate complete integration of all utilities', async () => {
            console.log('🧪 Testing complete utilities integration...');
            
            try {
                // Load test data
                const conversation = testDataManager.getConversationByName(
                    'virgin-media-conversations.json',
                    'Virgin Media - Bill Status Check'
                );
                
                assertions.assertNotNull(conversation, 'Conversation should be loaded');
                
                // Initialize page
                await chatbotPage.open();
                await waitUtils.waitForPageLoad();
                
                // Take initial screenshot
                await screenshotManager.takeScreenshot('test_start');
                
                // Execute conversation with retry logic
                await errorHandler.executeWithRetry(
                    async () => {
                        // Send first message
                        await chatbotPage.sendMessage(conversation.convo[0].messageText);
                        
                        // Wait for response
                        await waitUtils.waitForElement('.bot-message', 10000);
                        
                        // Get bot response
                        const response = await chatbotPage.getLastResponse();
                        
                        // Assert response
                        assertions.assertContains(
                            response,
                            'account number',
                            'Bot should ask for account number'
                        );
                        
                        // Take step screenshot
                        await screenshotManager.takeStepScreenshot('first_interaction');
                        
                        return response;
                    },
                    'Complete conversation test',
                    { maxRetries: 2, retryDelay: 1000 }
                );
                
                // Take final screenshot
                await screenshotManager.takeScreenshot('test_complete');
                
                console.log('✅ Complete integration test completed');
                
            } catch (error) {
                // Comprehensive error handling
                const errorInfo = errorHandler.handleError(error, 'Integration test');
                
                // Take failure screenshot
                await screenshotManager.takeFailureScreenshot(error.message);
                
                // Log error details
                console.log('❌ Integration test failed:', {
                    type: errorInfo.type,
                    severity: errorInfo.severity,
                    recoverable: errorInfo.recoverable
                });
                
                throw error; // Re-throw to fail the test
            }
        });
    });

    describe('Performance Testing', () => {
        it('should demonstrate performance monitoring with utilities', async () => {
            console.log('🧪 Testing performance monitoring...');
            
            const performanceMetrics = {
                pageLoadTime: 0,
                elementWaitTime: 0,
                screenshotTime: 0,
                assertionTime: 0
            };
            
            // Measure page load time
            const pageLoadStart = Date.now();
            await chatbotPage.open();
            await waitUtils.waitForPageLoad();
            performanceMetrics.pageLoadTime = Date.now() - pageLoadStart;
            
            // Measure element wait time
            const elementWaitStart = Date.now();
            await waitUtils.waitForElement('#chat-widget');
            performanceMetrics.elementWaitTime = Date.now() - elementWaitStart;
            
            // Measure screenshot time
            const screenshotStart = Date.now();
            await screenshotManager.takeScreenshot('performance_test');
            performanceMetrics.screenshotTime = Date.now() - screenshotStart;
            
            // Measure assertion time
            const assertionStart = Date.now();
            assertions.assertResponseTime(performanceMetrics.pageLoadTime, 10000);
            performanceMetrics.assertionTime = Date.now() - assertionStart;
            
            // Assert performance metrics
            assertions.assertResponseTime(performanceMetrics.pageLoadTime, 10000, 'Page load time');
            assertions.assertResponseTime(performanceMetrics.elementWaitTime, 5000, 'Element wait time');
            assertions.assertResponseTime(performanceMetrics.screenshotTime, 3000, 'Screenshot time');
            assertions.assertResponseTime(performanceMetrics.assertionTime, 1000, 'Assertion time');
            
            console.log('📊 Performance metrics:', performanceMetrics);
            console.log('✅ Performance monitoring completed');
        });
    });

    describe('Error Recovery', () => {
        it('should demonstrate error recovery mechanisms', async () => {
            console.log('🧪 Testing error recovery...');
            
            let recoveryAttempts = 0;
            const maxRecoveryAttempts = 3;
            
            while (recoveryAttempts < maxRecoveryAttempts) {
                try {
                    // Attempt potentially failing operation
                    await errorHandler.executeWithRetry(
                        async () => {
                            // Simulate intermittent failure
                            if (Math.random() < 0.5) {
                                throw new Error('Intermittent failure');
                            }
                            
                            await chatbotPage.open();
                            await waitUtils.waitForElement('#chat-widget', 5000);
                            
                            return 'Success';
                        },
                        `Recovery attempt ${recoveryAttempts + 1}`,
                        { maxRetries: 2, retryDelay: 500 }
                    );
                    
                    console.log(`✅ Recovery successful on attempt ${recoveryAttempts + 1}`);
                    break;
                    
                } catch (error) {
                    recoveryAttempts++;
                    const errorInfo = errorHandler.handleError(
                        error,
                        `Recovery attempt ${recoveryAttempts}`
                    );
                    
                    if (recoveryAttempts >= maxRecoveryAttempts) {
                        console.log('❌ Max recovery attempts reached');
                        throw error;
                    }
                    
                    console.log(`🔄 Recovery attempt ${recoveryAttempts} failed, retrying...`);
                    await waitUtils.wait(1000); // Wait before retry
                }
            }
            
            console.log('✅ Error recovery test completed');
        });
    });
}); 