const { remote } = require('webdriverio');

describe('Virgin Media Chatbot Manual Test', () => {
    let browser;

    beforeAll(async () => {
        browser = await remote({
            capabilities: {
                browserName: 'chrome',
                'goog:chromeOptions': {
                    args: [
                        '--no-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-web-security',
                        '--start-maximized',
                        '--disable-blink-features=AutomationControlled',
                        '--disable-extensions',
                        '--disable-plugins',
                        '--disable-images',
                        '--window-size=1920,1080'
                    ],
                    prefs: {
                        'profile.default_content_setting_values.notifications': 2,
                        'profile.default_content_setting_values.media_stream': 2,
                        'profile.default_content_setting_values.geolocation': 2
                    }
                }
            },
            logLevel: 'info'
        });
    });

    afterAll(async () => {
        if (browser) {
            await browser.deleteSession();
        }
    });

    it('should open Virgin Media website and start chat', async () => {
        console.log('🌐 Opening Virgin Media website...');
        await browser.url('https://www.virginmedia.com/help/moving-home');
        
        // Wait for page to load
        await browser.waitUntil(async () => {
            const title = await browser.getTitle();
            return title.includes('Virgin Media');
        }, { timeout: 10000, timeoutMsg: 'Page did not load properly' });
        
        console.log('✅ Virgin Media website loaded successfully');
        
        // Look for the chat button
        console.log('🔍 Looking for Virgin Media chat button...');
        const chatButton = await browser.$('#openChatIconVertical');
        
        if (await chatButton.isExisting()) {
            console.log('✅ Found Virgin Media chat button, clicking...');
            await chatButton.click();
            console.log('✅ Clicked Virgin Media chat button');
            
            // Wait for chat to load (20 seconds as specified)
            console.log('⏱️ Waiting 20 seconds for chat to load...');
            await browser.pause(20000);
            
            // Look for the input element
            console.log('🔍 Looking for chat input element...');
            const inputElement = await browser.$('.DraftEditor-root');
            
            if (await inputElement.isExisting()) {
                console.log('✅ Found chat input element (.DraftEditor-root)');
                console.log('✅ Chat is ready for interaction!');
                
                // Test typing in the input
                console.log('📝 Testing input functionality...');
                await inputElement.click();
                await inputElement.setValue('Hi, I need help with my bill');
                console.log('✅ Successfully typed message in chat input');
                
                // Wait a bit to see the result
                await browser.pause(5000);
                
            } else {
                console.log('❌ Chat input element (.DraftEditor-root) not found after 20 seconds');
            }
            
        } else {
            console.log('❌ Virgin Media chat button (#openChatIconVertical) not found');
        }
        
        // Take a screenshot
        await browser.saveScreenshot('./screenshots/virgin-media-manual-test.png');
        console.log('📸 Screenshot saved to ./screenshots/virgin-media-manual-test.png');
        
        // Keep browser open for a bit to see the result
        console.log('⏱️ Keeping browser open for 10 seconds to see the result...');
        await browser.pause(10000);
        
    }, 120000); // 2 minute timeout
}); 