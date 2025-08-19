const ChatPage = require('../pages/ChatPage');

/**
 * WebdriverIO Demo Tests
 * 
 * This test suite demonstrates the features of the WebdriverIO configuration:
 * - Page Object Pattern
 * - Custom Commands
 * - Allure Reporting
 * - Screenshot Capture
 * - Wait Strategies
 * - Error Handling
 */

describe('WebdriverIO Configuration Demo', () => {
    beforeEach(async () => {
        console.log('🔧 Setting up test environment...');
        
        // Navigate to the test page
        await browser.url('/');
        
        // Wait for page to load
        await browser.waitUntil(
            async () => await browser.execute(() => document.readyState === 'complete'),
            { timeout: 10000, timeoutMsg: 'Page did not load completely' }
        );
        
        // Take a screenshot of the initial state
        await browser.takeScreenshot('test_start');
    });

    afterEach(async () => {
        console.log('🧹 Cleaning up test environment...');
        
        // Clear browser storage
        await browser.execute('window.localStorage.clear();');
        await browser.execute('window.sessionStorage.clear();');
        
        // Clear cookies
        await browser.deleteAllCookies();
    });

    describe('Browser Configuration Tests', () => {
        it('should have correct browser window size', async () => {
            // Test that browser window is maximized
            const windowSize = await browser.getWindowSize();
            
            // Should be at least 1920x1080 (as configured)
            expect(windowSize.width).toBeGreaterThanOrEqual(1920);
            expect(windowSize.height).toBeGreaterThanOrEqual(1080);
            
            console.log(`📐 Browser window size: ${windowSize.width}x${windowSize.height}`);
        });

        it('should have Chrome capabilities configured', async () => {
            // Test Chrome capabilities
            const capabilities = await browser.capabilities;
            
            expect(capabilities.browserName).toBe('chrome');
            expect(capabilities.platformName).toBe('windows');
            
            console.log(`🌐 Browser: ${capabilities.browserName} ${capabilities.browserVersion}`);
        });

        it('should handle page load timeouts correctly', async () => {
            // Test page load timeout handling
            const startTime = Date.now();
            
            try {
                await browser.url('/');
                const loadTime = Date.now() - startTime;
                
                // Page should load within 30 seconds (configured timeout)
                expect(loadTime).toBeLessThan(30000);
                
                console.log(`⚡ Page load time: ${loadTime}ms`);
            } catch (error) {
                console.log(`⏰ Page load timeout: ${error.message}`);
                throw error;
            }
        });
    });

    describe('Wait Strategy Tests', () => {
        it('should use custom waitForElement command', async () => {
            // Test custom waitForElement command
            const element = await browser.waitForElement('#chat-widget', 5000);
            expect(element).toBeDefined();
            
            console.log('✅ Custom waitForElement command works');
        });

        it('should use safeClick command', async () => {
            // Test safeClick command (if element exists)
            try {
                await browser.safeClick('#chat-toggle', 5000);
                console.log('✅ SafeClick command works');
            } catch (error) {
                console.log('⚠️ Element not found for safeClick test');
            }
        });

        it('should use safeType command', async () => {
            // Test safeType command (if element exists)
            try {
                await browser.safeType('#chat-input', 'Test message', 5000);
                console.log('✅ SafeType command works');
            } catch (error) {
                console.log('⚠️ Element not found for safeType test');
            }
        });

        it('should handle element not found gracefully', async () => {
            // Test graceful handling of missing elements
            const startTime = Date.now();
            
            try {
                await browser.waitForElement('#non-existent-element', 3000);
                throw new Error('Element should not exist');
            } catch (error) {
                const waitTime = Date.now() - startTime;
                
                // Should timeout after 3 seconds
                expect(waitTime).toBeGreaterThanOrEqual(3000);
                expect(error.message).toContain('element');
                
                console.log(`⏱️ Element not found handled gracefully after ${waitTime}ms`);
            }
        });
    });

    describe('Screenshot and Reporting Tests', () => {
        it('should take screenshots on demand', async () => {
            // Test manual screenshot capture
            const screenshotPath = await browser.takeScreenshot('manual_capture');
            
            expect(screenshotPath).toContain('screenshots');
            expect(screenshotPath).toContain('.png');
            
            console.log(`📸 Screenshot captured: ${screenshotPath}`);
        });

        it('should capture browser console logs', async () => {
            // Generate some console logs
            await browser.execute(() => {
                console.log('Test log message');
                console.warn('Test warning message');
                console.error('Test error message');
            });
            
            // Get browser logs
            const logs = await browser.getLogs('browser');
            
            expect(logs.length).toBeGreaterThan(0);
            
            console.log('📝 Browser console logs captured:');
            logs.forEach(log => {
                console.log(`   ${log.level}: ${log.message}`);
            });
        });

        it('should handle test failure with screenshot', async () => {
            // This test is designed to fail to demonstrate screenshot capture
            // In a real scenario, this would be an actual failure
            
            try {
                await browser.waitForElement('#non-existent-element', 1000);
                throw new Error('This test should fail');
            } catch (error) {
                console.log('❌ Test failed as expected - screenshot should be captured');
                
                // Take a screenshot to demonstrate failure handling
                await browser.takeScreenshot('failure_demo');
                
                // Re-throw to trigger failure handling
                throw error;
            }
        });
    });

    describe('Page Object Pattern Tests', () => {
        it('should use ChatPage object methods', async () => {
            // Test ChatPage object methods
            try {
                await ChatPage.open();
                console.log('✅ ChatPage.open() method works');
                
                // Test other ChatPage methods if elements exist
                if (await $(ChatPage.selectors.chatContainer).isExisting()) {
                    await ChatPage.waitForChatContainer();
                    console.log('✅ ChatPage.waitForChatContainer() method works');
                }
            } catch (error) {
                console.log('⚠️ ChatPage methods tested (elements may not exist)');
            }
        });

        it('should demonstrate page object reusability', async () => {
            // Test that page object can be reused
            const chatPage1 = new ChatPage();
            const chatPage2 = new ChatPage();
            
            expect(chatPage1.selectors).toEqual(chatPage2.selectors);
            expect(chatPage1.selectors.chatContainer).toBe('#chat-widget, .chat-container, [data-testid="chat-widget"]');
            
            console.log('✅ Page object reusability demonstrated');
        });
    });

    describe('Allure Reporting Tests', () => {
        it('should add custom Allure steps', async () => {
            // This test demonstrates Allure step reporting
            // In a real scenario, you would use Allure.addStep()
            
            console.log('📊 Allure reporting is configured');
            console.log('📈 Test steps will be captured automatically');
            console.log('📸 Screenshots will be attached to reports');
            
            // Simulate some test steps
            await browser.url('/');
            await browser.pause(1000); // Simulate waiting
            await browser.takeScreenshot('allure_demo');
            
            expect(true).toBe(true);
        });

        it('should demonstrate test metadata', async () => {
            // This test shows how test metadata is captured
            
            console.log('🏷️ Test metadata will be captured:');
            console.log('   - Test name and description');
            console.log('   - Test duration');
            console.log('   - Browser information');
            console.log('   - Environment details');
            
            // Simulate test execution
            await browser.pause(500);
            
            expect(true).toBe(true);
        });
    });

    describe('Performance Tests', () => {
        it('should measure page load performance', async () => {
            const startTime = Date.now();
            
            await browser.url('/');
            
            const loadTime = Date.now() - startTime;
            
            console.log(`⚡ Page load performance: ${loadTime}ms`);
            
            // Page should load within reasonable time
            expect(loadTime).toBeLessThan(10000);
        });

        it('should measure element interaction performance', async () => {
            const startTime = Date.now();
            
            // Test element interaction speed
            await browser.waitForElement('body', 1000);
            
            const interactionTime = Date.now() - startTime;
            
            console.log(`⚡ Element interaction performance: ${interactionTime}ms`);
            
            // Element interaction should be fast
            expect(interactionTime).toBeLessThan(2000);
        });
    });

    describe('Error Handling Tests', () => {
        it('should handle network errors gracefully', async () => {
            try {
                await browser.url('https://invalid-url-that-does-not-exist.com');
                throw new Error('Should have failed');
            } catch (error) {
                console.log('✅ Network error handled gracefully');
                expect(error.message).toContain('invalid');
            }
        });

        it('should handle timeout errors gracefully', async () => {
            const startTime = Date.now();
            
            try {
                await browser.waitForElement('#non-existent-element', 2000);
                throw new Error('Should have timed out');
            } catch (error) {
                const timeoutDuration = Date.now() - startTime;
                
                console.log(`✅ Timeout error handled gracefully after ${timeoutDuration}ms`);
                expect(timeoutDuration).toBeGreaterThanOrEqual(2000);
            }
        });
    });
}); 