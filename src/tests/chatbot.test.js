const ChatPage = require('../pages/ChatPage');

describe('Chatbot Testing Suite', () => {
    beforeEach(async () => {
        await ChatPage.open();
    });

    afterEach(async () => {
        // Clean up after each test
        await ChatPage.clearChat();
    });

    it('should display welcome message on page load', async () => {
        // Wait for initial bot message
        await ChatPage.waitForBotResponse();
        
        const messages = await ChatPage.getAllMessages();
        expect(messages.length).toBeGreaterThan(0);
        
        const botMessages = messages.filter(msg => msg.isBot);
        expect(botMessages.length).toBeGreaterThan(0);
    });

    it('should respond to user greeting', async () => {
        const greeting = 'Hello';
        await ChatPage.sendMessage(greeting);
        await ChatPage.waitForBotResponse();
        
        const botResponse = await ChatPage.getLastBotMessage();
        expect(botResponse).toBeTruthy();
        expect(botResponse.length).toBeGreaterThan(0);
    });

    it('should handle multiple conversation turns', async () => {
        // First message
        await ChatPage.sendMessage('Hi there');
        await ChatPage.waitForBotResponse();
        
        // Second message
        await ChatPage.sendMessage('How are you?');
        await ChatPage.waitForBotResponse();
        
        const messages = await ChatPage.getAllMessages();
        expect(messages.length).toBeGreaterThanOrEqual(4); // At least 2 user + 2 bot messages
    });

    it('should handle empty message gracefully', async () => {
        await ChatPage.sendMessage('');
        await ChatPage.waitForBotResponse();
        
        const botResponse = await ChatPage.getLastBotMessage();
        // Should either not respond or give an error message
        expect(botResponse).toBeDefined();
    });

    it('should maintain conversation context', async () => {
        // Send a question that requires context
        await ChatPage.sendMessage('What is your name?');
        await ChatPage.waitForBotResponse();
        
        const firstResponse = await ChatPage.getLastBotMessage();
        
        // Follow up question
        await ChatPage.sendMessage('Can you repeat that?');
        await ChatPage.waitForBotResponse();
        
        const secondResponse = await ChatPage.getLastBotMessage();
        
        // Both responses should be meaningful
        expect(firstResponse).toBeTruthy();
        expect(secondResponse).toBeTruthy();
    });
}); 