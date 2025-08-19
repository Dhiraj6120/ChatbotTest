describe('Virgin Media Chatbot Demo Test', () => {
    it('should demonstrate Virgin Media chatbot interaction', async () => {
        console.log('Starting Virgin Media Chatbot Demo Test');
        console.log('Opening Virgin Media website...');
        
        try {
            // Navigate to Virgin Media website
            await browser.url('https://whoosh.int.virginmediao2.co.uk/support/help/moving-home');
            
            // Wait for page to load with a shorter timeout
            await browser.waitUntil(async () => {
                const title = await browser.getTitle();
                return title.includes('Virgin Media');
            }, { timeout: 10000, timeoutMsg: 'Page did not load properly' });
            
            console.log('Virgin Media website loaded successfully');
            
            // Look for the chat button
            console.log('Looking for Virgin Media chat button...');
            const chatButton = await browser.$('#openChatIconVertical');
            
            if (await chatButton.isExisting()) {
                console.log('Found Virgin Media chat button, clicking...');
                await chatButton.click();
                console.log('Clicked Virgin Media chat button');
                
                // Wait for chat to load (20 seconds as specified)
                console.log('Waiting 20 seconds for chat to load...');
                await browser.pause(20000);
                
                // Look for the input element
                console.log('Looking for chat input element...');
                const inputElement = await browser.$('.DraftEditor-root');
                
                if (await inputElement.isExisting()) {
                    console.log('Found chat input element (.DraftEditor-root)');
                    console.log('Chat is ready for interaction!');
                    
                    // Demo: Test typing in the input
                    console.log('Demo: Testing input functionality...');
                    await inputElement.click();
                    await inputElement.setValue('Hi, I need help with my bill');
                    console.log('Successfully typed demo message in chat input');
                    
                    // Wait a bit to see the result
                    await browser.pause(5000);
                    
                    console.log('Demo test completed successfully!');
                    
                } else {
                    console.log('Chat input element (.DraftEditor-root) not found after 20 seconds');
                }
                
            } else {
                console.log('Virgin Media chat button (#openChatIconVertical) not found');
            }
            
            // Take a screenshot for demo purposes
            await browser.saveScreenshot('./screenshots/virgin-media-demo-test.png');
            console.log('Demo screenshot saved to ./screenshots/virgin-media-demo-test.png');
            
            // Keep browser open for demo viewing (shorter time)
            console.log('Keeping browser open for 5 seconds for demo viewing...');
            await browser.pause(5000);
            
            console.log('Virgin Media Chatbot Demo Test completed!');
            
        } catch (error) {
            console.log(`Test failed with error: ${error.message}`);
            // Take screenshot on error
            await browser.saveScreenshot('./screenshots/virgin-media-demo-error.png');
            throw error;
        }
        
    }, 90000); // 90 second timeout (reduced from 120)
}); 